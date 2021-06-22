import React, { ReactElement, useEffect, useState } from "react";
import getWeb3 from "../utils/getWeb3";
import getContract from "../utils/getContract";

export default function Ballances(){
    
    const [web3, updateWeb3] = useState()
    const [account, updateAccount] = useState()
    const [contract, updateContract] = useState()
  
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
       // await contract.methods.Transfer(String(account), 10).send({ from: String(account) })
       web3.eth.sendTransaction({
        from: String(account),
        to: contract._address,
        value: '1000000000000000000'
    })
    .then(function(receipt){
        console.log("receipt", receipt)
    });
    }

    async function withdraw() {
      await contract.methods.withdraw("1000000000000000000").send({ from: String(account) })
    }

      if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
      }
      return (
        <div className="Exchange">
            <h2>Exchage 1 GX for 1 WGX</h2>
            <button onClick={deposit}>Deposit 1 GX</button>
            <h2>Exchage 1 WGX for 1 GX</h2>
            <button onClick={withdraw}>Withdraw 1 WGX</button>
        </div>
      );
    
  }