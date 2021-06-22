import React, { ReactElement, useEffect, useState } from "react";
import getWeb3 from "../utils/getWeb3";
import getContract from "../utils/getContract";

export default function Ballances(){
    
    const [web3, updateWeb3] = useState()
    const [account, updateAccount] = useState()
    const [contract, updateContract] = useState()
    const [ballanceGX, updateBallanceGX] = useState()
    const [ballanceWGX, updateBallanceWGX] = useState()
    const [deposit, updateDeposit] = useState()
    const [withdrawal, updateWithdrawal] = useState()
  
    useEffect(() => {
      const getBallances = async () => {
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
      }
      getBallances(web3)
    })

    async function updateDepositAmount(event) {
      updateDeposit(event.target.value)
    }

    async function updateWithdrawalAmount(event) {
      updateWithdrawal(event.target.value)
    }

    async function sendDeposit(){
       try {
        await web3.eth.sendTransaction({
          from: String(account),
              to: contract._address,
              value: web3.utils.toWei(deposit)
          })
          .then(async function(receipt){
            console.log("receipt", receipt)
            const ballanceGX = await web3.eth.getBalance(String(account))
            const ballanceWGX = await contract.methods.balanceOf(String(account)).call()
            updateBallanceGX(web3.utils.fromWei(ballanceGX))
            updateBallanceWGX(web3.utils.fromWei(ballanceWGX))
        });
          // .on('transactionHash', () => {
          //   updateBallanceGX(web3.utils.fromWei(ballanceGX))
          //   updateBallanceWGX(web3.utils.fromWei(ballanceWGX))
          // })
          // .on('Reject', (error) => {
          //   console.log("Error: ", error)
          //    })
       } catch (error) {
         console.log(error)
       }
       
    }

    async function withdraw() {
      try {
        await contract.methods.withdraw(web3.utils.toWei(withdrawal)).send({ from: String(account) })
        .on('error', (error) => {
          console.log("Error: ", error)
           })
      } catch (error) {
        console.error(error)
      }
    }

      if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
      }
      return (
        <>
        <div className="Ballances">
          <p>Your account: {account}</p>
          <p>Your GX ballance: {ballanceGX}</p>
          <p>Your WGX ballance: {ballanceWGX}</p>
        </div>
        <div className="Exchange">
            <h2>Exchage {deposit} GX for {deposit} WGX</h2>
            <input type="number" name="depositAmount" onChange={updateDepositAmount} />
            <button onClick={sendDeposit}>Deposit {deposit} GX</button>
            <h2>Exchage {withdrawal} WGX for {withdrawal} GX</h2>
            <input type="number" name="WithdrawalAmount" onChange={updateWithdrawalAmount} />
            <button onClick={withdraw}>Withdraw {withdrawal} WGX</button>
        </div>
        </>

      );
    
  }