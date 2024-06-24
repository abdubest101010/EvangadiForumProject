// App.js or your main component file
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routing from "./Routing"; // Assuming this is where your Routing component is defined

function App() {
  return (
    <Router>
      <Routing />
    </Router>
  );
}

export default App;
