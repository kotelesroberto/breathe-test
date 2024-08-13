import "./App.css";
import HabitChart from "./components/HabitChart";
import FactoryStatus from "./components/FactoryStatus";
import SelectStyle from "./components/SelectStyle";

function App() {
  return (
    <div className="width-full">
      <HabitChart habitData={[0, 3, 2, 5, 3, 2, 1, 7, 0, 5, 1, 6, 1, 6, 1]} />
      <FactoryStatus />
      <SelectStyle />
    </div>
  );
}

export default App;
