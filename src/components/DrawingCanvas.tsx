import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { getStroke } from 'perfect-freehand';
import { Stroke, Point } from '@/components/types';
import { getSvgPathFromStroke, pointsToInputPoints } from '@/components/utils';
import '@/components/DrawingCanvas.css';

interface DrawingCanvasProps {
  strokes: Stroke[];
  currentStroke: Point[]; // Current stroke being drawn
  currentColor: string; // Current drawing color
  currentBrushSize: number; // Current brush size
  onStartDrawing: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onDraw: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onStopDrawing: () => void;
  onUndo: () => void;
  onClear: () => void;
}

export interface DrawingCanvasRef {
  clearCurrentStrokeFromCanvas: () => void;
  getCanvas: () => HTMLCanvasElement | null;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
  (
    {
      strokes,
      currentStroke,
      currentColor,
      currentBrushSize,
      onStartDrawing,
      onDraw,
      onStopDrawing,
      onUndo,
      onClear,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Function to render a single stroke
    const renderStroke = (
      points: Point[],
      color: string,
      brushSize: number,
      isTemporary: boolean = false
    ) => {
      if (points.length === 0) return null;

      // Convert points to perfect-freehand format
      const inputPoints = pointsToInputPoints(points);

      // Get stroke outline using perfect-freehand with optimized settings
      const outlinePoints = getStroke(inputPoints, {
        size: brushSize * 1.2, // Scale up for better visibility
        thinning: 0.5, // How much pressure affects the stroke width
        smoothing: 0.5, // How much to smooth the stroke
        streamline: 0.5, // How much to streamline the stroke
        simulatePressure: true, // Simulate pressure based on velocity
      });

      // Convert to SVG path
      const pathData = getSvgPathFromStroke(outlinePoints);

      // Create SVG path element
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', color);
      path.setAttribute('stroke', 'none');

      if (isTemporary) {
        path.setAttribute('data-temporary', 'true');
      }

      return path;
    };

    // Function to redraw all strokes using perfect-freehand
    const redrawAllStrokes = () => {
      const svg = svgRef.current;
      if (!svg) return;

      // Clear existing paths
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }

      // Redraw all completed strokes
      strokes.forEach((stroke, index) => {
        const path = renderStroke(stroke.points, stroke.color, stroke.brushSize);
        if (path) {
          path.setAttribute('data-stroke-index', index.toString());
          svg.appendChild(path);
        }
      });

      // Render current stroke being drawn (real-time display of stroke in progress)
      if (currentStroke.length > 0) {
        const path = renderStroke(currentStroke, currentColor, currentBrushSize, true);
        if (path) {
          svg.appendChild(path);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      clearCurrentStrokeFromCanvas: () => {
        redrawAllStrokes();
      },
      getCanvas: () => canvasRef.current,
    }));

    // Effect to handle strokes changes (for undo/clear operations)
    useEffect(() => {
      redrawAllStrokes();
    }, [strokes]);

    useEffect(() => {
      const canvas = canvasRef.current;
      const svg = svgRef.current;
      if (!canvas || !svg) return;

      const resizeCanvas = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
      
        canvas.width = width;
        canvas.height = height;
      
        svg.setAttribute('width', width.toString());
        svg.setAttribute('height', height.toString());
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      
        // Redraw all strokes after resizing
        redrawAllStrokes();
      };

      // Initial canvas size setup
      resizeCanvas();

      // Listen for window resize events
      window.addEventListener('resize', resizeCanvas);

      // Cleanup event listeners
      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }, [strokes, currentStroke]);

    return (
      <div className='canvas'>
        {/* Invisible canvas for event handling */}
        <canvas
          ref={canvasRef}
          onMouseDown={onStartDrawing}
          onMouseMove={onDraw}
          onMouseUp={onStopDrawing}
          onMouseLeave={onStopDrawing}
        />
        {/* SVG for rendering perfect-freehand strokes */}
        <svg ref={svgRef} className='svg' />
        
        {/* Canvas action buttons in bottom right corner */}
        <div className='action-buttons'>
          <button 
            className='action-btn undo-btn' 
            onClick={onUndo} 
            disabled={strokes.length === 0}
          >
            Undo
          </button>
          <button 
            className='action-btn clear-btn' 
            onClick={onClear} 
            disabled={strokes.length === 0}
          >
            Clear
          </button>
        </div>
      </div>
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
