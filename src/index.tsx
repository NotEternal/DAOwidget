import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./pages/App";
import reportWebVitals from "./reportWebVitals";

import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "./utils/getLibrary";

import { NetworkContextName } from "src/helpers/constants";

const appElement = document.getElementById("daofactory_app");

window.ENS_DOMAIN = appElement?.getAttribute("data-ens") || "onout.eth";
window.NETWORK_ID = appElement?.getAttribute("data-network") || "56";
window.TOKEN_ADDRESS =
  appElement?.getAttribute("data-token-address") ||
  "0x9636a568c53F40dF01cdAb64401A0b6bFaEa9095";
window.TOKEN_SYMBOL = appElement?.getAttribute("data-token-symbol") || "MINING";
window.TOKEN_DECIMALS = appElement?.getAttribute("data-token-decimals") || "18";
window.COLOR_TEMPLATE =
  appElement?.getAttribute("data-color-template") || "light_template";
window.HIDE_SERVICE_LINK = true // appElement?.getAttribute("data-hide-service-link") === 'true';
window.REQUIRED_AMOUNT_TO_PUBLISH = appElement?.getAttribute("data-required-amount-to-publish") || 50000;
window.REQUIRED_AMOUNT_TO_VOTE = appElement?.getAttribute("data-required-amount-to-vote") || 1;

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <App />
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </React.StrictMode>,
  appElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
