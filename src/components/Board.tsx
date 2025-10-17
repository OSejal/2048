import React from 'react'
import Tile from './Tile'

interface BoardProps {
  board: number[][]
}

export default function Board({ board }: BoardProps) {
  const size = board.length
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${size}, 1fr)`,
    gridTemplateRows: `repeat(${size}, 1fr)`,
  }
  return (
    <div className="board" style={gridStyle}>
      {board.map((row, r) => (
        row.map((cell, c) => (
          <Tile key={`${r}-${c}`} value={cell} />
        ))
      ))}
    </div>
  )
}


