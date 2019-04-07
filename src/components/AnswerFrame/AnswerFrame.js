import React from 'react';

export function AnswerFrame({ selectedNumbers, unselectNumber }) {
  return (
    <div id="answer-frame">
      <div className="well">
        {selectedNumbers.map((number, index) => (
          <span key={index} className="number" onClick={unselectNumber.bind(null, number)}>
            {number}
          </span>
        ))}
      </div>
    </div>
  );
}
