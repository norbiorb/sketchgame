import React, {useEffect } from "react";
import Typed from 'typed.js';

const TimedText = (props) => {

  const { answer, questionStart, secondsPerRound, questionEnd } = props.strings;
  const callback = props.callback;

  let baseOptions = {
    typeSpeed: 40,
    contentType: 'html',
    showCursor: true,
    cursorChar: ' ',
  };

  let interval;

  const countdown = (s) => { 
    let timeleft = s-1;
    interval = setInterval(function(){
      if(timeleft <= 0){
        clearInterval(interval);
        callback(timeleft);
      } else {
        if (timeleft < 10) document.getElementById("typed3").innerHTML = '0' + timeleft;
        else document.getElementById("typed3").innerHTML = timeleft;
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
        
  let typed1 = new Typed('#typed1', options1);
  let typed2 = new Typed('#typed2', options2);
  let typed3 = new Typed('#typed3', options3);
  let typed4 = new Typed('#typed4', options4);

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
    <React.Fragment>
      <div className="type-wrap">
        <span className="typed_span" id="typed1" />
        <span className="typed_span" id="typed2" />
        <span className="typed_span countdown" id="typed3" />
        <span className="typed_span" id="typed4"/>
      </div>
    </React.Fragment>
  );
  }

  export default TimedText;

  