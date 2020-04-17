import React from "react";
import { Link } from "react-router-dom";

const App = () => {
  return (
    <section className="nes-container is-dark">
      <h2>Sketch</h2>
      <article key="game">
      <p>This game has been modeled-off Google's  
         &nbsp;<a href="https://quickdraw.withgoogle.com">Quick, Draw! </a> game, and uses a sampling 
        from the Quick Draw! <a href="https://quickdraw.withgoogle.com/data">dataset</a>.</p>
      <p>
        Brought to you by the EPFL Extension School.
      </p>
      </article>
      <footer>
        <Link className="nes-btn" to="/game">Play Game</Link>
      </footer>
    </section>
  )
}

export default App;