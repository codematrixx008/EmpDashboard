import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./components/redux/store/store.ts";
import App from "./App.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n.ts';

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <Provider store={store}>
     <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </Provider>
);
