import React, { useContext } from 'react';

import { PlayContext } from './Play';
import { TimedText } from './TimedText';

const Round = (props) => {
  const { handleTimeout } = useContext(PlayContext);
  const roundState = props.state;
  const label = roundState.currentLabel;
  
  return ( 
    <div className="status-text">
      <TimedText 
        key={label} 
        label={label} 
        strings={{...roundState.texts}} 
        callback={handleTimeout}
      > 
      </TimedText>
    </div>
  );
}

export { Round };
