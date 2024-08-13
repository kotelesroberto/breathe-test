import "./App.css";
import HabitChart from "./components/HabitChart";
import FactoryStatus from "./components/FactoryStatus";

function App() {
  return (
    <>
      <HabitChart habitData={[0, 3, 2, 5, 3, 2, 1, 7, 0, 5, 1, 6, 1, 6, 1]} />
      <FactoryStatus />
    </>
  );
}

export default App;
