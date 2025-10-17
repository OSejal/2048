interface TileProps {
  value: number
}

export default function Tile({ value }: TileProps) {
  const palette: Record<number, string> = {
    0: 'tile-empty',
    2: 'tile-2',
    4: 'tile-4',
    8: 'tile-8',
    16: 'tile-16',
    32: 'tile-32',
    64: 'tile-64',
    128: 'tile-128',
    256: 'tile-256',
    512: 'tile-512',
    1024: 'tile-1024',
    2048: 'tile-2048',
  }
  const color = palette[value] ?? 'tile-2048'
  const className = `tile ${color}`
  return (
    <div className={className}>
      {value !== 0 ? value : ''}
    </div>
  )
}


