import { createElement } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import { GAME_ROUTES } from './games/registry'
import GameErrorBoundary from './components/GameErrorBoundary'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {GAME_ROUTES.map(game => (
          <Route
            key={game.id}
            path={game.route}
            element={
              <GameErrorBoundary>
                {createElement(game.Component)}
              </GameErrorBoundary>
            }
          />
        ))}
      </Routes>
    </Layout>
  )
}
