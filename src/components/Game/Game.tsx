import { useReducer } from 'react';
import './Game.css';

import { ALL_NUMBERS, INITIAL_REDRAWS, TOTAL_NUMBERS } from '../../constants';
import { getRandom, possibleCombinationSum } from '../../utils';
import { StarsFrame } from '../StarsFrame';
import { DoneFrame } from '../DoneFrame';
import { NumbersFrame } from '../NumbersFrame';
import { ButtonFrame } from '../ButtonFrame';
import { AnswerFrame } from '../AnswerFrame';

export type AnswerStatus = 'unchecked' | 'correct' | 'wrong';

interface GameState {
  selectedNumbers: number[];
  numberOfStars: number;
  answerStatus: AnswerStatus;
  usedNumbers: number[];
  redraws: number;
}

type GameAction =
  | { type: 'SELECT_NUMBER'; number: number }
  | { type: 'UNSELECT_NUMBER'; number: number }
  | { type: 'CHECK_ANSWER' }
  | { type: 'ACCEPT_ANSWER' }
  | { type: 'REDRAW' }
  | { type: 'RESET' };

const getInitialState = (): GameState => ({
  selectedNumbers: [],
  numberOfStars: getRandom(),
  answerStatus: 'unchecked',
  usedNumbers: [],
  redraws: INITIAL_REDRAWS,
});

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_NUMBER': {
      if (state.selectedNumbers.includes(action.number)) {
        return state;
      }

      return {
        ...state,
        selectedNumbers: [...state.selectedNumbers, action.number],
        answerStatus: 'unchecked',
      };
    }

    case 'UNSELECT_NUMBER':
      return {
        ...state,
        selectedNumbers: state.selectedNumbers.filter((number) => number !== action.number),
        answerStatus: 'unchecked',
      };

    case 'CHECK_ANSWER': {
      const sum = state.selectedNumbers.reduce((total, number) => total + number, 0);

      return {
        ...state,
        answerStatus: sum === state.numberOfStars ? 'correct' : 'wrong',
      };
    }

    case 'ACCEPT_ANSWER':
      return {
        ...state,
        usedNumbers: [...state.usedNumbers, ...state.selectedNumbers],
        selectedNumbers: [],
        answerStatus: 'unchecked',
        numberOfStars: getRandom(),
      };

    case 'REDRAW': {
      if (state.redraws === 0) {
        return state;
      }

      return {
        ...state,
        selectedNumbers: [],
        numberOfStars: getRandom(),
        answerStatus: 'unchecked',
        redraws: state.redraws - 1,
      };
    }

    case 'RESET':
      return getInitialState();
  }
}

export function Game() {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  // The numbers still on the board. `possibleCombinationSum` needs them ascending,
  // which ALL_NUMBERS already is.
  const unusedNumbers = ALL_NUMBERS.filter((number) => !state.usedNumbers.includes(number));

  let doneStatus: string | null = null;

  if (state.usedNumbers.length === TOTAL_NUMBERS) {
    doneStatus = 'Done. Nice!';
  } else if (state.redraws === 0 && !possibleCombinationSum(unusedNumbers, state.numberOfStars)) {
    // Out of redraws AND no remaining combination adds up to the draw: the board is unwinnable.
    doneStatus = 'Game Over!';
  }

  return (
    <div className="game">
      <h2>Play Nine</h2>
      <hr />
      <div className="clearfix">
        <StarsFrame numberOfStars={state.numberOfStars} />
        <ButtonFrame
          selectedNumbers={state.selectedNumbers}
          answerStatus={state.answerStatus}
          checkAnswer={() => dispatch({ type: 'CHECK_ANSWER' })}
          acceptAnswer={() => dispatch({ type: 'ACCEPT_ANSWER' })}
          redraw={() => dispatch({ type: 'REDRAW' })}
          redraws={state.redraws}
        />
        <AnswerFrame
          selectedNumbers={state.selectedNumbers}
          unselectNumber={(number) => dispatch({ type: 'UNSELECT_NUMBER', number })}
        />
      </div>
      {doneStatus ? (
        <DoneFrame doneStatus={doneStatus} resetGame={() => dispatch({ type: 'RESET' })} />
      ) : (
        <NumbersFrame
          selectedNumbers={state.selectedNumbers}
          selectNumber={(number) => dispatch({ type: 'SELECT_NUMBER', number })}
          usedNumbers={state.usedNumbers}
        />
      )}
    </div>
  );
}
