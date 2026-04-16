import React, { useReducer, useEffect } from 'react';

import { getRandom, possibleCombinationSum } from '../../utils';
import { StarsFrame } from '../StarsFrame';
import { DoneFrame } from '../DoneFrame';
import { NumbersFrame } from '../NumbersFrame';
import { ButtonFrame } from '../ButtonFrame';
import { AnswerFrame } from '../AnswerFrame';

const initialState = {
  selectedNumbers: [],
  numberOfStars: getRandom(),
  correct: null,
  usedNumbers: [],
  redraws: 5,
  doneStatus: null,
};
const reducer = (state, newState) => ({ ...state, ...newState });

export function Game() {
  const [state, setState] = useReducer(reducer, initialState);

  const resetGame = () => setState({ ...initialState });

  const selectNumber = clickedNumber => {
    if (state.selectedNumbers.indexOf(clickedNumber) < 0) {
      setState({
        selectedNumbers: state.selectedNumbers.concat(clickedNumber),
        correct: null,
      });
    }
  };

  const redraw = () => {
    if (state.redraws) {
      setState({
        selectedNumbers: [],
        numberOfStars: getRandom(),
        correct: null,
        redraws: state.redraws - 1,
      });
    }
  };

  const getDoneStatus = () => {
    if (state.usedNumbers.length === 9) {
      return 'Done. Nice!';
    }

    if (state.redraws === 0 && !possibleSolutions()) {
      return 'Game Over!';
    }
  };

  const unselectNumber = clickedNumber => {
    setState({
      selectedNumbers: state.selectedNumbers.filter(n => n !== clickedNumber),
      correct: null,
    });
  };

  const acceptAnswer = () => {
    const usedNumbers = state.usedNumbers.concat(state.selectedNumbers);

    setState({
      usedNumbers,
      selectedNumbers: [],
      correct: null,
      numberOfStars: getRandom(),
    });
  };

  const sumOfSelectedNumbers = () => {
    return state.selectedNumbers.reduce((sum, currentNumber) => sum + currentNumber, 0);
  };

  const possibleSolutions = () => {
    const possibleNumbers = [];

    for (let number = 1; number <= 9; number++) {
      if (state.usedNumbers.indexOf(number) < 0) {
        possibleNumbers.push(number);
      }
    }

    return possibleCombinationSum(possibleNumbers, state.numberOfStars);
  };

  const checkAnswer = () => {
    setState({ correct: state.numberOfStars === sumOfSelectedNumbers() });
  };

  useEffect(() => {
    setState({ doneStatus: getDoneStatus() });
  }, [state.usedNumbers, state.numberOfStars, state.redraws]);

  return (
    <div id="game">
      <h2>Play Nine</h2>
      <hr />
      <div className="clearfix">
        <StarsFrame numberOfStars={state.numberOfStars} />
        <ButtonFrame
          selectedNumbers={state.selectedNumbers}
          correct={state.correct}
          checkAnswer={checkAnswer}
          acceptAnswer={acceptAnswer}
          redraw={redraw}
          redraws={state.redraws}
        />
        <AnswerFrame selectedNumbers={state.selectedNumbers} unselectNumber={unselectNumber} />
      </div>
      {state.doneStatus ? (
        <DoneFrame doneStatus={state.doneStatus} resetGame={resetGame} />
      ) : (
        <NumbersFrame
          selectedNumbers={state.selectedNumbers}
          selectNumber={selectNumber}
          usedNumbers={state.usedNumbers}
        />
      )}
    </div>
  );
}
