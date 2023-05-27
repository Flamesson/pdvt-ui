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
import {BrowserView, MobileView} from "react-device-detect";
import MobileData from "../Data/MobileData";
import Analysis from "../Analysis/Analysis";
import Objects from "../../utils/Objects";
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import GraphEditor from "../GraphEditor/GraphEditor";
import CodeScreen from "../CodeScreen/CodeScreen";
import Code from "../CodeScreen/Code";

const REACT_APP_SERVER_ADDRESS: String = process.env.REACT_APP_SERVER_ADDRESS;
const SERVER_URL = "http://" + REACT_APP_SERVER_ADDRESS;
const WEB_SOCKETS_ENDPOINT = "/ws/pdvt";
const SOCKET_URL = `${SERVER_URL}${WEB_SOCKETS_ENDPOINT}`;

class App extends Component {
  constructor(props) {
    super(props);
    this.hub = new EventEmitter();

    this.generateText = this.generateText.bind(this);
    this.receivePdvt = this.receivePdvt.bind(this);
  }

  static getServerUrl(): String {
    return SERVER_URL;
  }

  componentDidMount() {
    let dataManager = new DataManager();
    if (extLocalStorage.isAbsent(AppStorage.FIRST_OPEN) && dataManager.getUsedInputSource() === InputSource.NOTHING) {
      this.generateText();
      extLocalStorage.setItem(AppStorage.FIRST_OPEN, false);

      const t = this.props.t;
      toast.info(t("info.text-input-filled.message"));
    }

    this.onCodeChanged = (code: Code) => {
      if (Objects.isNotCorrect(this.client)) {
        return;
      }

      if (Objects.isCorrect(this.previousSubscription)) {
        this.previousSubscription.unsubscribe();
      }

      if (code.notEmpty()) {
        this.previousSubscription = this.client.subscribe("/user/" + code.getCodeword() + "/ws/pdvt", this.receivePdvt);
      }
    };
    this.hub.on(AppEvents.CODE_CHANGED, this.onCodeChanged);

    let client = Stomp.over(SockJS(SOCKET_URL));
    client.connect({}, (): void => {
      this.client = client;
      if (extLocalStorage.isPresent(AppStorage.SAVED_CODE)) {
        let code = new Code(extLocalStorage.getItem(AppStorage.SAVED_CODE));
        this.previousSubscription = this.client.subscribe("/user/" + code.getCodeword() + "/ws/pdvt", this.receivePdvt);
      }
    });
  }

  componentWillUnmount() {
    this.hub.removeListener(AppEvents.CODE_CHANGED, this.onCodeChanged);
  }

  receivePdvt(message): void {
    let raw = message.body;

    for (let pos = 0; pos < raw.length; pos++) {
      let char = raw.charAt(pos);
      if (char === '.') {
        let numberAsString = raw.substring(0, pos);
        let length = Number.parseInt(numberAsString);
        let filename = raw.substring(pos + 1, pos + length + 1);
        let body = raw.substring(pos + length + 1);

        let file = new File([atob(body)], filename);
        extLocalStorage.saveFile(AppStorage.DATA_FILE, file, () => {
          this.hub.emit(AppEvents.INPUT_CHANGED_USER_ORIGIN);
        });

        break;
      }
    }
  }

  generateText(ignored) {
    extLocalStorage.setItem(AppStorage.DATA_TEXT, AppStorage.MOCK_TEXT_DATA);
    this.hub.emit(AppEvents.INPUT_CHANGED_USER_ORIGIN);
  }

  render() {
    return (<div className={"App"}>
      <Header hub={this.hub}/>
      <div id={"body"}>
        <Routes>
          <Route path={"/"} element={<Visualization hub={this.hub}/>}/>
          <Route path={"/Visualization"} element={<Visualization hub={this.hub}/>}/>
          <Route path={"/Data"} element={
            <>
              <BrowserView>
                <Data hub={this.hub}/>
              </BrowserView>
              <MobileView>
                <MobileData hub={this.hub}/>
              </MobileView>
            </>
          }/>
          <Route path={"/handbook"} element={<Handbook hub={this.hub}/>}/>
          <Route path={"/analysis"} element={<Analysis hub={this.hub}/>}/>
          <Route path={"/editor"} element={<GraphEditor hub={this.hub}/>}/>
          <Route path={"/code"} element={<CodeScreen hub={this.hub}/>}/>
        </Routes>
        <ToastContainer position={"top-right"} autoClose={"5000"}/>
      </div>
    </div>);
  }
}

export default withTranslation()(App);
