import React, { ReactElement, useEffect, useState } from "react";
import Exchange from "./components/Exchange";

import "./App.css";

export default function App(){

 
    return (
      <div className="App">
        <h1>Exchange GX for WrappedGX (WGX)</h1>
        <Exchange />
      </div>
    );
  
}
