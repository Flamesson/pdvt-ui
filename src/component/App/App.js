import React, { Component } from 'react';
import './App.css';
import Header from "../Header/Header";
import {Route, Routes} from "react-router-dom";
import Visualization from "../Visualization/Visualization";
import Data from "../Data/Data";
import Handbook from "../Handbook/Handbook";
import {toast, ToastContainer} from "react-toastify";
import EventEmitter from "eventemitter3";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import AppEvents from "../../AppEvents";
import InputSource from "../../datamanager/InputSource";
import DataManager from "../../datamanager/DataManager";
import {withTranslation} from "react-i18next";

class App extends Component {
  constructor(props) {
    super(props);
    this.hub = new EventEmitter();

    this.generateText = this.generateText.bind(this);
  }

  componentDidMount() {
    let dataManager = new DataManager();
    if (extLocalStorage.isAbsent(AppStorage.FIRST_OPEN) && dataManager.getUsedInputSource() === InputSource.NOTHING) {
      this.generateText();
      extLocalStorage.setItem(AppStorage.FIRST_OPEN, false);

      const t = this.props.t;
      toast.info(t("info.text-input-filled.message"));
    }
  }

  generateText(ignored) {
    extLocalStorage.setItem(AppStorage.DATA_TEXT, AppStorage.MOCK_TEXT_DATA);
    this.hub.emit(AppEvents.INPUT_CHANGED);
  }

  render() {
    return (<div className={"App"}>
      <Header hub={this.hub}/>
      <div id={"body"}>
        <Routes>
          <Route path={"/"} element={<Visualization hub={this.hub}/>}/>
          <Route path={"/Visualization"} element={<Visualization hub={this.hub}/>}/>
          <Route path={"/Data"} element={<Data hub={this.hub}/>}/>
          <Route path={"/handbook"} element={<Handbook hub={this.hub}/>}/>
        </Routes>
        <ToastContainer position={"top-right"} autoClose={"5000"}/>
      </div>
    </div>);
  }
}

export default withTranslation()(App);
