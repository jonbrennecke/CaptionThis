// @flow
import last from 'lodash/last';
import first from 'lodash/first';

import {
  transformSegmentsByTextDiff,
  interpolateSegments,
} from '../transcriptionReviewUtils';

const segments = interpolateSegments([
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

  it('produces the expected result when a new segment is inserted at the beginning', () => {
    const transformedSegments = transformSegmentsByTextDiff(
      'when the quick brown fox',
      segments
    );
    expect(first(transformedSegments).substring).toBe('when');
    expect(last(transformedSegments).substring).toBe('fox');
  });

  it('produces the expected result when a segment is deleted from the beginning', () => {
    const transformedSegments = transformSegmentsByTextDiff(
      'quick brown fox',
      segments
    );
    expect(first(transformedSegments).substring).toBe('quick');
    expect(last(transformedSegments).substring).toBe('fox');
  });

  it('produces the expected result when a segment is deleted from the middle', () => {
    const transformedSegments = transformSegmentsByTextDiff(
      'the quick fox',
      segments
    );
    expect(first(transformedSegments).substring).toBe('the');
    expect(transformedSegments[2].substring).toBe('quick');
    expect(last(transformedSegments).substring).toBe('fox');
  });

  it('produces the expected result with no changes', () => {
    const transformedSegments = transformSegmentsByTextDiff(
      'the quick brown fox',
      segments
    );
    expect(first(transformedSegments).substring).toBe('the');
    expect(last(transformedSegments).substring).toBe('fox');
  });
});
