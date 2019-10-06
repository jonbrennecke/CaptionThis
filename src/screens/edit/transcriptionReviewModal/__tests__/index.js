// @flow
import type { SpeechTranscriptionSegment } from '../../../../types';

import { transformSegmentsByTextDiff, interpolateSegments } from '../transcriptionReviewUtils';

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
  }
]);

describe('transformSegmentsByTextDiff', () => {
  it('transforms segments when a single word/segment is  hanged', async () => {
    const transformedSegments = transformSegmentsByTextDiff('the quick blue fox', segments);
    expect(transformedSegments[4].substring).toBe('blue');
  });
});
