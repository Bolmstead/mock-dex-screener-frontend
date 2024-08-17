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
      const coinList = await MockDexScreenerAPI.search(searchInput);
      console.log("🚀 ~ getTokens ~ coinList:", coinList);
      updateResults(coinList);
      updateInfoLoaded(true);
    } catch (err) {
      console.error("App loadUserInfo: problem loading", err);
      updateResults([]);
      updateInfoLoaded(true);
    }
  }

  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>
          <img style={{ width: "45px" }} src="dex_screener_logo.png" />
          Mock DexScreener{" "}
        </Navbar.Brand>

        <Navbar id="basic-navbar-nav">
          <Nav className="justify-content-end">
            <Nav>
              <Form.Control
                id="searchBar"
                aria-describedby="searchBar"
                handleChange={handleChange}
              />
              <Button
                variant="primary"
                type="button"
                disabled={searching}
                onClick={searchCoins}
                style={{
                  backgroundColor: "black",
                  color: "white",
                  border: "black",
                  marginLeft: "10px",
                }}
              >
                {searching ? "Searching..." : "Search"}
              </Button>
              <Form.Select
                value={timeFrame}
                onChange={(e) => updateTimeframe(e.target.value)}
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
