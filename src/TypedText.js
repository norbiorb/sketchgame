import React from 'react';
import Typed from 'typed.js';

class TypedText extends React.Component {

  baseOptions = {
    typeSpeed: 40,
    showCursor: false,
    contentType: 'html'
  };  
  
  componentDidMount() {
    const { strings } = this.props;
    
    const options = {
      ...this.baseOptions, 
      strings: strings
    }
    this.typed = new Typed(this.el, options);
    this.typed.start(); 
  }
  
  componentWillUnmount() {
    this.typed.destroy();
  }
  
  render() {
    return (
          <span
            className="typed"
            ref={(el) => { this.el = el; }}
          />
    );
  }
}

export { TypedText };