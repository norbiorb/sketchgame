import React, {useEffect, useContext , useState} from "react";
import Typed from 'typed.js';

import { PlayContext } from './Play';

const TimedText = (props) => {

  const { timerRef, setTime } = useContext(PlayContext);

  const { answer, questionStart, secondsPerRound, questionEnd } = props.strings;

  const [isActive, setIsActive] = useState(false);

  const [seconds] = useCountdown(secondsPerRound, props.callback, isActive);

  useEffect(() => {

    const baseOptions = {
      typeSpeed: 20,
      contentType: 'html',
      showCursor: true,
      cursorChar: ' '
      
    };
    let typed1 = null;
    let typed2 = null;
    let typed3 = null;
    let typed4 = null;;
    if (isActive) {
      setTime(timerRef, seconds);
    } else {
      const options1 = {
          ...baseOptions, 
          strings: [answer], 
          onComplete: () => typed2.start()
      }
      let options2 = {
          ...baseOptions, 
          strings: [questionStart], 
          onComplete: () => typed3.start()
      }
      const options3 = {
          ...baseOptions,
          strings: [`${seconds}`], 
          onComplete: () => typed4.start()
      }
      const options4 = {
          ...baseOptions,
          strings: [questionEnd], 
          onComplete: () => setIsActive(true)
      }
      const typed1 = new Typed('#typed1', options1);
      typed1.start();
      const typed2 = new Typed('#typed2', options2);
      typed2.stop();
      const typed3 = new Typed('#typed3', options3);
      typed3.stop();
      const typed4 = new Typed('#typed4', options4);
      typed4.stop(); 
    }

    return () => {
      if (typed1) typed1.destroy();
      if (typed2) typed2.destroy();
      if (typed3) typed3.destroy();
      if (typed4) typed4.destroy();
    }
  }, [answer, isActive, questionEnd, questionStart, seconds, setTime, timerRef]);

  return (
    <div>
      <span className="typed" id="typed1" />
      <span className="typed" id="typed2" />
      <span ref={timerRef} className="typed" id="typed3" />
      <span className="typed" id="typed4"/>
    </div>
  );
}

const useCountdown = (secondsPerRound, callback, isActive) => {
  const [seconds, setSeconds] = useState(secondsPerRound);
  
  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(function() {
        if(seconds <= 0) {
          callback(seconds);
          clearInterval(interval);       
        } else {
          setSeconds(seconds => seconds - 1);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    }
  }, [seconds, callback, isActive]);

  return [seconds];
};

export { TimedText };

  