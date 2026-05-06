import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class GameErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--red)' }}>
          <h2>Qualcosa è andato storto</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {this.state.error.message}
          </p>
          <button
            style={{ marginTop: '1.5rem', padding: '0.5rem 1.5rem', cursor: 'pointer' }}
            onClick={() => this.setState({ error: null })}
          >
            Riprova
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
