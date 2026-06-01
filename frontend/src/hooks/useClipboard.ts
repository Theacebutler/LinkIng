import { useState } from "react";

const useClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [copydText, setCopydText] = useState('');
  return {
    isCopied,
    copydText,
    setIsCopied,
    setCopydText
  };
};

export default useClipboard;
