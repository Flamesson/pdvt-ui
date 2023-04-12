import React, { Component } from 'react';
import './App.css';
import Header from "../Header/Header";
import {Route, Routes} from "react-router-dom";
import Visualization from "../Visualization/Visualization";
import Data from "../Data/Data";
import Help from "../Help";
import {ToastContainer} from "react-toastify";
import EventEmitter from "eventemitter3";

class App extends Component {
  constructor(props) {
    super(props);
    this.hub = new EventEmitter();
  }

  render() {
    return (<div className={"App"}>
      <Header hub={this.hub}/>
      <div id={"body"}>
        <Routes>
          <Route path={"/"} element={<Visualization hub={this.hub}/>}/>
          <Route path={"/Visualization"} element={<Visualization hub={this.hub}/>}/>
          <Route path={"/Data"} element={<Data hub={this.hub}/>}/>
          <Route path={"/help"} element={<Help hub={this.hub}/>}/>
        </Routes>
        <ToastContainer position={"top-right"} autoClose={"5000"}/>
      </div>
    </div>);
  }
}

export default App;
