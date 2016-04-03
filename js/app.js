var React = require('react');
var ReactDOM = require('react-dom');

var possibleCombinationSum = function (arr, n) {
    if (arr.indexOf(n) >= 0) {
        return true;
    }
    if (arr[0] > n) {
        return false;
    }
    if (arr[arr.length - 1] > n) {
        arr.pop();
        return possibleCombinationSum(arr, n);
    }
    var listSize = arr.length, combinationsCount = (1 << listSize);
    for (var i = 1; i < combinationsCount; i++) {
        var combinationSum = 0;
        for (var j = 0; j < listSize; j++) {
            if (i & (1 << j)) {
                combinationSum += arr[j];
            }
        }
        if (n === combinationSum) {
            return true;
        }
    }
    return false;
};

var StarsFrame = React.createClass({
    render: function () {
        var stars = [];

        for (let number = 0; number < this.props.numberOfStars; number++) {
            stars.push(
                <span key={number} className="glyphicon glyphicon-star"></span>
            );
        }

        return (
            <div id="stars-frame">
                <div className="well">
                    {stars}
                </div>
            </div>
        );
    }
});

var ButtonFrame = React.createClass({
    render: function () {
        var correct = this.props.correct,
            acceptAnswer = this.props.acceptAnswer,
            redraw = this.props.redraw,
            redraws = this.props.redraws,
            disabled,
            button;

        if (correct) {
            button = (
                <button className="btn btn-success btn-lg" onClick={acceptAnswer}>
                    <span className="glyphicon glyphicon-ok"></span>
                </button>
            );
        } else if (correct !== null) {
            button = (
                <button className="btn btn-danger btn-lg">
                    <span className="glyphicon glyphicon-remove"></span>
                </button>
            );
        } else {
            disabled = !this.props.selectedNumbers.length;
            button = (
                <button className="btn btn-primary btn-lg" disabled={disabled} onClick={this.props.checkAnswer}>
                    =</button>
            );
        }
        return (
            <div id="button-frame">
                {button}
                <br/>
                <br/>
                <button className="btn btn-warning btn-xs" onClick={redraw} disabled={!redraws}>
                    <span className="glyphicon glyphicon-refresh"></span>
                    &nbsp;
                    <span>{redraws}</span>
                </button>
            </div>
        );
    }
});

var AnswerFrame = React.createClass({
    render: function () {
        var component = this;

        return (
            <div id="answer-frame">
                <div className="well">
                    {this.props.selectedNumbers.map(function (number, index) {
                        return (
                            <span key={index} className="number"
                                  onClick={component.props.unselectNumber.bind(null, number)}>{number}</span>
                        );
                    })}
                </div>
            </div>
        );
    }
});

var NumbersFrame = React.createClass({
    render: function () {
        var numbers = [],
            selectedNumbers = this.props.selectedNumbers,
            usedNumbers = this.props.usedNumbers,
            className = '';

        for (let index = 1; index <= 9; index++) {
            className = "number selected-" + (selectedNumbers.indexOf(index) >= 0);
            className += " used-" + (usedNumbers.indexOf(index) >= 0);

            numbers.push(
                <div key={index} className={className} onClick={this.props.selectNumber.bind(null, index)}>{index}</div>
            )
        }

        return (
            <div id="numbers-frame">
                <div className="well">
                    {numbers}
                </div>
            </div>
        );
    }
});

var DoneFrame = React.createClass({
    render: function () {
        var doneStatus = this.props.doneStatus,
            resetGame = this.props.resetGame;

        return (
            <div className="well text-center">
                <h2>{doneStatus}</h2>
                <button onClick={resetGame} className="btn btn-default">Play Again</button>
            </div>
        );
    }
});

var Game = React.createClass({
    getInitialState: function () {
        return {
            selectedNumbers: [],
            numberOfStars: this.getRandom(),
            correct: null,
            usedNumbers: [],
            redraws: 5,
            doneStatus: null
        };
    },
    resetGame: function () {
        this.replaceState(this.getInitialState());
    },
    selectNumber: function (clickedNumber) {
        if (this.state.selectedNumbers.indexOf(clickedNumber) < 0) {
            this.setState({
                selectedNumbers: this.state.selectedNumbers.concat(clickedNumber),
                correct: null
            });
        }
    },
    getRandom: function () {
        return Math.floor(Math.random() * 9) + 1;
    },
    redraw: function () {
        if (this.state.redraws) {
            this.setState({
                selectedNumbers: [],
                numberOfStars: this.getRandom(),
                correct: null,
                redraws: this.state.redraws - 1
            }, function () {
                this.updateDoneStatus();
            });
        }
    },
    unselectNumber: function (clickedNumber) {
        var updatedNumbers = this.state.selectedNumbers;

        updatedNumbers.splice(updatedNumbers.indexOf(clickedNumber), 1);

        this.setState({
            selectedNumbers: updatedNumbers,
            correct: null
        });
    },
    acceptAnswer: function () {
        var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
        this.setState({
            usedNumbers: usedNumbers,
            selectedNumbers: [],
            correct: null,
            numberOfStars: this.getRandom()
        }, function () {
            this.updateDoneStatus();
        });
    },
    sumOfSelectedNumbers: function () {
        return this.state.selectedNumbers.reduce(function (sum, currentNumber) {
            return sum + currentNumber;
        }, 0);
    },
    possibleSolutions: function () {
        var numberOfStars = this.state.numberOfStars,
            usedNumbers = this.state.usedNumbers,
            possibleNumbers = [];

        for (let number = 1; number <= 9; number++) {
            if (usedNumbers.indexOf(number) < 0) {
                possibleNumbers.push(number);
            }
        }

        console.log(possibleNumbers);
        return possibleCombinationSum(possibleNumbers, numberOfStars);
    },
    updateDoneStatus: function () {
        if (this.state.usedNumbers.length === 9) {
            this.setState({
                doneStatus: "Done. Nice!"
            });
        }
        if (this.state.redraws === 0 && !this.possibleSolutions()) {
            this.setState({
                doneStatus: "Game Over!"
            });
        }
    },
    checkAnswer: function () {
        this.setState({correct: this.state.numberOfStars === this.sumOfSelectedNumbers()});
    },
    render: function () {
        var selectedNumbers = this.state.selectedNumbers,
            numberOfStars = this.state.numberOfStars,
            usedNumbers = this.state.usedNumbers,
            correct = this.state.correct,
            redraws = this.state.redraws,
            doneStatus = this.state.doneStatus,
            bottomFrame;

        if (doneStatus) {
            bottomFrame = <DoneFrame doneStatus={doneStatus} resetGame={this.resetGame}/>;
        } else {
            bottomFrame = <NumbersFrame selectedNumbers={selectedNumbers} selectNumber={this.selectNumber}
                                        usedNumbers={usedNumbers}/>;
        }

        return (
            <div id="game">
                <h2>Play Nine</h2>
                <hr/>
                <div className="clearfix">
                    <StarsFrame numberOfStars={numberOfStars}/>
                    <ButtonFrame selectedNumbers={selectedNumbers}
                                 correct={correct}
                                 checkAnswer={this.checkAnswer}
                                 acceptAnswer={this.acceptAnswer}
                                 redraw={this.redraw}
                                 redraws={redraws}/>
                    <AnswerFrame selectedNumbers={selectedNumbers} unselectNumber={this.unselectNumber}/>
                </div>
                {bottomFrame}
            </div>
        )
    }
});

ReactDOM.render(<Game />, document.getElementById('container'));
