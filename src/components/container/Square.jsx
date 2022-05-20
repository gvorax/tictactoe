import React from 'react';
const Square = (props) => {
  return (
    <div className={`square ${props.index}`} {...props} >
      {props.x ? (
        <div className="image">
          <img src={require('../img/close.png')} className="close" />
        </div>
      ) : props.o ? (
        <div className="image">
          <img src={require('../img/ellipse.png')} className="close" />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Square;
