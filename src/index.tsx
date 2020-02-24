import React from "react";
import ReactDOM from "react-dom";
import { configure } from "mobx";
import App from "./App";
import utils from "utils";
import "styles/index.scss";
import "nprogress/nprogress.css";
import { setConfig } from 'react-hot-loader';

setConfig({
  reloadHooks: false,
});

utils.setRootFontSizeFromClient();
utils.initI18n(navigator.language);

configure({ enforceActions: "observed", });

ReactDOM.render(<App />, document.getElementById("app"));
