// Define types for stroke data
export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface Stroke {
  points: Point[];
  color: string;
  brushSize: number;
  pathData?: string;
}

export interface StrokeCenter {
  x: number;
  y: number;
}

// Define color and brush size options
export const COLORS = ["#e03131", "#1971c2", "#2f9e44", "#f08c00", "#1e1e1e"];
export const BRUSH_SIZES = [4, 9, 15];
export const ENTROPY_SIZES = [128, 160, 192, 224, 256];
