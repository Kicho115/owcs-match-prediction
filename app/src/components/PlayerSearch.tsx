import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import playersData from '#/data/players_data.json'

export interface Player {
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
  onPlayerSelect: (player: Player) => void
  excludedPlayers?: string[]
  teamName: string
}

export function PlayerSearch({ onPlayerSelect, excludedPlayers = [], teamName }: PlayerSearchProps) {
  const players = playersData.players as Player[]

  const availablePlayers = players.filter(
    (player) => player.matches_played > 0 && !excludedPlayers.includes(player.name)
  )

  return (
    <div className="w-full space-y-2">
      <label className="text-sm font-medium">{teamName}</label>
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Type a player name..." />
        <CommandList>
          <CommandEmpty>No player found.</CommandEmpty>
          <CommandGroup heading="Available Players">
            {availablePlayers.map((player) => (
              <CommandItem
                key={player.name}
                value={player.name}
                onSelect={() => onPlayerSelect(player)}
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
  )
}
