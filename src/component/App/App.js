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
import Maps from "../../utils/Maps";
import {withRouter} from "../withRouter";
import Optional from "../../utils/Optional";

const REACT_APP_SERVER_ADDRESS: String = process.env.REACT_APP_SERVER_ADDRESS;
const SERVER_URL = "http://" + REACT_APP_SERVER_ADDRESS;
const WEB_SOCKETS_ENDPOINT = "/ws/pdvt";
const SOCKET_URL = `${SERVER_URL}${WEB_SOCKETS_ENDPOINT}`;

const PDVT_TASK = "pdvt";
const FILE_AND_ANALYSE_TASK = "file-and-analyze";

class App extends Component {
  constructor(props) {
    super(props);
    this.hub = new EventEmitter();
    this.previousSubscriptions = new Map() //<String, *>

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

      let keysToFuncs = Maps.ofVararg(new Option(PDVT_TASK, this.receivePdvt), new Option(FILE_AND_ANALYSE_TASK, this.receiveFileAndAnalyze));
      keysToFuncs.forEach((value, key) => {
        if (this.previousSubscriptions.has(key)) {
          this.previousSubscriptions.get(key).unsubscribe();
          this.previousSubscriptions.delete(key);
        }

        if (code.notEmpty()) {
          let subscription = this.client.subscribe("/user/" + code.getCodeword() + "/ws/" + key, value);
          this.previousSubscriptions.set(key, subscription);
        }
      });
    };
    this.hub.on(AppEvents.CODE_CHANGED, this.onCodeChanged);

    let client = Stomp.over(SockJS(SOCKET_URL));
    client.connect({}, (): void => {
      this.client = client;
      if (extLocalStorage.isPresent(AppStorage.SAVED_CODE)) {
        let code: Code = new Code(extLocalStorage.getItem(AppStorage.SAVED_CODE));
        this.previousSubscriptions.set(PDVT_TASK, this.client.subscribe("/user/" + code.getCodeword() + `/ws/${PDVT_TASK}`, this.receivePdvt));
        this.previousSubscriptions.set(FILE_AND_ANALYSE_TASK, this.client.subscribe("/user/" + code.getCodeword() + `/ws/${FILE_AND_ANALYSE_TASK}`, this.receiveFileAndAnalyze))
      }
    });


    this.hub.on(AppEvents.INPUT_CHANGED_USER_ORIGIN, () => {
      extLocalStorage.setItem(AppStorage.ANALYSIS_PERFORMED, false);
    });
  }

  componentWillUnmount() {
    this.hub.removeListener(AppEvents.CODE_CHANGED, this.onCodeChanged);
  }

  receivePdvt(message, callback): void {
    let file: File = this.extractTaskFile(message);
    extLocalStorage.saveFile(AppStorage.DATA_FILE, file, () => {
      this.hub.emit(AppEvents.INPUT_CHANGED_USER_ORIGIN);
      Optional.ofNullable(callback).ifPresent(call => call());
    });
  }

  receiveFileAndAnalyze = (message): void => {
    this.receivePdvt(message, () => {
      extLocalStorage.setItem(AppStorage.ANALYSIS_PERFORMED, true);
      this.props.navigate("/analysis");
    });
  }

  extractTaskFile = (message): File => {
    let raw = message.body;

    for (let pos = 0; pos < raw.length; pos++) {
      let char = raw.charAt(pos);
      if (char === '.') {
        let numberAsString = raw.substring(0, pos);
        let length = Number.parseInt(numberAsString);
        let filename = raw.substring(pos + 1, pos + length + 1);
        let body = raw.substring(pos + length + 1);

        return new File([atob(body)], filename);
      }
    }

    throw new Error("Failed to extract a task file");
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

export default withTranslation()(withRouter(App));
