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
import AllTasksPage from "./pages/AllTasksPage";
import AssignmentDetailsPage from "./pages/AssignmentDetailsPage";
import CreateTaskPage from "./pages/CreateTaskPage";
import LoginPage from "./pages/LoginPage.js";
import MyTasksPage from "./pages/MyTasksPage";
import SignupPage from "./pages/SignupPage.js";

import PrivateRoutes from "./utils/PrivateRoutes";

function App() {
  const [token, setToken] = useLocalStorage("token");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [alert, setAlert] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [results, setResults] = useState([]);

  const btcAddress = "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c";
  const solAddress = "0x570A5D26f7765Ecb712C0924E4De545B89fD43dF";
  const ethAddress = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8";

  useEffect(
    // Grab the userinfo with API call using token in local storage and save user to state
    function loadCoins() {
      async function getTokens() {
        if (true) {
          try {
            const coinList = await MockDexScreenerAPI.getTokens(
              btcAddress + "," + solAddress + "," + ethAddress
            );
            console.log("🚀 ~ getTokens ~ coinList:", coinList);
            setResults(coinList);
            setInfoLoaded(true);
          } catch (err) {
            console.error("App loadUserInfo: problem loading", err);
            setResults([]);
            setInfoLoaded(true);
          }
        } else {
          setInfoLoaded(true);
        }
      }
      getTokens();
    },
    []
  );

  function updateResults(res) {
    setResults(res);
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
          }}
        >
          <NavigationBar />
          <header className="App-header">
            {alert ? <AlertMessage alert={alert} /> : null}
            {!infoLoaded ? (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
              <Routes>
                <Route path="*" element={<MyTasksPage />} />
              </Routes>
            )}
          </header>
        </Context.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
