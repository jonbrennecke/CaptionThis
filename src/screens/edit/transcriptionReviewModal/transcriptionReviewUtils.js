// @flow
import dropRightWhile from 'lodash/dropRightWhile';
import first from 'lodash/first';
import last from 'lodash/last';
import remove from 'lodash/remove';
import drop from 'lodash/drop';
import dropRight from 'lodash/dropRight';
import sortBy from 'lodash/sortBy';

import type { SpeechTranscriptionSegment } from '../../../types';

export function findIndexOfSegmentAtPlaybackTime(
  segments: Array<SpeechTranscriptionSegment>,
  playbackTime: number
) {
  return segments.findIndex(s => {
    return (
      playbackTime >= s.timestamp && playbackTime <= s.timestamp + s.duration
    );
  });
}

export function interpolateSegments(
  segments: Array<SpeechTranscriptionSegment>
): Array<SpeechTranscriptionSegment> {
  let outputSegments: Array<SpeechTranscriptionSegment> = [];
  segments.forEach(segment => {
    const words = segment.substring.split(/\s+/).filter(s => !!s);
    const durationPerWord = segment.duration / words.length;
    words.forEach((word, index) => {
      outputSegments.push({
        duration: durationPerWord,
        timestamp: segment.timestamp + index * durationPerWord,
        substring: word,
        confidence: segment.confidence,
        alternativeSubstrings: [],
      });
      outputSegments.push({
        duration: durationPerWord,
        timestamp: segment.timestamp + index * durationPerWord,
        substring: ' ',
        confidence: segment.confidence,
        alternativeSubstrings: [],
      });
    });
  });
  return trimSegments(sortBy(outputSegments, s => s.timestamp));
}

export function trimSegments(
  segments: Array<SpeechTranscriptionSegment>
): Array<SpeechTranscriptionSegment> {
  return dropRightWhile(segments, segment => /\s+/.test(segment.substring));
}

export function findSegmentsInSelection(
  segments: Array<SpeechTranscriptionSegment>,
  selection: { start: number, end: number }
) {
  let formattedStringCharLength = 0;
  const segmentPositions = segments.map((segment, index) => {
    const firstCharIndex = formattedStringCharLength;
    const lastCharIndex = firstCharIndex + segment.substring.length;
    formattedStringCharLength = lastCharIndex;
    return {
      segment,
      index,
      lastCharIndex,
      firstCharIndex,
    };
  });
  const selectedSegments = segmentPositions.filter(
    ({ firstCharIndex, lastCharIndex }) => {
      const selectionIsInsideSegment =
        selection.start >= firstCharIndex && selection.end < lastCharIndex;
      const selectionContainsSegment =
        selection.start <= firstCharIndex && selection.end >= lastCharIndex;
      const multiwordSelectionBeginsInsideSegment =
        selection.start >= firstCharIndex &&
        selection.start < lastCharIndex &&
        selection.end >= selection.start;
      const multiwordSelectionEndsInsideSegment =
        selection.end > firstCharIndex &&
        selection.end < lastCharIndex &&
        selection.start <= firstCharIndex;
      return (
        selectionIsInsideSegment ||
        selectionContainsSegment ||
        multiwordSelectionBeginsInsideSegment ||
        multiwordSelectionEndsInsideSegment
      );
    }
  );
  const firstSelectedSegment = first(selectedSegments);
  const lastSelectedSegment = last(selectedSegments);
  return selectedSegments.length
    ? {
        startIndex: firstSelectedSegment.index,
        endIndex: lastSelectedSegment.index,
      }
    : null;
}

export function transformSegmentsByTextDiff(
  text: string,
  originalSegments: Array<SpeechTranscriptionSegment>
) {
  const mutableSegments = Array.from(originalSegments);
  let words = text
    .split(/\s+/)
    .map((substring, index) => ({ index, substring }));

  let expectedSubstringLeft = '';
  const unchangedSegmentsLeft = remove(mutableSegments, segment => {
    expectedSubstringLeft += segment.substring;
    const segmentIsUnchanged = text.startsWith(expectedSubstringLeft);
    if (!isWhitespaceOrNewline(segment.substring) && segmentIsUnchanged) {
      words = drop(words, 1);
    }
    return segmentIsUnchanged;
  });

  let expectedSubstringRight = '';
  const unchangedSegmentsRight = remove(mutableSegments.reverse(), segment => {
    expectedSubstringRight = `${segment.substring}${expectedSubstringRight}`;
    const segmentIsUnchanged = text.endsWith(expectedSubstringRight);
    if (!isWhitespaceOrNewline(segment.substring) && segmentIsUnchanged) {
      words = dropRight(words, 1);
    }
    return segmentIsUnchanged;
  });
  const changedSegments = mutableSegments;
  if (!changedSegments.length) {
    if (words.length > changedSegments.length) {
      const newSegments = words.map(({ substring, index }) => {
        const segment = originalSegments[index];
        return {
          ...segment,
          substring: `${substring} ${segment.substring}`,
        };
      });
      return interpolateSegments([
        ...unchangedSegmentsLeft,
        ...newSegments,
        ...unchangedSegmentsRight,
      ]);
    }
    return originalSegments;
  }
  const substring = words.map(w => w.substring).join(' ');
  const firstChangedSegment = first(changedSegments);
  const lastChangedSegment = last(changedSegments);
  const timestamp = firstChangedSegment.timestamp;
  const duration =
    lastChangedSegment.timestamp - timestamp + lastChangedSegment.duration;
  const newSegment = {
    duration,
    timestamp,
    substring,
    confidence: 1,
    alternativeSubstrings: [],
  };
  return interpolateSegments([
    ...unchangedSegmentsLeft,
    newSegment,
    ...unchangedSegmentsRight,
  ]);
}

function isWhitespaceOrNewline(str: string): boolean {
  return /\s+/.test(str);
}
