import { COLORS, BRUSH_SIZES } from '@/components/types';
import '@/components/Toolbar.css';

interface ToolbarProps {
  currentColor: string;
  currentBrushSize: number;
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  currentColor,
  currentBrushSize,
  onColorChange,
  onBrushSizeChange,
}) => {
  return (
    <div className='toolbar'>
      {/* Color picker */}
      <div className='color-section'>
        <h3>Color</h3>
        <div className='color-options'>
          {COLORS.map((color, index) => (
            <button
              key={index}
              className={`color-btn ${currentColor === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
              title={`Color ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Brush size picker */}
      <div className='brush-section'>
        <h3>Size</h3>
        <div className='brush-options'>
          {BRUSH_SIZES.map((size, index) => (
            <button
              key={index}
              className={`brush-btn ${currentBrushSize === size ? 'active' : ''}`}
              onClick={() => onBrushSizeChange(size)}
              title={`Size ${['Thin', 'Medium', 'Thick'][index]}`}
            >
              <div
                className='brush-preview'
                style={{
                  width: `25px`,
                  height: `${size}px`,
                  backgroundColor: currentColor,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;