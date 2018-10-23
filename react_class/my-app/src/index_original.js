import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//FINISHED
//Try to see how this can be applied to the project?

function Square(props) {
    return (
      <button
        className="square"
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice(); //.slice() creates a copy of the squares arraysquares[i] = 'X';
    // IMPORTANT FOR DATA IMMUTABILITY NB cause of this approach we can now go back to previous moves (previous states of the square array) NB
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'; //This is the correct way to check a boolean in JSX. NB boolean ? this : that NB
    this.setState({
      history: history.concat([{ squares: squares }]), //concat() is used instead of push() cause it makes a new array IMMUTABILITY
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return(
        //use KEY or REF when actually doing this in our thing. use the ID (primary key) as the value of KEY
        <li key={move}>
          <button onClick = {() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) { //Uses the fact that winner is truthy. i.e. the function returns null if no winner, but a value (squares[a]) if there is a winner
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [ //This array contains the positions of all the winning combinations
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i=0; i<lines.length; i++) {
    const [a,b,c] = lines[i]; //ARRAY DECOMPOSITION. for lines[i] a=0, b=1, c=2
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { //Checks if the same value (eg X) is in all the right positions
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
