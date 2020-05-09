import React from 'react';
import Typed from 'typed.js';

class TypedText extends React.Component {
  
  baseOptions = {
    typeSpeed: 20,
    showCursor: false,
    contentType: 'html'
  };  
  
  componentDidMount() {
    const { strings } = this.props;
    
    const options = {
      ...this.baseOptions, 
      strings: strings
    }
    this.typed = new Typed(this.props.timerRef ? this.props.timerRef : this.el, options); 
    this.typed.start(); 
  }
  
  componentWillUnmount() {
    if (this.typed) this.typed.destroy();
  }
  
  render() {
    return (
          <span
            id={this.props.id ? this.props.id : ''}
            className="typed"
            ref={this.props.timerRef ? this.props.timerRef : (el) => { this.el = el; }}
          />
    );
  }
}

export { TypedText };