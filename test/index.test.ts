import { describe, it, expect } from 'vitest';
import { intersection, union, diff } from '../src/index';

describe('GreinerHormann', () => {
  describe('intersection with object points', () => {
    it('should calculate intersection of two overlapping rectangles', () => {
      const result = intersection(
        [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
          { x: 100, y: 100 },
          { x: 0, y: 100 },
          { x: 0, y: 0 },
        ],
        [
          { x: 10, y: 40 },
          { x: 110, y: 40 },
          { x: 110, y: 140 },
          { x: 10, y: 140 },
          { x: 10, y: 40 },
        ]
      );

      expect(result).toBeTruthy();
      expect(Array.isArray(result)).toBe(true);
      if (result) {
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].length).toBeGreaterThan(0);
        // Check that result contains object points
        expect(result[0][0]).toHaveProperty('x');
        expect(result[0][0]).toHaveProperty('y');
      }
    });
  });

  describe('intersection with array points', () => {
    it('should calculate intersection of two overlapping rectangles', () => {
      const result = intersection(
        [
          [0, 0],
          [100, 0],
          [100, 100],
          [0, 100],
          [0, 0],
        ],
        [
          [10, 40],
          [110, 40],
          [110, 140],
          [10, 140],
          [10, 40],
        ]
      );

      expect(result).toBeTruthy();
      expect(Array.isArray(result)).toBe(true);
      if (result) {
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].length).toBeGreaterThan(0);
        // Check that result contains array points
        expect(Array.isArray(result[0][0])).toBe(true);
      }
    });
  });

  describe('union', () => {
    it('should calculate union of two rectangles', () => {
      const result = union(
        [
          [0, 0],
          [50, 0],
          [50, 50],
          [0, 50],
          [0, 0],
        ],
        [
          [25, 25],
          [75, 25],
          [75, 75],
          [25, 75],
          [25, 25],
        ]
      );

      expect(result).toBeTruthy();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('diff', () => {
    it('should calculate difference of two rectangles', () => {
      const result = diff(
        [
          [0, 0],
          [100, 0],
          [100, 100],
          [0, 100],
          [0, 0],
        ],
        [
          [25, 25],
          [75, 25],
          [75, 75],
          [25, 75],
          [25, 25],
        ]
      );

      expect(result).toBeTruthy();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('non-overlapping polygons', () => {
    it('intersection should return null for non-overlapping polygons', () => {
      const result = intersection(
        [
          [0, 0],
          [10, 0],
          [10, 10],
          [0, 10],
          [0, 0],
        ],
        [
          [20, 20],
          [30, 20],
          [30, 30],
          [20, 30],
          [20, 20],
        ]
      );

      expect(result).toBeNull();
    });

    it('union should return both polygons for non-overlapping polygons', () => {
      const result = union(
        [
          [0, 0],
          [10, 0],
          [10, 10],
          [0, 10],
          [0, 0],
        ],
        [
          [20, 20],
          [30, 20],
          [30, 30],
          [20, 30],
          [20, 20],
        ]
      );

      expect(result).toBeTruthy();
      expect(Array.isArray(result)).toBe(true);
      if (result) {
        expect(result.length).toBe(2);
      }
    });
  });
});
