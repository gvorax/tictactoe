import './App.css';
import Board from './components/container/Board';
import Square from './components/container/Square';
import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';

const defaultSquares = () => new Array(9).fill(null);

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  const [squares, setSquares] = useState(defaultSquares());
  const [winner, setWinner] = useState(null);
  const [result, setResult] = useState(true);
  const [numbers, setNumbers] = useState();

  useEffect(() => {
    const stopGame = squares.filter((square) => square === null).length > 0;
    if (!stopGame) {
      setResult(false);
      return;
    } else {
      setResult(true);
    }
    const isComputerTurn =
      squares.filter((square) => square !== null).length % 2 === 1;

    const linesThatAre = (a, b, c) => {
      return lines.filter((squareIndexes) => {
        const squareValues = squareIndexes.map((index) => squares[index]);
        return (
          JSON.stringify([a, b, c].sort()) ===
          JSON.stringify(squareValues.sort())
        );
      });
    };

    const winLine = linesThatAre('x', 'x', 'x');
    const comWinLine = linesThatAre('o', 'o', 'o');

    if (winLine.length > 0) {
      const winIndex = winLine.filter((index) => squares[index] !== null);
      setNumbers(...winIndex);
    }
    if (comWinLine.length > 0) {
      const winIndex = comWinLine.filter((index) => squares[index] !== null);
      setNumbers(...winIndex);
    }

    const emptyIndexes = squares
      .map((square, index) => (square === null ? index : null))
      .filter((val) => val !== null);

    const playerWon = linesThatAre('x', 'x', 'x').length > 0;
    const computerWon = linesThatAre('o', 'o', 'o').length > 0;
    if (playerWon) {
      setWinner('x');
    }
    if (computerWon) {
      setWinner('o');
    }

    const randomFunction = ()=> {
      return emptyIndexes[Math.ceil(Math.random() * emptyIndexes.length)];
    }

    const putComputerAt = (index) => {
      let isIndex = emptyIndexes.includes(index);
      if(isIndex){
        let newSquares = squares;
        newSquares[index] = 'o';
        setSquares([...newSquares]);
      }else {
        let randomIndex = randomFunction();

        return putComputerAt(randomIndex);
      }
      
    };
    if (isComputerTurn) {
      const winingLines = linesThatAre('o', 'o', null);
      if (winingLines.length > 0) {
        const winIndex = winingLines[0].filter(
          (index) => squares[index] === null
        )[0];
        putComputerAt(winIndex);
        return;
      }

      const linesToBlock = linesThatAre('x', 'x', null);
      if (linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].filter(
          (index) => squares[index] === null
        )[0];
        putComputerAt(blockIndex);
        return;
      }

      const linesToContinue = linesThatAre('o', null, null);
      if (linesToContinue.length > 0) {
        putComputerAt(
          linesToContinue[0].filter((index) => squares[index] === null)[0]
        );
        return;
      }

  
      // const randomIndex =
      //   emptyIndexes[Math.ceil(Math.random() * emptyIndexes.length)];
      putComputerAt(3);
    }
  }, [squares]);

  function handleSquareClick(index) {
    const emptyIndexes = squares
      .map((square, index) => (square === null ? index : null))
      .filter((val) => val !== null);

    let isIndex = emptyIndexes.includes(index);

    const isPlayerTurn =
      squares.filter((square) => square !== null).length % 2 === 0;
    if (isPlayerTurn && isIndex) {
      let newSquares = squares;
      newSquares[index] = 'x';
      setSquares([...newSquares]);
    }
  }

  const handleReset = () => {
    setResult(false);
    setSquares(defaultSquares());
    setWinner(null);
    setNumbers([]);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <main>
          <Board>
            {squares.map((square, index) => {
              if (numbers && numbers.includes(index)) {
                return (
                  <Square
                    index="blue"
                    numbers={numbers}
                    key={index}
                    x={square === 'x' ? 1 : 0}
                    o={square === 'o' ? 1 : 0}
                    onClick={() => handleSquareClick(index)}
                  />
                );
              } else {
                return (
                  <Square
                    index=""
                    numbers={numbers}
                    key={index}
                    x={square === 'x' ? 1 : 0}
                    o={square === 'o' ? 1 : 0}
                    onClick={() => handleSquareClick(index)}
                  />
                );
              }
            })}
          </Board>
          {!!winner && winner === 'x' && (
            <div className="result green">
              You WON!
              <button
                type="button"
                className="btn"
                onClick={() => handleReset()}
              >
                Reset
              </button>
            </div>
          )}
          {!!winner && winner === 'o' && (
            <div className="result red">
              You LOST!
              <button
                type="button"
                className="btn"
                onClick={() => handleReset()}
              >
                Reset
              </button>
            </div>
          )}

          {!result ? (
            <div className="result blue">
              AnyOne won
              <button
                type="button"
                className="btn"
                onClick={() => handleReset()}
              >
                Reset
              </button>
            </div>
          ) : null}
        </main>
      </div>
    </>
  );
}

export default App;
