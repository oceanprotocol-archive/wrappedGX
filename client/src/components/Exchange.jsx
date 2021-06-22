import React, { ReactElement, useEffect, useState } from "react";
import getWeb3 from "../utils/getWeb3";
import getContract from "../utils/getContract";

export default function Ballances(){
    
    const [web3, updateWeb3] = useState()
    const [account, updateAccount] = useState()
    const [contract, updateContract] = useState()
    const [deposit, updateDeposit] = useState()
    const [withdrawal, updateWithdrawal] = useState()
  
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

    async function updateDepositAmount(event) {
      updateDeposit(event.target.value)
    }

    async function updateWithdrawalAmount(event) {
      updateWithdrawal(event.target.value)
    }

    async function sendDeposit(){
       try {
        web3.eth.sendTransaction({
          from: String(account),
              to: contract._address,
              value: web3.utils.toWei(deposit)
          })
          .then(function(receipt){
              console.log("receipt", receipt)
          });
       } catch (error) {
         console.log(error)
       }
       
    }

    async function withdraw() {
      try {
        await contract.methods.withdraw(web3.utils.toWei(withdrawal)).send({ from: String(account) })
      } catch (error) {
        console.error(error)
      }
    }

      if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
      }
      return (
        <div className="Exchange">
            <h2>Exchage {deposit} GX for {deposit} WGX</h2>
            <input type="number" name="depositAmount" onChange={updateDepositAmount} />
            <button onClick={sendDeposit}>Deposit {deposit} GX</button>
            <h2>Exchage {withdrawal} WGX for {withdrawal} GX</h2>
            <input type="number" name="WithdrawalAmount" onChange={updateWithdrawalAmount} />
            <button onClick={withdraw}>Withdraw {withdrawal} WGX</button>
        </div>
      );
    
  }