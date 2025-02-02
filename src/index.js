import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import generateMuiTheme from "./mui/theme";
import { ThemeProvider } from "@material-ui/styles";
import PinContext from './contexts/PinContext';
import TranscriptionsContext from './contexts/TranscriptionsContext';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={generateMuiTheme()}>
      <TranscriptionsContext>
        <PinContext>
          <App />
        </PinContext>
      </TranscriptionsContext>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
