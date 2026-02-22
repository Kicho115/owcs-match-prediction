import { createFileRoute } from '@tanstack/react-router'
import { PlayerSearch } from '@/components/PlayerSearch'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">OWCS Match Prediction</h1>
          <p className="text-muted-foreground">
            Search for players and view their statistics
          </p>
        </div>
        <PlayerSearch />
      </div>
    </div>
  )
}
