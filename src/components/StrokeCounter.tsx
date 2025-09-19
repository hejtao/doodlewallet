import '@/components/StrokeCounter.css';

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
      Strokes: {strokeCount}/{nextEntropySize}
      <button
        className='mnemonic-btn'
        onClick={onGenerateMnemonic}
        disabled={disabled}
      >
        Generate {mnemonicWordCount} Mnemonic Words
      </button>
    </div>
  );
};

export default StrokeCounter;