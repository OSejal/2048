import './App.css'
import { useEffect, useState } from 'react'
import Board from './components/Board'
import { applyMove, initializeGame, type Direction } from './game/logic'

interface GameState {
  board: number[][]
  score: number
  won: boolean
  over: boolean
}

export default function App() {
  const [state, setState] = useState<GameState>(() => initializeGame(4))
  const [bestScore, setBestScore] = useState(
    () => Number(localStorage.getItem('bestScore')) || 0
  )

  // Keyboard controls
  useEffect(() => {
    const keyToDir: Record<string, Direction> = {
      ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
      w: 'up', s: 'down', a: 'left', d: 'right',
    }
    const handleKey = (e: KeyboardEvent) => {
      const dir = keyToDir[e.key]
      if (dir) {
        e.preventDefault()
        setState(prev => applyMove(prev, dir))
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Track best score
  useEffect(() => {
    if (state.score > bestScore) {
      setBestScore(state.score)
      localStorage.setItem('bestScore', String(state.score))
    }
  }, [state.score, bestScore])

  // Swipe controls
  let start: { x: number; y: number } | null = null
  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = e => {
    const t = e.changedTouches[0]
    start = { x: t.clientX, y: t.clientY }
  }

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = e => {
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return

    const dir: Direction =
      Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? 'right' : 'left')
        : (dy > 0 ? 'down' : 'up')

    setState(prev => applyMove(prev, dir))
    start = null
  }

  const restart = () => setState(initializeGame(4))

  return (
    <div className="app" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <header className="header">
        <h1>2048</h1>
        <div className="controls">
          <button onClick={restart}>New Game</button>
        </div>
        <div className="score">Score: {state.score}</div>
        <div className="score">Best: {bestScore}</div>
      </header>

      <div className="board-wrap">
        <Board board={state.board} />
        {(state.won || state.over) && (
          <div className="overlay">
            <div className="overlay-card">
              <div className="overlay-title">
                {state.won ? 'You win!' : 'Game over'}
              </div>
              <div>Score: {state.score}</div>
              <div className="overlay-actions">
                {state.won && (
                  <button onClick={() => setState({ ...state, won: false })}>
                    Keep Playing
                  </button>
                )}
                <button onClick={restart}>Restart</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!state.over && !state.won && (
        <div className="help">Use arrow keys, WASD, or swipe on mobile.</div>
      )}
    </div>
  )
}
