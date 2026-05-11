import type { FeudScenario, FeudGameState } from './types'

const STORAGE_KEY = 'pedro-feud-custom-scenarios'
const GAME_STATE_KEY = 'pedro-feud-game-state'

export function loadCustomScenarios(): FeudScenario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as FeudScenario[]
  } catch {
    return []
  }
}

export function saveCustomScenarios(scenarios: FeudScenario[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios))
}

export function upsertCustomScenario(scenario: FeudScenario): void {
  const list = loadCustomScenarios()
  const idx = list.findIndex(s => s.id === scenario.id)
  if (idx >= 0) {
    list[idx] = scenario
  } else {
    list.push(scenario)
  }
  saveCustomScenarios(list)
}

export function deleteCustomScenario(id: string): void {
  saveCustomScenarios(loadCustomScenarios().filter(s => s.id !== id))
}

export function resetLocalData(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function generateId(): string {
  return `pedro-feud-custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function downloadJSON(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function saveGameState(state: FeudGameState): void {
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state))
}

export function loadGameState(): FeudGameState | null {
  try {
    const raw = localStorage.getItem(GAME_STATE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as FeudGameState
  } catch {
    return null
  }
}

export function clearGameState(): void {
  localStorage.removeItem(GAME_STATE_KEY)
}
