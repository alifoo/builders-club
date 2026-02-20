import './App.css'
import { greet } from '../pkg/building_club'

function App() {
  return (
    <>
      <h1>Vite + React + WebAssembly</h1>
      {greet("React CWB")}
    </>
  )
}

export default App
