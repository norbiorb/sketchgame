import React from "react";
import { Link } from "react-router-dom";

const App = () => {
  return (
    <div>
      <div>Sketch</div>
      <div>This game has been modeled-off Google's  
         &nbsp;<a href="https://quickdraw.withgoogle.com">Quick, Draw! </a> game, and uses a sampling 
        from the Quick Draw! <a href="https://quickdraw.withgoogle.com/data">dataset</a>.</div>
      <div>
        Brought to you by the EPFL Extension School.
      </div>
      <div>
        <Link to="/game">Play Game</Link>
      </div>
    </div>
  )
}

export default App;