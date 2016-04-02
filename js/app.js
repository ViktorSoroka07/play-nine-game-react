var React = require('react');
var ReactDOM = require('react-dom');
var jQuery = require('jquery');

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
        var disabled = !this.props.selectedNumbers.length;
        return (
            <div id="button-frame">
                <button className="btn btn-primary btn-lg" disabled={disabled}>=</button>
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
                            <span key={index} className="number" onClick={component.props.unselectNumber.bind(null, number)}>{number}</span>
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
            className = '';

        for (let index = 1; index <= 9; index++) {
            className = "number selected-" + (selectedNumbers.indexOf(index) >= 0);

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

var Game = React.createClass({
    getInitialState: function () {
        return {
            selectedNumbers: [],
            numberOfStars: Math.floor(Math.random() * 9) + 1
        };
    },
    selectNumber: function (clickedNumber) {
        if (this.state.selectedNumbers.indexOf(clickedNumber) < 0) {
            this.setState({selectedNumbers: this.state.selectedNumbers.concat(clickedNumber)});
        }
    },
    unselectNumber: function (clickedNumber) {
        var updatedNumbers = this.state.selectedNumbers;

        updatedNumbers.splice(updatedNumbers.indexOf(clickedNumber), 1);

        this.setState({selectedNumbers: updatedNumbers});
    },
    render: function () {
        var selectedNumbers = this.state.selectedNumbers,
            numberOfStars = this.state.numberOfStars;

        return (
            <div id="game">
                <h2>Play Nine</h2>
                <hr/>
                <div className="clearfix">
                    <StarsFrame numberOfStars={numberOfStars}/>
                    <ButtonFrame selectedNumbers={selectedNumbers}/>
                    <AnswerFrame selectedNumbers={selectedNumbers} unselectNumber={this.unselectNumber}/>
                </div>
                <NumbersFrame selectedNumbers={selectedNumbers} selectNumber={this.selectNumber}/>
            </div>
        )
    }
});

ReactDOM.render(<Game />, document.getElementById('container'));
