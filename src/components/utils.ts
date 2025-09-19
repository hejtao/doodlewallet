import { Point, StrokeCenter, ENTROPY_SIZES } from '@/components/types';

// Function to calculate distance between two points
export const calculateDistance = (point1: StrokeCenter, point2: StrokeCenter): number => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

// Function to calculate minimum bounding rectangle center
export const calculateStrokeCenter = (points: Point[]): StrokeCenter => {
  if (points.length === 0) return { x: 0, y: 0 };

  let sumX = 0;
  let sumY = 0;

  points.forEach((point) => {
    sumX += point.x;
    sumY += point.y;
  });

  return {
    x: sumX / points.length,
    y: sumY / points.length,
  };
};

export const getEntropySizeIndex = (strokeCount: number) => {
  let index = Math.floor(strokeCount / 32) - 4;
  if (index < 0) index = 0;
  if (index >= ENTROPY_SIZES.length - 1) index = ENTROPY_SIZES.length - 1;
  return index;
};

export const getNextEntropySize = (strokeCount: number) => {
  const lastIndex = ENTROPY_SIZES.length - 1;
  if (strokeCount >= ENTROPY_SIZES[lastIndex]) return ENTROPY_SIZES[lastIndex];
  const index = getEntropySizeIndex(strokeCount);
  const entropySize = ENTROPY_SIZES[index];
  if (strokeCount > entropySize) return ENTROPY_SIZES[index + 1];
  return entropySize;
};

export const getMnemonicWordCount = (strokeCount: number) => {
  const index = getEntropySizeIndex(strokeCount);
  const entropySize = ENTROPY_SIZES[index];
  return (entropySize / 32 + entropySize) / 11;
};

export const calculateChecksum = async (entropy: string, entropySize: number) => {
  const bytes = [];
  for (let i = 0; i < entropy.length; i += 8) {
    const byte = entropy.slice(i, i + 8);
    bytes.push(parseInt(byte, 2));
  }
  const hash = await crypto.subtle.digest('SHA-256', new Uint8Array(bytes));
  const hashArray = new Uint8Array(hash);
  const firstByte = Array.from(hashArray)[0];
  return firstByte
    .toString(2)
    .padStart(8, '0')
    .slice(0, entropySize / 32);
};

// Perfect-freehand utility functions
export const getSvgPathFromStroke = (stroke: number[][]): string => {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );

  d.push('Z');
  return d.join(' ');
};

// Convert mouse/touch events to pressure-sensitive points
export const getPointFromEvent = (
  e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
): Point => {
  const rect = canvas.getBoundingClientRect();
  
  if ('touches' in e) {
    // Touch event
    const touch = e.touches[0] || e.changedTouches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
      pressure: 'force' in touch ? (touch.force as number) : 0.5
    };
  } else {
    // Mouse event
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: 'pressure' in e ? (e.pressure as number) : 0.5
    };
  }
};

// Convert Point array to perfect-freehand input format
export const pointsToInputPoints = (points: Point[]): number[][] => {
  return points.map(point => [point.x, point.y, point.pressure || 0.5]);
};