import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PlayerSearch, type Player } from '@/components/PlayerSearch'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'

export const Route = createFileRoute('/')({ component: App })

type PredictionResult = { team1WinProbability: number; team2WinProbability: number }

function App() {
  const [team1, setTeam1] = useState<Player[]>([])
  const [team2, setTeam2] = useState<Player[]>([])
  const [result, setResult] = useState<PredictionResult | null>(null)

  const predict = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team1, team2 }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error((err as { error?: string }).error ?? 'Prediction failed')
      }
      return res.json() as Promise<PredictionResult>
    },
    onSuccess: setResult,
  })

  const allSelectedPlayers = [...team1, ...team2].map((p) => p.name)

  const addToTeam1 = (player: Player) => {
    if (team1.length < 5) {
      setTeam1([...team1, player])
    }
  }

  const addToTeam2 = (player: Player) => {
    if (team2.length < 5) {
      setTeam2([...team2, player])
    }
  }

  const removeFromTeam1 = (playerName: string) => {
    setTeam1(team1.filter((p) => p.name !== playerName))
  }

  const removeFromTeam2 = (playerName: string) => {
    setTeam2(team2.filter((p) => p.name !== playerName))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">OWCS Match Prediction</h1>
          <p className="text-muted-foreground">
            Select 5 players for each team to predict match outcome
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team 1 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-600">Team 1</h2>
              <span className="text-sm text-muted-foreground">
                {team1.length}/5 players
              </span>
            </div>

            {team1.length < 5 && (
              <PlayerSearch
                onPlayerSelect={addToTeam1}
                excludedPlayers={allSelectedPlayers}
                teamName="Add Player to Team 1"
              />
            )}

            <div className="space-y-2">
              {team1.map((player, index) => (
                <div
                  key={player.name}
                  className="flex items-center justify-between p-3 rounded-lg border bg-blue-50 dark:bg-blue-950/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-xs text-muted-foreground">
                        K/D: {player.stats['K/D Ratio'].toFixed(2)} •{' '}
                        {player.matches_played} matches
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromTeam1(player.name)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {team1.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  No players added yet
                </div>
              )}
            </div>
          </div>

          {/* Team 2 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-red-600">Team 2</h2>
              <span className="text-sm text-muted-foreground">
                {team2.length}/5 players
              </span>
            </div>

            {team2.length < 5 && (
              <PlayerSearch
                onPlayerSelect={addToTeam2}
                excludedPlayers={allSelectedPlayers}
                teamName="Add Player to Team 2"
              />
            )}

            <div className="space-y-2">
              {team2.map((player, index) => (
                <div
                  key={player.name}
                  className="flex items-center justify-between p-3 rounded-lg border bg-red-50 dark:bg-red-950/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-xs text-muted-foreground">
                        K/D: {player.stats['K/D Ratio'].toFixed(2)} •{' '}
                        {player.matches_played} matches
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromTeam2(player.name)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {team2.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  No players added yet
                </div>
              )}
            </div>
          </div>
        </div>

        {team1.length === 5 && team2.length === 5 && (
          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              className="px-8"
              disabled={predict.isPending}
              onClick={() => predict.mutate()}
            >
              {predict.isPending ? 'Predicting...' : 'Predict Match Outcome'}
            </Button>
            {result && (
              <div className="rounded-lg border bg-muted/50 p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">Win probability</p>
                <p className="text-2xl font-bold text-blue-600">
                  Team 1: {(result.team1WinProbability * 100).toFixed(1)}%
                </p>
                <p className="text-2xl font-bold text-red-600">
                  Team 2: {(result.team2WinProbability * 100).toFixed(1)}%
                </p>
              </div>
            )}
            {predict.isError && (
              <p className="text-sm text-destructive">{predict.error.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
