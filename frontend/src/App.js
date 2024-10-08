import { Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import "./App.css"

function App() {
  return (
    <div className="App">
      
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/chats" element={<Chatpage/>}/>
      </Routes>
    </div>
  );
}

export default App;
