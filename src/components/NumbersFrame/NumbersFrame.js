import React from 'react';

export function NumbersFrame({ usedNumbers, selectedNumbers, selectNumber }) {
  return (
    <div id="numbers-frame">
      <div className="well">
        {Array.from({ length: 9 })
          .map((_, i) => i + 1)
          .map(number => {
            const className =
              'number selected-' +
              (selectedNumbers.indexOf(number) >= 0) +
              ' used-' +
              (usedNumbers.indexOf(number) >= 0);

            return (
              <div
                key={number}
                className={className}
                onClick={() => usedNumbers.indexOf(number) === -1 && selectNumber(number)}
              >
                {number}
              </div>
            );
          })}
      </div>
    </div>
  );
}
