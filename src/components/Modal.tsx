import '@/components/Modal.css';

interface ModalProps {
  show: boolean;
  mnemonicWords: string;
  qrCodeDataUrl: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, mnemonicWords, qrCodeDataUrl, onClose }) => {
  if (!show) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>Mnemonic words</h2>
          <button className='close-button' onClick={onClose}>
            ×
          </button>
        </div>
        <div className='modal-body'>
          <div className='mnemonic-words'>
            <p>{mnemonicWords}</p>
          </div>
          {qrCodeDataUrl && (
            <div className='qr-code-container'>
              <img src={qrCodeDataUrl} alt='Mnemonic QR Code' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;