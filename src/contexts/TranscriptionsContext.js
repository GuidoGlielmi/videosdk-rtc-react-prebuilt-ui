import React, {createContext, useMemo, useState} from 'react';

export const transcriptionsContext = createContext(null);
const TranscriptionsContext = ({children}) => {
  const [currentTranscription, setCurrentTranscription] = useState('');
  const contextValue = useMemo(
    () => ({currentTranscription, setCurrentTranscription}),
    [currentTranscription],
  );
  return <transcriptionsContext.Provider value={contextValue}>{children}</transcriptionsContext.Provider>;
};

export default TranscriptionsContext;
