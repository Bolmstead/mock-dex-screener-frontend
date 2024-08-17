import axios from "axios";

const BASE_URL = `https://mock-dex-screener-backend-983c087ef2ed.herokuapp.com/dex`;

/** API Class **/

class MockDexScreenerAPI {
  // the token for the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}${endpoint}`;
    // const headers = {
    //   Authorization: `Bearer ${localStorage.getItem("token")}`,
    // };
    const params = method === "get" ? data : {};
    try {
      return (await axios({ url, method, data, params })).data;
    } catch (err) {
      if (err.response) {
        throw err.response.data.error;
      } else {
        throw { message: "Server Error" };
      }
    }
  }

  // Individual API routes
  static async getPairs(chainId, pairAddresses) {
    const res = await this.request(`/pairs/${chainId}/${pairAddresses}`);
    return res;
  }

  static async getTokens(tokenAddresses) {
    const res = await this.request(`/tokens/${tokenAddresses}`);
    return res;
  }

  static async search(searchString) {
    const res = await this.request(`/search/${searchString}`);
    return res;
  }
}

export default MockDexScreenerAPI;
