import { PlayerSearch, type Player } from '@/components/PlayerSearch'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

type TeamSectionProps = {
  title: string
  colorClass: string
  cardBgClass: string
  players: Player[]
  excludedPlayers: string[]
  onAddPlayer: (player: Player) => void
  onRemovePlayer: (playerName: string) => void
}

export function TeamSection({
  title,
  colorClass,
  cardBgClass,
  players,
  excludedPlayers,
  onAddPlayer,
  onRemovePlayer,
}: TeamSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${colorClass}`}>{title}</h2>
        <span className="text-sm text-muted-foreground">
          {players.length}/5 players
        </span>
      </div>

      {players.length < 5 && (
        <PlayerSearch
          onPlayerSelect={onAddPlayer}
          excludedPlayers={excludedPlayers}
          teamName={`Add Player to ${title}`}
          teamPlayers={players}
        />
      )}

      <div className="space-y-2">
        {players.map((player, index) => (
          <div
            key={player.name}
            className={`flex items-center justify-between p-3 rounded-lg border ${cardBgClass}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                #{index + 1}
              </span>
              <div>
                <p className="font-medium">{player.name}</p>
                <p className="text-xs text-muted-foreground">
                  K/D: {player.stats['K/D Ratio'].toFixed(2)} •{' '}
                  {player.matches_played} matches • {player.role}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemovePlayer(player.name)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {players.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            No players added yet
          </div>
        )}
      </div>
    </div>
  )
}
