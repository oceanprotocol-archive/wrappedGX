import React, { ReactElement, useEffect, useState } from "react";
import getWeb3 from "../utils/getWeb3";
import getContract from "../utils/getContract";

export default function Ballances(){
    
    const [web3, updateWeb3] = useState()
    const [account, updateAccount] = useState()
    const [contract, updateContract] = useState()
    const [ballanceGX, updateBallanceGX] = useState()
    const [ballanceWGX, updateBallanceWGX] = useState()
  
    useEffect(() => {
      const getBallances = async () => {
        const web3 = await getWeb3();
        const contract = await getContract(web3)
        const account = await web3.eth.getAccounts();
  
        updateWeb3(web3)
        updateAccount(account)
        updateContract(contract)
      }
      getBallances(web3)
    })

    async function deposit(){
        await contract.methods.approve(String(account), 1).send({ from: String(account) })
    }

      if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
      }
      return (
        <div className="Exchange">
            <h2>Exchage GX for WGX</h2>
            <button onClick={deposit}>Deposit GX</button>
        </div>
      );
    
  }