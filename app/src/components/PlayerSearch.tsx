import { useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import playersData from '#/data/players_data.json'

interface Player {
  name: string
  matches_played: number
  stats: {
    'Damage Dealt': number
    'Healing Done': number
    'Damage Mitigated': number
    Eliminations: number
    Deaths: number
    'K/D Ratio': number
    'Objective Time': number
    Assists: number
    'Final Blows': number
  }
}

interface PlayerSearchProps {
  onPlayerSelect?: (player: Player) => void
}

export function PlayerSearch({ onPlayerSelect }: PlayerSearchProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  const players = playersData.players as Player[]

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player)
    onPlayerSelect?.(player)
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Search Player</label>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Type a player name..." />
          <CommandList>
            <CommandEmpty>No player found.</CommandEmpty>
            <CommandGroup heading="Players">
              {players
                .filter((player) => player.matches_played > 0)
                .map((player) => (
                  <CommandItem
                    key={player.name}
                    value={player.name}
                    onSelect={() => handleSelectPlayer(player)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{player.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {player.matches_played} matches
                      </span>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>

      {selectedPlayer && (
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{selectedPlayer.name}</h3>
            <span className="text-sm text-muted-foreground">
              {selectedPlayer.matches_played} matches played
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">K/D Ratio:</span>{' '}
              <span className="font-medium">
                {selectedPlayer.stats['K/D Ratio'].toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Eliminations per:</span>{' '}
              <span className="font-medium">
                {selectedPlayer.stats.Eliminations.toFixed(1)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Damage Dealt:</span>{' '}
              <span className="font-medium">
                {selectedPlayer.stats['Damage Dealt'].toFixed(0)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Healing Done:</span>{' '}
              <span className="font-medium">
                {selectedPlayer.stats['Healing Done'].toFixed(0)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Assists:</span>{' '}
              <span className="font-medium">
                {selectedPlayer.stats.Assists.toFixed(1)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Final Blows:</span>{' '}
              <span className="font-medium">
                {selectedPlayer.stats['Final Blows'].toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
