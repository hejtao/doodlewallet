import '@/components/StrokeCounter.css';
import infoIcon from '@/static/info.png';

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
  return (
    <div className='stroke-counter'>
      <div className='stroke-info'>
        Strokes: {strokeCount}/{nextEntropySize}
        <img style={{ width: 18, flexShrink: 0, marginLeft: 4, cursor: 'pointer' }} src={infoIcon} alt='info icon' />
      </div>
      <button className='mnemonic-btn' onClick={onGenerateMnemonic} disabled={disabled}>
        Generate {mnemonicWordCount} Mnemonic Words
      </button>
    </div>
  );
};

export default StrokeCounter;
