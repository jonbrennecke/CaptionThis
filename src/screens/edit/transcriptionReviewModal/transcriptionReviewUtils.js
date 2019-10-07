// @flow
import dropRightWhile from 'lodash/dropRightWhile';
import first from 'lodash/first';
import last from 'lodash/last';
import remove from 'lodash/remove';
import drop from 'lodash/drop';
import dropRight from 'lodash/dropRight';
import sortBy from 'lodash/sortBy';
import { List } from 'immutable';

import type { SpeechTranscriptionSegment } from '../../../types';

export type IndexedSpeechTranscriptionSegment = {
  index: number,
  segment: SpeechTranscriptionSegment,
};

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
  const indexedSegments = Array.from(originalSegments).map(
    (segment, index) => ({ index, segment })
  );
  let indexedWords = text
    .split(/\s+/)
    .map((substring, index) => ({ index, substring }));

  let expectedSubstringLeft = '';
  const unchangedSegmentsLeft = remove(indexedSegments, ({ segment }) => {
    expectedSubstringLeft += segment.substring;
    const segmentIsUnchanged = text.startsWith(
      `${expectedSubstringLeft.trimRight()} `
    );
    if (!isWhitespaceOrNewline(segment.substring) && segmentIsUnchanged) {
      indexedWords = drop(indexedWords, 1);
    }
    return segmentIsUnchanged;
  }).map(({ segment }) => segment);

  let expectedSubstringRight = '';
  const unchangedSegmentsRight = remove(
    indexedSegments.reverse(),
    ({ segment }) => {
      expectedSubstringRight = `${segment.substring}${expectedSubstringRight}`;
      const segmentIsUnchanged = text.endsWith(
        ` ${expectedSubstringRight.trimLeft()}`
      );
      if (!isWhitespaceOrNewline(segment.substring) && segmentIsUnchanged) {
        indexedWords = dropRight(indexedWords, 1);
      }
      return segmentIsUnchanged;
    }
  ).map(({ segment }) => segment);

  if (!indexedSegments.length) {
    if (indexedWords.length > indexedSegments.length) {
      const originalSegmentsWithoutWhitespace = originalSegments.filter(
        s => !isWhitespaceOrNewline(s.substring)
      );
      const diff = new SpeechTranscriptionSegmentDiff(
        originalSegmentsWithoutWhitespace
      );
      indexedWords.forEach(({ substring, index }) => {
        if (index >= diff.size) {
          const segment = diff.last;
          if (segment) {
            diff.set(index - 1, {
              ...segment,
              substring: `${segment.substring} ${substring}`,
            });
          }
        } else if (index === 0) {
          const segment = diff.first;
          if (segment) {
            diff.set(0, {
              ...segment,
              substring: `${substring} ${segment.substring}`,
            });
          }
        } else {
          const leftSegment = diff.get(index - 1);
          const rightSegment = diff.get(index);
          if (leftSegment && rightSegment) {
            const timestamp =
              (leftSegment.timestamp + rightSegment.timestamp) / 2;
            const duration = leftSegment.duration / 2;
            diff.set(index - 1, {
              ...leftSegment,
              duration: leftSegment.duration - duration,
            });
            diff.insert(index, {
              duration,
              confidence: 1,
              timestamp,
              substring,
              alternativeSubstrings: [],
            });
          }
        }
      });
      return interpolateSegments(diff.segments.toArray());
    }
    return originalSegments;
  }
  const substring = indexedWords.map(w => w.substring).join(' ');
  const firstChangedSegment: ?SpeechTranscriptionSegment = first(
    indexedSegments
  ).segment;
  const lastChangedSegment: ?SpeechTranscriptionSegment = last(indexedSegments)
    .segment;
  if (!firstChangedSegment || !lastChangedSegment) {
    return originalSegments;
  }
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

class SpeechTranscriptionSegmentDiff {
  segments: List<SpeechTranscriptionSegment>;

  constructor(segments: Iterable<SpeechTranscriptionSegment>) {
    this.segments = List(segments);
  }

  insert(index: number, segment: SpeechTranscriptionSegment) {
    this.segments = this.segments.insert(index, segment);
  }

  set(index: number, segment: SpeechTranscriptionSegment) {
    this.segments = this.segments.set(index, segment);
  }

  get(index: number): ?SpeechTranscriptionSegment {
    return this.segments.get(index);
  }

  get size(): number {
    return this.segments.size;
  }

  get first(): ?SpeechTranscriptionSegment {
    return this.segments.first();
  }

  get last(): ?SpeechTranscriptionSegment {
    return this.segments.last();
  }
}

export function renderTextFromSegments(
  segments: Array<SpeechTranscriptionSegment>
): string {
  return segments.reduce((acc, segment) => {
    return (acc += segment.substring);
  }, '');
}

function isWhitespaceOrNewline(str: string): boolean {
  return /\s+/.test(str);
}
