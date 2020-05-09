import React, {useEffect, useContext } from "react";
import Typed from 'typed.js';

import { PlayContext } from './Play';

const TimedText = (props) => {

  const { timerRef, setTime } = useContext(PlayContext);

  const { answer, questionStart, secondsPerRound, questionEnd } = props.strings;
  const callback = props.callback;

  const baseOptions = {
    typeSpeed: 20,
    contentType: 'html',
    showCursor: true,
    cursorChar: ' ',
  };

  let interval;

  const countdown = (s) => { 
    let timeleft = s-1;
    interval = setInterval(function() {
      if(timeleft <= 0) {
        callback(timeleft);
        clearInterval(interval);       
      } else {
        setTime(timerRef, timeleft);
      }
      timeleft -= 1;
    }, 1000);
  } 

  useEffect(() => {
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
        strings: [`${secondsPerRound}`], 
        onComplete: () => typed4.start()
    }
    const options4 = {
        ...baseOptions,
        strings: [questionEnd], 
        onComplete: () => countdown(secondsPerRound)
    }

    const typed1 = new Typed('#typed1', options1);
    const typed2 = new Typed('#typed2', options2);
    const typed3 = new Typed('#typed3', options3);
    const typed4 = new Typed('#typed4', options4);
    
    typed1.start();
    typed2.stop();
    typed3.stop();
    typed4.stop();

    return () => {
      typed1.destroy();
      typed2.destroy();
      typed3.destroy();
      typed4.destroy();
      clearInterval(interval)
    }
  });

  return (
    <div>
      <span className="typed" id="typed1" />
      <span className="typed" id="typed2" />
      <span ref={timerRef} className="typed" id="typed3" />
      <span className="typed" id="typed4"/>
    </div>
  );
}

export { TimedText };

  