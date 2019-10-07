// @flow
import last from 'lodash/last';

import {
  transformSegmentsByTextDiff,
  interpolateSegments,
} from '../transcriptionReviewUtils';

import type { SpeechTranscriptionSegment } from '../../../../types';

const segments: Array<SpeechTranscriptionSegment> = interpolateSegments([
  {
    substring: 'the',
    duration: 0.25,
    confidence: 1,
    alternativeSubstrings: [],
    timestamp: 0,
  },
  {
    substring: 'quick',
    duration: 0.25,
    confidence: 1,
    alternativeSubstrings: [],
    timestamp: 0.25,
  },
  {
    substring: 'brown',
    duration: 0.25,
    confidence: 1,
    alternativeSubstrings: [],
    timestamp: 0.5,
  },
  {
    substring: 'fox',
    duration: 0.25,
    confidence: 1,
    alternativeSubstrings: [],
    timestamp: 0.75,
  },
]);

describe('transformSegmentsByTextDiff', () => {
  it('produces the expected result when a single word/segment is changed', () => {
    const transformedSegments = transformSegmentsByTextDiff(
      'the quick blue fox',
      segments
    );
    expect(transformedSegments[4].substring).toBe('blue');
  });

  it('produces the expected result when multiple words/segments are changed', () => {
    const transformedSegments = transformSegmentsByTextDiff(
      'the slow blue fox',
      segments
    );
    expect(transformedSegments[2].substring).toBe('slow');
    expect(transformedSegments[4].substring).toBe('blue');
  });

  it('produces the expected result when the first word/segment is changed', () => {
    const transformedSegments = transformSegmentsByTextDiff(
      'a quick brown fox',
      segments
    );
    expect(transformedSegments[0].substring).toBe('a');
  });

  it('produces the expected result when the last word/segment is changed', () => {
    const transformedSegments = transformSegmentsByTextDiff(
      'the quick brown cat',
      segments
    );
    expect(last(transformedSegments).substring).toBe('cat');
  });
});
