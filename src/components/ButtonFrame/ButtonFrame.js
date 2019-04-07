import React from 'react';

export function ButtonFrame({ correct, acceptAnswer, redraw, redraws, selectedNumbers, checkAnswer }) {
  const renderButton = () => {
    if (correct) {
      return (
        <button className="btn btn-success btn-lg" onClick={acceptAnswer}>
          <span className="glyphicon glyphicon-ok" />
        </button>
      );
    }

    if (correct !== null) {
      return (
        <button className="btn btn-danger btn-lg">
          <span className="glyphicon glyphicon-remove" />
        </button>
      );
    }

    return (
      <button className="btn btn-primary btn-lg" disabled={!selectedNumbers.length} onClick={checkAnswer}>
        =
      </button>
    );
  };

  return (
    <div id="button-frame">
      {renderButton()}
      <br />
      <br />
      <button className="btn btn-warning btn-xs" onClick={redraw} disabled={!redraws}>
        <span className="glyphicon glyphicon-refresh" />
        &nbsp;
        <span>{redraws}</span>
      </button>
    </div>
  );
}
