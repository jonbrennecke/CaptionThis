// @flow
import last from 'lodash/last';
import first from 'lodash/first';

import {
  transformSegmentsByTextDiff,
  interpolateSegments,
  renderTextFromSegments,
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
    const changedText = 'the quick blue fox';
    const transformedSegments = transformSegmentsByTextDiff(
      changedText,
      segments
    );
    expect(transformedSegments[4].substring).toBe('blue');
    expect(renderTextFromSegments(transformedSegments)).toBe(changedText);
  });

  it('produces the expected result when multiple words/segments are changed', () => {
    const changedText = 'the slow blue fox';
    const transformedSegments = transformSegmentsByTextDiff(
      changedText,
      segments
    );
    expect(transformedSegments[2].substring).toBe('slow');
    expect(transformedSegments[4].substring).toBe('blue');
    expect(renderTextFromSegments(transformedSegments)).toBe(changedText);
  });

  it('produces the expected result when the first word/segment is changed', () => {
    const changedText = 'a quick brown fox';
    const transformedSegments = transformSegmentsByTextDiff(
      changedText,
      segments
    );
    expect(first(transformedSegments).substring).toBe('a');
    expect(renderTextFromSegments(transformedSegments)).toBe(changedText);
  });

  it('produces the expected result when the last word/segment is changed', () => {
    const changedText = 'the quick brown cat';
    const transformedSegments = transformSegmentsByTextDiff(
      changedText,
      segments
    );
    expect(last(transformedSegments).substring).toBe('cat');
    expect(renderTextFromSegments(transformedSegments)).toBe(changedText);
  });

  it('produces the expected result when a new segment is inserted at the end', () => {
    const changedText = 'the quick brown fox jumped';
    const transformedSegments = transformSegmentsByTextDiff(
      changedText,
      segments
    );
    expect(first(transformedSegments).substring).toBe('the');
    expect(last(transformedSegments).substring).toBe('jumped');
    expect(renderTextFromSegments(transformedSegments)).toBe(changedText);
  });

  it('produces the expected result when a new segment is inserted at the beginning', () => {
    const changedText = 'when the quick brown fox';
    const transformedSegments = transformSegmentsByTextDiff(
      changedText,
      segments
    );
    expect(first(transformedSegments).substring).toBe('when');
    expect(last(transformedSegments).substring).toBe('fox');
    expect(renderTextFromSegments(transformedSegments)).toBe(changedText);
  });

  it('produces the expected result when multiple new segments are inserted in the middle', () => {
    const changedText = 'the quick very dark brown fox';
    const transformedSegments = transformSegmentsByTextDiff(
      changedText,
      segments
    );
    expect(first(transformedSegments).substring).toBe('the');
    expect(last(transformedSegments).substring).toBe('fox');
    expect(renderTextFromSegments(transformedSegments)).toBe(changedText);
  });

  it('produces the expected result when a segment is deleted from the beginning', () => {
    const changedText = 'quick brown fox';
    const transformedSegments = transformSegmentsByTextDiff(
      changedText,
      segments
    );
    expect(first(transformedSegments).substring).toBe('quick');
    expect(last(transformedSegments).substring).toBe('fox');
    expect(renderTextFromSegments(transformedSegments)).toBe(changedText);
  });

  it('produces the expected result when a segment is deleted from the middle', () => {
    const changedText = 'the quick fox';
    const transformedSegments = transformSegmentsByTextDiff(
      changedText,
      segments
    );
    expect(first(transformedSegments).substring).toBe('the');
    expect(transformedSegments[2].substring).toBe('quick');
    expect(last(transformedSegments).substring).toBe('fox');
    expect(renderTextFromSegments(transformedSegments)).toBe(changedText);
  });

  it('produces the expected result with no changes', () => {
    const changedText = 'the quick brown fox';
    const transformedSegments = transformSegmentsByTextDiff(
      changedText,
      segments
    );
    expect(first(transformedSegments).substring).toBe('the');
    expect(last(transformedSegments).substring).toBe('fox');
    expect(renderTextFromSegments(transformedSegments)).toBe(changedText);
  });

  it('produces the expected result when two segments are deleted', () => {
    const changedText = 'the fox';
    const transformedSegments = transformSegmentsByTextDiff(
      changedText,
      segments
    );
    expect(first(transformedSegments).substring).toBe('the');
    expect(last(transformedSegments).substring).toBe('fox');
    expect(renderTextFromSegments(transformedSegments)).toBe(changedText);
  });

  it('produces the expected result when two segments are merged', () => {
    const changedText = 'the quick brown fox';
    const transformedSegments = transformSegmentsByTextDiff(
      changedText,
      segments
    );
    expect(first(transformedSegments).substring).toBe('the');
    expect(last(transformedSegments).substring).toBe('fox');
    expect(renderTextFromSegments(transformedSegments)).toBe(changedText);
  });

  it('produces the expected result when a change is made to the beginning of a word', () => {
    const changedText = 'the quick tbrown fox';
    const transformedSegments = transformSegmentsByTextDiff(
      changedText,
      segments
    );
    expect(first(transformedSegments).substring).toBe('the');
    expect(last(transformedSegments).substring).toBe('fox');
    expect(renderTextFromSegments(transformedSegments)).toBe(changedText);
  });
});
