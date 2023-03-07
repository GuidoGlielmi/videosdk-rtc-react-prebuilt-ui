import React, {createContext, useMemo, useState} from 'react';

export const pinContext = createContext(null);
const PinContext = ({children}) => {
  const [pinnedParticipant, setPinnedParticipant] = useState(null);
  const contextValue = useMemo(() => ({pinnedParticipant, setPinnedParticipant}), [pinnedParticipant]);
  return <pinContext.Provider value={contextValue}>{children}</pinContext.Provider>;
};

export default PinContext;
