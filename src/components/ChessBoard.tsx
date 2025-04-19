import { useState, useEffect } from 'react';
import { Chess, type Color, type Piece, type Square } from 'chess.js';

const ChessBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [currentColor, setCurrentColor] = useState<Color>('w');
  const [draggingPiece, setDraggingPiece] = useState<Square | null>(null);
  
  // SVG pieces mapping - lowercase for black pieces, uppercase for white pieces
  const pieces: Record<string, string> = {
    // Black pieces (lowercase)
    'p': 'https://www.chess.com/chess-themes/pieces/neo/150/bp.png',
    'n': 'https://www.chess.com/chess-themes/pieces/neo/150/bn.png',
    'b': 'https://www.chess.com/chess-themes/pieces/neo/150/bb.png',
    'r': 'https://www.chess.com/chess-themes/pieces/neo/150/br.png',
    'q': 'https://www.chess.com/chess-themes/pieces/neo/150/bq.png',
    'k': 'https://www.chess.com/chess-themes/pieces/neo/150/bk.png',
    // White pieces (uppercase)
    'P': 'https://www.chess.com/chess-themes/pieces/neo/150/wp.png',
    'N': 'https://www.chess.com/chess-themes/pieces/neo/150/wn.png',
    'B': 'https://www.chess.com/chess-themes/pieces/neo/150/wb.png',
    'R': 'https://www.chess.com/chess-themes/pieces/neo/150/wr.png',
    'Q': 'https://www.chess.com/chess-themes/pieces/neo/150/wq.png',
    'K': 'https://www.chess.com/chess-themes/pieces/neo/150/wk.png',
  };

  const handleDragStart = (e: React.DragEvent, square: Square) => {
    const piece = game.get(square);
    if (piece && piece.color === currentColor) {
      setDraggingPiece(square);
      setSelectedSquare(square);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    if (draggingPiece) {
      try {
        const move = game.move({
          from: draggingPiece,
          to: targetSquare,
          promotion: 'q'
        });
        if (move) {
          setGame(new Chess(game.fen()));
          setCurrentColor(currentColor === 'w' ? 'b' : 'w');
        }
      } catch (err) {
        console.log('Invalid move');
      }
      setDraggingPiece(null);
      setSelectedSquare(null);
    }
  };

  const handleSquareClick = (square: Square) => {
    if (selectedSquare === null) {
      const piece = game.get(square);
      if (piece && piece.color === currentColor) {
        setSelectedSquare(square);
      }
    } else {
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q'
        });
        if (move) {
          setCurrentColor(currentColor === 'w' ? 'b' : 'w');
        }
        setGame(new Chess(game.fen()));
      } catch (e) {
        console.log('Invalid move');
      }
      setSelectedSquare(null);
    }
  };

  const renderSquare = (square: Square, piece: Piece | null, isBlack: boolean) => {
    const isSelected = square === selectedSquare;
    const pieceKey = piece ? piece.type + (piece.color === 'w' ? 'P' : 'p').toUpperCase() : null;
    const pieceImage = piece ? pieces[piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase()] : null;
    
    return (
      <div
        key={square}
        onClick={() => handleSquareClick(square)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, square)}
        className={`w-24 h-24 flex items-center justify-center cursor-pointer relative
          ${isBlack ? 'bg-[#769656]' : 'bg-[#eeeed2]'}
          ${isSelected ? 'ring-4 ring-yellow-400 ring-inset' : ''}`}
      >
        {piece && (
          <img
            src={pieceImage || ''}
            alt={piece.type}
            className="w-20 h-20 cursor-grab active:cursor-grabbing chess-piece select-none"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, square)}
          />
        )}
        {/* Square coordinates */}
        {square[1] === '1' && (
          <div className="absolute bottom-0.5 left-1 text-sm text-gray-600">
            {square[0]}
          </div>
        )}
        {square[0] === 'a' && (
          <div className="absolute top-0.5 right-1 text-sm text-gray-600">
            {square[1]}
          </div>
        )}
      </div>
    );
  };

  const renderBoard = () => {
    const board = [];
    const ranks = currentColor === 'w' ? 
      ['8', '7', '6', '5', '4', '3', '2', '1'] :
      ['1', '2', '3', '4', '5', '6', '7', '8'];
    const files = currentColor === 'w' ?
      ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] :
      ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const square = (files[j] + ranks[i]) as Square;
        const piece = game.get(square);
        const isBlack = (i + j) % 2 === 1;
        board.push(renderSquare(square, piece || null, isBlack));
      }
    }
    return board;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-8 gap-0 border-8 border-[#2c2c2c]">
        {renderBoard()}
      </div>
      {game.isGameOver() && (
        <div className="mt-8 text-2xl font-bold text-white">
          {game.isCheckmate() ? 'Checkmate!' : 
           game.isDraw() ? 'Draw!' : 
           'Game Over!'}
        </div>
      )}
    </div>
  );
};

export default ChessBoard; 