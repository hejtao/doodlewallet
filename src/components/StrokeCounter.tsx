import '@/components/StrokeCounter.css';
import infoIcon from '@/static/info.png';
import { useState } from 'react';

interface StrokeCounterProps {
  strokeCount: number;
  nextEntropySize: number;
  mnemonicWordCount: number;
  onGenerateMnemonic: () => void;
  disabled: boolean;
}

const StrokeCounter: React.FC<StrokeCounterProps> = ({
  strokeCount,
  nextEntropySize,
  mnemonicWordCount,
  onGenerateMnemonic,
  disabled,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleInfoClick = () => {
    setShowTooltip(!showTooltip);
  };

  const tooltipContent = `Draw at least ${nextEntropySize} strokes to generate ${
    (nextEntropySize / 32 + nextEntropySize) / 11
  } mnemonic words. Each stroke adds 1 bit of randomness (according to the average position of all points that the stroke samples) to the final entropy. The more strokes you draw, the stronger the mnemonic phrase.`;

  return (
    <div className='stroke-counter'>
      <div className='stroke-info'>
        Strokes: {strokeCount}/{nextEntropySize}
        <div className='info-icon-container'>
          <img
            style={{ width: 18, flexShrink: 0, marginLeft: 4, cursor: 'pointer' }}
            src={infoIcon}
            alt='info icon'
            onClick={handleInfoClick}
          />
          {showTooltip && <div className='tooltip'>{tooltipContent}</div>}
        </div>
      </div>
      <button className='mnemonic-btn' onClick={onGenerateMnemonic} disabled={disabled}>
        Generate {mnemonicWordCount} Mnemonic Words
      </button>
    </div>
  );
};

export default StrokeCounter;
