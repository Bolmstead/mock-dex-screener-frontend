import { useContext, useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import UserContext from "../UserContext.js";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import MockDexScreenerAPI from "../Api.js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function NavigationBar({ updateTimeframe, timeFrame }) {
  const { results, updateResults, updateInfoLoaded } = useContext(UserContext);
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);

  const handleChange = (event) => {
    setSearchInput(event.target.value);
  };

  async function searchCoins() {
    try {
      console.log("searchInput:: ", searchInput);
      setSearching(true);
      updateInfoLoaded(false);
      updateResults([]);
      const coinList = await MockDexScreenerAPI.search(searchInput);
      console.log("🚀 ~ getTokens ~ coinList:", coinList);
      for (let item of coinList) {
        item.priceChangeDisplay = item.priceChange[timeFrame];
        item.txnsDisplay = item.txns[timeFrame];
        item.volumeDisplay = item.volume[timeFrame];
        item.priceDisplay = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(item.priceUsd);
        console.log("priceChangeDisplay:: ", item.priceChangeDisplay);
      }
      updateResults(coinList);
      updateInfoLoaded(true);
      setSearching(false);
    } catch (err) {
      console.error("App loadUserInfo: problem loading", err);
      updateResults([]);
      updateInfoLoaded(true);
      setSearching(false);
    }
  }

  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Navbar.Brand>
            <img style={{ width: "45px" }} src="dex_screener_logo.png" />
            Mock DexScreener{" "}
          </Navbar.Brand>
        </a>

        <Navbar id="basic-navbar-nav">
          <Nav className="justify-content-end">
            <Nav>
              <Form.Control
                id="searchBar"
                aria-describedby="searchBar"
                onChange={handleChange}
              />
              <Button
                variant="primary"
                type="submit"
                disabled={searching || !searchInput}
                onClick={searchCoins}
                style={{
                  backgroundColor: "#1d1d22",
                  color: "white",
                  border: "#1d1d22",
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              >
                {searching ? "Searching..." : "Search"}
              </Button>
              <Form.Select
                value={timeFrame}
                onChange={(e) => updateTimeframe(e.target.value)}
                style={{ width: "90px" }}
              >
                <option value="m5">5M</option>
                <option value="h1">1H</option>
                <option value="h6">6H</option>
                <option value="h24">24H</option>
              </Form.Select>
            </Nav>
          </Nav>
        </Navbar>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
