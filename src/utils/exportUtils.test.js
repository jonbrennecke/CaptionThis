import { normalizeVideoDimensions } from './exportUtils';

describe('normalizeVideoDimensions', () => {
  it('should normalize the dimensions of a video in "up" orientation', () => {
    const dimensions = normalizeVideoDimensions(
      {
        width: 1920,
        height: 1080,
      },
      'up'
    );
    expect(dimensions.height).toBe(1920);
    expect(dimensions.width).toBe(1080);
  });

  it('should not change the dimensions if they are already in the correct format', () => {
    const dimensions = normalizeVideoDimensions(
      {
        width: 1080,
        height: 1920,
      },
      'up'
    );
    expect(dimensions.height).toBe(1920);
    expect(dimensions.width).toBe(1080);
  });

  it('should normalize the dimensions of a video in "right" orientation', () => {
    const dimensions = normalizeVideoDimensions(
      {
        width: 1080,
        height: 1920,
      },
      'right'
    );
    expect(dimensions.width).toBe(1920);
    expect(dimensions.height).toBe(1080);
  });
});
