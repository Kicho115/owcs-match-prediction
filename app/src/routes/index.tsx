import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { type Player } from '@/components/PlayerSearch'
import { Button } from '@/components/ui/button'
import { TeamSection } from '@/components/TeamSection'
import { useMutation } from '@tanstack/react-query'

export const Route = createFileRoute('/')({ component: App })

type PredictionResult = {
  team1WinProbability: number
  team2WinProbability: number
}

type RolesSum = {
  Tank: number
  Damage: number
  Support: number
}

function App() {
  const [team1, setTeam1] = useState<Player[]>([])
  const [team1Roles, setTeam1Roles] = useState<RolesSum>({
    Tank: 0,
    Damage: 0,
    Support: 0,
  })
  const [team2, setTeam2] = useState<Player[]>([])
  const [team2Roles, setTeam2Roles] = useState<RolesSum>({
    Tank: 0,
    Damage: 0,
    Support: 0,
  })
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
        throw new Error(
          (err as { error?: string }).error ?? 'Prediction failed',
        )
      }
      return res.json() as Promise<PredictionResult>
    },
    onSuccess: setResult,
  })

  const allSelectedPlayers = [...team1, ...team2].map((p) => p.name)

  const addToTeam1 = (player: Player) => {
    if (team1.length >= 5) return

    // Only 1 tank, 2 damage and 2 support players allowed
    if (player.role === 'Tank' && team1.some((p) => p.role === 'Tank')) return
    if (
      player.role === 'Damage' &&
      team1.filter((p) => p.role === 'Damage').length >= 2
    )
      return
    if (
      player.role === 'Support' &&
      team1.filter((p) => p.role === 'Support').length >= 2
    )
      return

    setTeam1([...team1, player])
    setTeam1Roles({
      ...team1Roles,
      [player.role]: team1Roles[player.role] + 1,
    })
  }

  const addToTeam2 = (player: Player) => {
    if (team2.length >= 5) return

    // Only 1 tank, 2 damage and 2 support players allowed
    if (player.role === 'Tank' && team2.some((p) => p.role === 'Tank')) return
    if (
      player.role === 'Damage' &&
      team2.filter((p) => p.role === 'Damage').length >= 2
    )
      return
    if (
      player.role === 'Support' &&
      team2.filter((p) => p.role === 'Support').length >= 2
    )
      return

    setTeam2([...team2, player])
    setTeam2Roles({
      ...team2Roles,
      [player.role]: team2Roles[player.role] + 1,
    })
  }

  const removeFromTeam1 = (playerName: string) => {
    const player = team1.find((p) => p.name === playerName)
    if (!player) return
    setTeam1(team1.filter((p) => p.name !== playerName))
    setTeam1Roles({
      ...team1Roles,
      [player.role]: team1Roles[player.role] - 1,
    })
  }

  const removeFromTeam2 = (playerName: string) => {
    const player = team2.find((p) => p.name === playerName)
    if (!player) return
    setTeam2(team2.filter((p) => p.name !== playerName))
    setTeam2Roles({
      ...team2Roles,
      [player.role]: team2Roles[player.role] - 1,
    })
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Build your OWCS matchup
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Select 5 players for each team to predict which side has the edge.
            </p>
          </div>
          <div className="rounded-xl border bg-muted/40 px-4 py-3 text-xs text-muted-foreground sm:text-sm">
            <p className="font-medium text-foreground">Team rules</p>
            <p className="mt-1">
              1 Tank, 2 Damage, 2 Support per team. We&apos;ll stop you from
              overfilling a role so both teams stay balanced.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TeamSection
          title="Team 1"
          colorClass="text-blue-500 dark:text-blue-400"
          cardBgClass="bg-blue-50/70 dark:bg-blue-950/30"
          players={team1}
          excludedPlayers={allSelectedPlayers}
          onAddPlayer={addToTeam1}
          onRemovePlayer={removeFromTeam1}
        />

        <TeamSection
          title="Team 2"
          colorClass="text-red-500 dark:text-red-400"
          cardBgClass="bg-red-50/70 dark:bg-red-950/30"
          players={team2}
          excludedPlayers={allSelectedPlayers}
          onAddPlayer={addToTeam2}
          onRemovePlayer={removeFromTeam2}
        />
      </section>

      <section className="flex flex-col items-center gap-4">
        <Button
          size="lg"
          className="px-8"
          disabled={predict.isPending || team1.length !== 5 || team2.length !== 5}
          onClick={() => predict.mutate()}
        >
          {predict.isPending
            ? 'Crunching the numbers...'
            : 'Predict Match Outcome'}
        </Button>

        {(team1.length !== 5 || team2.length !== 5) && (
          <p className="text-xs text-muted-foreground sm:text-sm">
            Add {Math.max(0, 5 - team1.length)} more player
            {5 - team1.length === 1 ? '' : 's'} to Team 1 and{' '}
            {Math.max(0, 5 - team2.length)} more to Team 2 to enable
            predictions.
          </p>
        )}

        {result && (
          <div className="mt-2 w-full max-w-md rounded-2xl border bg-muted/60 p-4 text-center shadow-sm sm:p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Win probability
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:text-base">
              <div className="rounded-xl border bg-background/80 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-blue-500 dark:text-blue-400">
                  Team 1
                </p>
                <p className="mt-1 text-2xl font-bold sm:text-3xl">
                  {(result.team1WinProbability * 100).toFixed(1)}%
                </p>
              </div>
              <div className="rounded-xl border bg-background/80 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-red-500 dark:text-red-400">
                  Team 2
                </p>
                <p className="mt-1 text-2xl font-bold sm:text-3xl">
                  {(result.team2WinProbability * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {predict.isError && (
          <p className="text-sm text-destructive">{predict.error.message}</p>
        )}
      </section>
    </div>
  )
}
