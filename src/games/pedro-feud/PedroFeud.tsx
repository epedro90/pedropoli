import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { FeudScenario } from './types'
import ScenarioList from './ScenarioList'
import ScenarioEditor from './ScenarioEditor'
import GamePlay from './GamePlay'
import { upsertCustomScenario } from './storage'

type View = 'list' | 'editor' | 'play'

export default function PedroFeud() {
  const navigate = useNavigate()
  const [view, setView] = useState<View>('list')
  const [editTarget, setEditTarget] = useState<FeudScenario | null>(null)
  const [playTarget, setPlayTarget] = useState<FeudScenario | null>(null)

  const handleEdit = (scenario: FeudScenario) => {
    setEditTarget(scenario)
    setView('editor')
  }

  const handlePlay = (scenario: FeudScenario) => {
    setPlayTarget(scenario)
    setView('play')
  }

  const handleCreate = () => {
    setEditTarget(null)
    setView('editor')
  }

  const handleSave = (scenario: FeudScenario) => {
    upsertCustomScenario(scenario)
    setView('list')
  }

  if (view === 'editor') {
    return (
      <ScenarioEditor
        scenario={editTarget}
        onSave={handleSave}
        onCancel={() => setView('list')}
      />
    )
  }

  if (view === 'play' && playTarget) {
    return (
      <GamePlay
        scenario={playTarget}
        onExit={() => setView('list')}
      />
    )
  }

  return (
    <ScenarioList
      onPlay={handlePlay}
      onEdit={handleEdit}
      onCreate={handleCreate}
      onBack={() => navigate('/')}
    />
  )
}
