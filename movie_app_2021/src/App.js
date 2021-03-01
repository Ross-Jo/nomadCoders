import React from "react";
import { HashRouter, Route } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation";
import Home from "./routes/Home";
import Detail from "./routes/Detail";
import About from "./routes/About";

function App() {
  return (
      <HashRouter>
        <Navigation/>
        <Route path="/" exact={true} component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/movie/:id" component={Detail}/>
      </HashRouter>
  );
}

export default App;
