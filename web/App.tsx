import './App.css'
import { greet } from '../pkg/building_club'

function App() {
  return (
    <>
      <div className="flex border-2">
        <h1>Vite + React + WebAssembly</h1>
        {greet("React CWB")}
      </div>
    </>
  )
}

export default App
