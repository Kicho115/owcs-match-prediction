import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Home, Menu, Moon, SunMedium, X } from 'lucide-react'

import { useTheme } from './ThemeProvider'
import { Button } from './ui/button'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === 'dark'

  return (
    <>
      <header className="border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background/80 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground sm:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Link
              to="/"
              className="group flex items-center gap-2 text-sm font-semibold tracking-tight"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-xs font-bold text-primary-foreground shadow-md">
                OW
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-base sm:text-lg">
                  OWCS Match Prediction
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
              onClick={toggleTheme}
              className="hidden sm:inline-flex"
            >
              {isDark ? (
                <SunMedium className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 transform flex-col border-r bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-300 ease-in-out sm:w-80 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-xs font-bold text-primary-foreground shadow-md">
              OW
            </span>
            <span className="text-sm font-semibold">OWCS Match Prediction</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
              onClick={toggleTheme}
            >
              {isDark ? (
                <SunMedium className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3 text-sm">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            activeProps={{
              className:
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
            }}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>

          {/* Future navigation items can go here */}
        </nav>
      </aside>
    </>
  )
}
