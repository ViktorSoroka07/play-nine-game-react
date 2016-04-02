var React = require('react');
var ReactDOM = require('react-dom');
var jQuery = require('jquery');

var Card = React.createClass({
    getInitialState: function () {
        return {};
    },
    componentDidMount: function () {
        var component = this;
        jQuery.get("https://api.github.com/users/" + this.props.login, function (data) {
            component.setState(data);
        });
    },
    render: function () {
        var cls = 'picture ' + (this.state.name ? 'show' : '');
        return (
            <div>
                <div className={cls}>
                    <img src={this.state.avatar_url} alt="developer" width="80" height="80"/>
                </div>
                <p>{this.state.name}</p>
                <hr/>
            </div>
        );
    }
});

var FormAddCard = React.createClass({
    getInitialState: function () {
        return {};
    },
    /**
     * this bound to the component
     * @param e
     */
    addCard: function (e) {
        e.preventDefault();
        var login = ReactDOM.findDOMNode(this.refs.login); // or just =this.refs.login
        this.props.addCard(login.value);
        login.value = '';

    },
    render: function () {
        return (
            <form onSubmit={this.addCard}>
                <input type="text" ref="login"/>
                <button type="submit">Add</button>
            </form>
        );
    }
});

var Main = React.createClass({
    getInitialState: function () {
        return {
            cards: []
        };
    },
    addCard: function (card) {
        this.setState({cards: this.state.cards.concat(card)});
    },
    render: function () {
        var cards = this.state.cards.map(function (login, index) {
            return (
                <Card key={index} login={login}/>
            );
        });
        return (
            <div>
                <FormAddCard addCard={this.addCard}/>
                {cards}
            </div>
        );
    }
});

ReactDOM.render(<Main />, document.getElementById('root'));
