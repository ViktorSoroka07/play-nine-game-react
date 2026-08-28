import './NumbersFrame.css';

import { ALL_NUMBERS } from '../../constants';

interface NumbersFrameProps {
  usedNumbers: number[];
  selectedNumbers: number[];
  selectNumber: (number: number) => void;
}

export function NumbersFrame({ usedNumbers, selectedNumbers, selectNumber }: NumbersFrameProps) {
  return (
    <div className="numbers-frame">
      <div className="well">
        {ALL_NUMBERS.map((number) => {
          const isSelected = selectedNumbers.includes(number);
          const isUsed = usedNumbers.includes(number);

          return (
            <button
              type="button"
              key={number}
              className={`number selected-${isSelected} used-${isUsed}`}
              onClick={() => selectNumber(number)}
              disabled={isUsed}
              aria-pressed={isSelected}
              aria-label={`Number ${number}`}
            >
              {number}
            </button>
          );
        })}
      </div>
    </div>
  );
}
