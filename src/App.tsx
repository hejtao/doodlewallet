import { useEffect, useRef, useState } from 'react';
import '@/App.css';
import { WORDLISTS } from '@/wordlist';
import QRCode from 'qrcode';

// Import components
import DrawingCanvas, { DrawingCanvasRef } from '@/components/DrawingCanvas';
import Toolbar from '@/components/Toolbar';
import StrokeCounter from '@/components/StrokeCounter';
import WarningMessage from '@/components/WarningMessage';
import Modal from '@/components/Modal';

// Import types and utilities
import { Stroke, StrokeCenter, Point, COLORS, BRUSH_SIZES, ENTROPY_SIZES } from '@/components/types';
import {
  calculateDistance,
  calculateStrokeCenter,
  getEntropySizeIndex,
  getNextEntropySize,
  getMnemonicWordCount,
  calculateChecksum,
  getPointFromEvent,
} from '@/components/utils';

function App() {
  const canvasRef = useRef<DrawingCanvasRef>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(COLORS[0]); // Default red color
  const [currentBrushSize, setCurrentBrushSize] = useState(BRUSH_SIZES[1]); // Default medium width

  // New state for stroke tracking
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [strokeCenters, setStrokeCenters] = useState<StrokeCenter[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);

  // State for warning message
  const [warningMessage, setWarningMessage] = useState<string>('');

  // State for modal and mnemonic words
  const [showModal, setShowModal] = useState(false);
  const [mnemonicWords, setMnemonicWords] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Clear warning message after 3 seconds
  useEffect(() => {
    if (warningMessage) {
      const timer = setTimeout(() => {
        setWarningMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [warningMessage]);

  // Handle page refresh/close warning when strokes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (strokes.length > 0) {
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [strokes.length]);

  // Function to handle undo last stroke
  const handleUndo = () => {
    if (strokes.length > 0) {
      setStrokes(prev => prev.slice(0, -1));
      setStrokeCenters(prev => prev.slice(0, -1));
      setMnemonicWords(''); // Reset mnemonic words when strokes change
      setQrCodeDataUrl(''); // Reset QR code when strokes change
    }
  };

  // Function to handle clear all strokes
  const handleClear = () => {
    setStrokes([]);
    setStrokeCenters([]);
    setMnemonicWords(''); // Reset mnemonic words
    setQrCodeDataUrl(''); // Reset QR code
  };

  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    setIsDrawing(true);
    setWarningMessage(''); // Clear any existing warning

    // Get point with pressure information
    const point = getPointFromEvent(e, canvas);
    setCurrentStroke([point]);
  };

  // Drawing
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    // Get point with pressure information
    const point = getPointFromEvent(e, canvas);
    
    // Add point to current stroke
    setCurrentStroke((prev) => [...prev, point]);
  };

  // Stop drawing
  const stopDrawing = () => {
    if (!isDrawing || currentStroke.length === 0) return;

    setIsDrawing(false);

    // Calculate center of current stroke
    const center = calculateStrokeCenter(currentStroke);

    // Check distance from last stroke center if there are existing strokes
    if (strokeCenters.length > 0) {
      const lastCenter = strokeCenters[strokeCenters.length - 1];
      const distance = calculateDistance(lastCenter, center);

      if (distance < 50) {
        canvasRef.current?.clearCurrentStrokeFromCanvas();
        setWarningMessage('Too close to last stroke');
        setCurrentStroke([]);
        return;
      }
    }

    // Create new stroke object
    const newStroke: Stroke = {
      points: currentStroke,
      color: currentColor,
      brushSize: currentBrushSize,
    };

    // Add stroke to strokes array
    setStrokes((prev) => [...prev, newStroke]);

    // Add stroke center
    setStrokeCenters((prev) => [...prev, center]);

    // Clear current stroke
    setCurrentStroke([]);
  };

  // Function to handle generate mnemonic words button click
  const generateMnemonicWords = async () => {
    if (!mnemonicWords) {
      const index = getEntropySizeIndex(strokes.length);
      const entropySize = ENTROPY_SIZES[index];
      const entropy = strokeCenters
        .slice(0, entropySize)
        .map((center) => {
          const { x, y } = center;
          if ((x + y) % 2 == 0) return '0';
          return '1';
        })
        .join('');

      const checksum = await calculateChecksum(entropy, entropySize);
      const newEntropy = entropy + checksum;
      const words = [];
      for (let i = 11; i <= newEntropy.length; i += 11) {
        const word = newEntropy.slice(i - 11, i);
        const index = parseInt(word, 2);
        words.push(WORDLISTS[index]);
      }

      const mnemonicString = words.join(' ');
      setMnemonicWords(mnemonicString);

      // Generate QR code
      try {
        const qrDataUrl = await QRCode.toDataURL(mnemonicString, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        setQrCodeDataUrl(qrDataUrl);
      } catch (error: any) {
        setWarningMessage('Generating QR code error: ' + (error?.message || 'Unknown error'));
      }
    }

    setShowModal(true);
  };

  return (
    <div className='app'>
      {/* Stroke count display in top right corner */}
      <StrokeCounter
        strokeCount={strokes.length}
        nextEntropySize={getNextEntropySize(strokes.length)}
        mnemonicWordCount={getMnemonicWordCount(strokes.length)}
        onGenerateMnemonic={generateMnemonicWords}
        onUndo={handleUndo}
        onClear={handleClear}
        disabled={strokes.length < 128}
      />

      {/* Warning message */}
      {warningMessage && <WarningMessage message={warningMessage} />}

      {/* Canvas */}
      <DrawingCanvas
        ref={canvasRef}
        strokes={strokes}
        currentStroke={currentStroke}
        currentColor={currentColor}
        currentBrushSize={currentBrushSize}
        onStartDrawing={startDrawing}
        onDraw={draw}
        onStopDrawing={stopDrawing}
      />

      {/* Toolbar */}
      <Toolbar
        currentColor={currentColor}
        currentBrushSize={currentBrushSize}
        onColorChange={setCurrentColor}
        onBrushSizeChange={setCurrentBrushSize}
      />

      {/* Modal for displaying mnemonic words */}
      {showModal && (
        <Modal
          show={showModal}
          mnemonicWords={mnemonicWords}
          qrCodeDataUrl={qrCodeDataUrl}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default App;
