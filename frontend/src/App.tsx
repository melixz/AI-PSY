import { HomePage } from './pages/HomePage'
import './App.css'
import SideBar from './components/SideBar'

function App() {


  return (
    <div className='container-1920 flex bg-white text-text'>
      <SideBar />
      <HomePage />
    </div>
  )
}

export default App
