import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import playersData from '#/data/players_data.json'
import { ROLE_EMOJI, ROLE_LIMITS, type Role } from '@/lib/constants'

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
  role: Role
}

interface PlayerSearchProps {
  onPlayerSelect: (player: Player) => void
  excludedPlayers?: string[]
  teamName: string
  teamPlayers: Player[]
}

export function PlayerSearch({
  onPlayerSelect,
  excludedPlayers = [],
  teamName,
  teamPlayers,
}: PlayerSearchProps) {
  const players = playersData.players as Player[]

  const roleCounts = teamPlayers.reduce(
    (acc, player) => {
      acc[player.role] = (acc[player.role] ?? 0) + 1
      return acc
    },
    {} as Record<Role, number>,
  )

  const availablePlayers = players.filter((player) => {
    if (player.matches_played <= 0) return false
    if (excludedPlayers.includes(player.name)) return false

    const maxForRole = ROLE_LIMITS[player.role]
    const currentCount = roleCounts[player.role] ?? 0

    if (currentCount >= maxForRole) return false

    return true
  })

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
                  <div className="flex items-center gap-2">
                    <span>{ROLE_EMOJI[player.role as Role]}</span>
                    <span>{player.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {player.matches_played} matches
                    </span>
                    •
                    <span className="text-xs text-muted-foreground">
                      {player.role}
                    </span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
