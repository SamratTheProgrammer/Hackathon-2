import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from "react-error-boundary";

function Fallback({ error }) {
  return (
    <div role="alert" className="p-4 bg-red-50 text-red-900">
      <h1 className="text-xl font-bold">Something went wrong:</h1>
      <pre className="mt-2 text-sm bg-red-100 p-2 rounded text-red-700 overflow-auto">{error.message}</pre>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={Fallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
