import '@/components/WarningMessage.css';

interface WarningMessageProps {
  message: string;
}

const WarningMessage: React.FC<WarningMessageProps> = ({ message }) => {
  if (!message) return null;

  return <div className='warning-message'>{message}</div>;
};

export default WarningMessage;
