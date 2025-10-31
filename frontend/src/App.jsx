import MapBox from './components/MapBox'
import './App.css'
import TopBar from './components/TopBar'

function App() {
  const handleSendToBackend = async (data) => {
    try {
    const response = await fetch('http://127.0.0.1:5000/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const result = await response.json()

    console.log('Route from backend:', result)

  } catch (err) {
    console.error('Error sending to backend:', err)
  }
  }
  return (
    <div className="wrapper">
      <TopBar />
      <MapBox onSend={handleSendToBackend} />
    </div>
  )

}

export default App
