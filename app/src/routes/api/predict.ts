import { createFileRoute } from '@tanstack/react-router'
import { join } from 'node:path'

// Player type must match client
type PlayerStats = {
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

type Player = { name: string; matches_played: number; stats: PlayerStats }

// ONNX input names from the exported sklearn pipeline
const DIFF_INPUT_NAMES = [
  'Damage_Dealt_10m_hist_diff',
  'Eliminations_10m_hist_diff',
  'Final_Blows_10m_hist_diff',
  'K_D_Ratio_hist_diff',
  'Deaths_10m_hist_diff',
  'Healing_Done_10m_hist_diff',
  'Damage_Mitigated_10m_hist_diff',
  'Objective_Time_10m_hist_diff',
  'Assists_10m_hist_diff',
] as const

const STAT_KEYS: (keyof PlayerStats)[] = [
  'Damage Dealt',
  'Eliminations',
  'Final Blows',
  'K/D Ratio',
  'Deaths',
  'Healing Done',
  'Damage Mitigated',
  'Objective Time',
  'Assists',
]

function sumStat(players: Player[], key: keyof PlayerStats): number {
  return players.reduce((s, p) => s + p.stats[key], 0)
}

function buildFeatures(team1: Player[], team2: Player[]) {
  const diffFloats: number[] = []
  for (let i = 0; i < STAT_KEYS.length; i++) {
    const key = STAT_KEYS[i]
    const t1 = sumStat(team1, key)
    const t2 = sumStat(team2, key)
    diffFloats.push(t1 - t2)
  }
  return { diffFloats }
}

export const Route = createFileRoute('/api/predict')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ort = await import('onnxruntime-node')
        const body = (await request.json()) as {
          team1: Player[]
          team2: Player[]
        }
        const { team1, team2 } = body
        if (
          !Array.isArray(team1) ||
          !Array.isArray(team2) ||
          team1.length !== 5 ||
          team2.length !== 5
        ) {
          return Response.json(
            {
              error:
                'Request must include team1 and team2, each with exactly 5 players',
            },
            { status: 400 },
          )
        }

        const modelPath = join(
          process.cwd(),
          'server-models',
          'match_prediction_model.onnx',
        )
        const session = await ort.InferenceSession.create(modelPath)
        const { diffFloats } = buildFeatures(team1, team2)

        const feed: Record<string, any> = {}
        for (let i = 0; i < DIFF_INPUT_NAMES.length; i++) {
          feed[DIFF_INPUT_NAMES[i]] = new ort.Tensor(
            'float32',
            new Float32Array([diffFloats[i]]),
            [1, 1],
          )
        }
        // Though these features doesnt really affect the prediction, we need to provide them anyway to prevent onnx from crashing
        feed['phase'] = new ort.Tensor('string', ['Control'], [1, 1])
        feed['stage'] = new ort.Tensor('string', ['Group'], [1, 1])

        const outputNames = session.outputNames as string[]
        const outputMetadata = (session as any).outputMetadata as
          | { isTensor: boolean }[]
          | undefined

        let tensorOutputNames = outputNames
        if (outputMetadata && outputMetadata.length === outputNames.length) {
          tensorOutputNames = outputNames.filter(
            (_name, idx) => outputMetadata[idx]?.isTensor,
          )
        }

        const mainOutputName = tensorOutputNames[1] ?? tensorOutputNames[0]

        const results = await session.run(feed, [mainOutputName])
        const tensor = results[mainOutputName] as { data: unknown }
        const data = tensor.data as Float32Array

        const team1WinProbability = Number(data[1])
        const team2WinProbability = Number(data[0])
        return Response.json({ team1WinProbability, team2WinProbability })
      },
    },
  },
})
