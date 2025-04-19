import ChessBoard from './components/ChessBoard'

function App() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#2c2c2c] p-4">
      <div className="w-full max-w-[calc(100vh-2rem)] aspect-square">
        <ChessBoard />
      </div>
    </div>
  )
}

export default App
