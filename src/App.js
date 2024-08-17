import "bootstrap/dist/css/bootstrap.min.css";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MockDexScreenerAPI from "./Api";
import "./App.css";
import Context from "./UserContext.js";
import AlertMessage from "./components/AlertMessage";
import NavigationBar from "./components/NavigationBar.js";
import useLocalStorage from "./hooks/useLocalStorageHook";

import { Container, Stack, Card, Button, Table } from "react-bootstrap";

function App() {
  const [token, setToken] = useLocalStorage("token");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [alert, setAlert] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [timeFrame, setTimeFrame] = useState("h24");

  const btcAddress = "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c";
  const solAddress = "0x570A5D26f7765Ecb712C0924E4De545B89fD43dF";
  const ethAddress = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8";

  useEffect(
    // Grab the userinfo with API call using token in local storage and save user to state
    function loadCoins() {
      async function getTokens() {
        try {
          let coinList = await MockDexScreenerAPI.getTokens(
            btcAddress + "," + solAddress + "," + ethAddress
          );
          console.log("🚀 ~ getTokens ~ coinList:", coinList);
          for (let item of coinList) {
            item.priceChangeDisplay = item.priceChange[timeFrame];
            item.txnsDisplay = item.txns[timeFrame];
            item.volumeDisplay = item.volume[timeFrame];
            console.log("priceChangeDisplay:: ", item.priceChangeDisplay);
          }
          setResults(coinList);
          setInfoLoaded(true);
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setResults([]);
          setInfoLoaded(true);
        }
      }
      getTokens();
    },
    []
  );

  useEffect(
    // Grab the userinfo with API call using token in local storage and save user to state
    function updateResults() {
      async function getTokens() {
        try {
          setInfoLoaded(false);
          const coinList = [...results];
          console.log("🚀 ~ getTokens ~ coinList:", coinList);
          for (let item of coinList) {
            item.priceChangeDisplay = item.priceChange[timeFrame];
            item.txnsDisplay = item.txns[timeFrame];
            item.volumeDisplay = item.volume[timeFrame];
            console.log("priceChangeDisplay:: ", item.priceChangeDisplay);
          }
          setResults(coinList);
          setInfoLoaded(true);
        } catch (err) {
          console.error("Error updating", err);
          setInfoLoaded(true);
        }
      }
      getTokens();
    },
    [timeFrame]
  );

  function updateResults(res) {
    setResults(res);
  }

  function updateTimeframe(selection) {
    console.log("🚀 ~ updateTimeframe ~ selection:", selection);
    setTimeFrame(selection);
  }

  function updateInfoLoaded(hasLoaded) {
    setInfoLoaded(hasLoaded);
  }

  if (!infoLoaded && !results) {
    <div className="App">
      <NavigationBar />
      <header className="App-header">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </header>
    </div>;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Context.Provider
          value={{
            setAlert,
            results,
            updateResults,
            updateInfoLoaded,
            infoLoaded,
            updateTimeframe,
          }}
        >
          <NavigationBar
            updateTimeframe={updateTimeframe}
            timeFrame={timeFrame}
          />
          <header className="App-header">
            {alert ? <AlertMessage alert={alert} /> : null}
            {!infoLoaded ? (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
              <Container>
                <Stack gap={3} className="col-md-8 mx-auto">
                  <div className="tasks-page-title">
                    <h1>Tokens</h1>
                    <div className="d-flex flex-wrap justify-content-center">
                      <div>
                        <Table striped bordered hover variant="dark">
                          <thead style={{ backgroundColor: "#39393E" }}>
                            <tr
                              style={{
                                fontSize: "16px",
                                backgroundColor: "#39393E",
                              }}
                            >
                              <th>#</th>
                              <th>Pair</th>
                              <th>Price (USD)</th>
                              <th>Liquidity (USD)</th>
                              <th>Volume (24h)</th>
                              <th>Txns (24h)</th>
                              <th>Price Change (24h)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.map((item, index) => (
                              <tr
                                style={{ fontSize: "14px" }}
                                key={item.pairAddress}
                              >
                                <td>{index + 1}</td>
                                <td>
                                  {item.baseToken.symbol}/
                                  {item.quoteToken.symbol}
                                </td>
                                <td>{item.priceUsd}</td>
                                <td>{item.liquidity.usd.toLocaleString()}</td>
                                <td>{item.volumeDisplay.toLocaleString()}</td>
                                <td>
                                  Buys: {item.txnsDisplay.buys} <br />
                                  Sells: {item.txnsDisplay.sells}
                                </td>
                                <td
                                  style={{
                                    color:
                                      item.priceChangeDisplay < 0
                                        ? "#F23645"
                                        : "#1B9981",
                                  }}
                                >
                                  {item.priceChangeDisplay}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </Stack>
              </Container>
            )}
          </header>
        </Context.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
