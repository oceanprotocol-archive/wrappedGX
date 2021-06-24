import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Exchange from "./components/Exchange";
import './components/exchange.css'

import "./App.css";

export default function App(){

 
    return (
      <div className="App">
        <h1>Exchange GX for WrappedGX (WGX)</h1>
        <Exchange />
      </div>
    );
  
}
