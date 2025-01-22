import ModeCard from "../components/ModeCard"
import NavBar from "../components/NavBar"

export const HomePage = () => {
  return (
    <div className="flex flex-col justify-center text-text">
      <NavBar />
      <ModeCard title="Test" description="text text"/>
    </div>
  )
}