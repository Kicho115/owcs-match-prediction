export const ROLE_EMOJI = {
  Tank: '🛡️',
  Damage: '⚔️',
  Support: '⛑️',
} as const

export type Role = keyof typeof ROLE_EMOJI

export const ROLE_LIMITS: Record<Role, number> = {
  Tank: 1,
  Damage: 2,
  Support: 2,
}
