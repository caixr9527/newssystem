import React from 'react'
import IndexRouter from "./router/IndexRouter";
import {HashRouter} from "react-router-dom";

export default function App() {
  return (
        <HashRouter>
            <IndexRouter/>
        </HashRouter>
  )
}


