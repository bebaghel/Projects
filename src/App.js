import "./App.css";
import UncontrolledInput from "./component/Uncontrolled";
import ControlledInput from "./component/Controlled";
import HOC from './component/HOC';
function App() {
  return (
    <>
      <UncontrolledInput />
      <ControlledInput />
      <HOC/>
    </>
  );
}
// npm i react redux
export default App;
