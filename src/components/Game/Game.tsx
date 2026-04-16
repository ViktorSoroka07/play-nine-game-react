import { useReducer } from 'react';
import './Game.css';

import { getRandom, possibleCombinationSum } from '../../utils';
import { StarsFrame } from '../StarsFrame';
import { DoneFrame } from '../DoneFrame';
import { NumbersFrame } from '../NumbersFrame';
import { ButtonFrame } from '../ButtonFrame';
import { AnswerFrame } from '../AnswerFrame';

interface GameState {
  selectedNumbers: number[];
  numberOfStars: number;
  correct: boolean | null;
  usedNumbers: number[];
  redraws: number;
}

const getInitialState = (): GameState => ({
  selectedNumbers: [],
  numberOfStars: getRandom(),
  correct: null,
  usedNumbers: [],
  redraws: 5,
});

const reducer = (state: GameState, newState: Partial<GameState>): GameState => ({
  ...state,
  ...newState,
});

export function Game() {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  const possibleSolutions = (usedNumbers: number[], numberOfStars: number): boolean => {
    const possibleNumbers: number[] = [];

    for (let number = 1; number <= 9; number++) {
      if (usedNumbers.indexOf(number) < 0) {
        possibleNumbers.push(number);
      }
    }

    return possibleCombinationSum(possibleNumbers, numberOfStars);
  };

  let doneStatus: string | null = null;

  if (state.usedNumbers.length === 9) {
    doneStatus = 'Done. Nice!';
  } else if (state.redraws === 0 && !possibleSolutions(state.usedNumbers, state.numberOfStars)) {
    doneStatus = 'Game Over!';
  }

  const resetGame = () => {
    dispatch(getInitialState());
  };

  const selectNumber = (clickedNumber: number) => {
    if (state.selectedNumbers.indexOf(clickedNumber) < 0) {
      dispatch({
        selectedNumbers: state.selectedNumbers.concat(clickedNumber),
        correct: null,
      });
    }
  };

  const redraw = () => {
    if (state.redraws) {
      dispatch({
        selectedNumbers: [],
        numberOfStars: getRandom(),
        correct: null,
        redraws: state.redraws - 1,
      });
    }
  };

  const unselectNumber = (clickedNumber: number) => {
    dispatch({
      selectedNumbers: state.selectedNumbers.filter((n) => n !== clickedNumber),
      correct: null,
    });
  };

  const acceptAnswer = () => {
    const usedNumbers = state.usedNumbers.concat(state.selectedNumbers);

    dispatch({
      usedNumbers,
      selectedNumbers: [],
      correct: null,
      numberOfStars: getRandom(),
    });
  };

  const sumOfSelectedNumbers = state.selectedNumbers.reduce((sum, currentNumber) => sum + currentNumber, 0);

  const checkAnswer = () => {
    dispatch({ correct: state.numberOfStars === sumOfSelectedNumbers });
  };

  return (
    <div className="game">
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
      {doneStatus ? (
        <DoneFrame doneStatus={doneStatus} resetGame={resetGame} />
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
