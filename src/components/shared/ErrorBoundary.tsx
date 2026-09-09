import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/** Last-resort fallback: without this, an uncaught render/effect error
 * unmounts the whole tree and leaves only the dark body background from
 * kb-tokens.css (loaded as a plain CSS import, so it survives independent of
 * React) - a page that looks "totally black, no error" instead of failing
 * loudly. This surfaces the actual error message on screen instead. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error rendering the app:', error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '48px',
          background: '#0d0342',
          color: '#fff',
          fontFamily: 'ui-monospace, monospace',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20 }}>Something crashed while rendering this page.</h1>
        <pre style={{ whiteSpace: 'pre-wrap', color: '#f9accc', margin: 0 }}>
          {error.message}
          {'\n'}
          {error.stack}
        </pre>
      </div>
    )
  }
}
