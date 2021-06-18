import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import getContract from "./utils/getContract";

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      const instance = await getContract(web3)
       // Use web3 to get the user's accounts.
       const accounts = await web3.eth.getAccounts();

      // Set web3, accounts, and contract to the state
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };



  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Exchange GX for WrappedGX (WGX)</h1>
        <p>Your account: {this.state.accounts}</p>

      </div>
    );
  }
}

export default App;
