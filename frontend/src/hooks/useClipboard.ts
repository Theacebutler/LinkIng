import { useState } from "react";

export const useClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [copydText, setCopydText] = useState('');
  return {
    isCopied,
    copydText,
    setIsCopied,
    setCopydText
  };
};


