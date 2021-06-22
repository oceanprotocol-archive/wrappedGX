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
        try {
          const web3 = await getWeb3();
          const contract = await getContract(web3)
          const account = await web3.eth.getAccounts();
          const ballanceGX = await web3.eth.getBalance(String(account))
          const ballanceWGX = await contract.methods.balanceOf(String(account)).call()
    
          updateWeb3(web3)
          updateAccount(account)
          updateContract(contract)
          updateBallanceGX(web3.utils.fromWei(ballanceGX))
          updateBallanceWGX(web3.utils.fromWei(ballanceWGX))
        } catch (error) {
          console.log(error)
        }
        
      }
      getBallances(web3)
    })
// console.log("web3", web3)    
      if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
      }
      return (
        <div className="Ballances">
          <p>Your account: {account}</p>
          <p>Your GX ballance: {ballanceGX}</p>
          <p>Your WGX ballance: {ballanceWGX}</p>
        </div>
      );
    
  }