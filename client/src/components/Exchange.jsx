import React, { useEffect, useState } from 'react'
import getWeb3 from '../utils/getWeb3'
import getContract from '../utils/getContract'
import './exchange.css'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

export default function Ballances() {
  const [web3, updateWeb3] = useState()
  const [account, updateAccount] = useState()
  const [contract, updateContract] = useState()
  const [ballanceGX, updateBallanceGX] = useState()
  const [ballanceWGX, updateBallanceWGX] = useState()
  const [deposit, updateDeposit] = useState()
  const [withdrawal, updateWithdrawal] = useState()

  useEffect(() => {
    const getBallances = async () => {
      try {
        const web3 = await getWeb3()
        const contract = await getContract(web3)
        const account = await web3.eth.getAccounts()
        const ballanceGX = await web3.eth.getBalance(String(account))
        const ballanceWGX = await contract.methods
          .balanceOf(String(account))
          .call()

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

  async function updateDepositAmount(event) {
    updateDeposit(event.target.value)
  }

  async function updateWithdrawalAmount(event) {
    updateWithdrawal(event.target.value)
  }

  async function sendDeposit() {
    try {
      web3.eth
        .sendTransaction({
          from: String(account),
          to: contract._address,
          value: web3.utils.toWei(deposit)
        })
        .then(async function (receipt) {
          console.log('receipt', receipt)
          const ballanceGX = await web3.eth.getBalance(String(account))
          const ballanceWGX = await contract.methods
            .balanceOf(String(account))
            .call()
          updateBallanceGX(web3.utils.fromWei(ballanceGX))
          updateBallanceWGX(web3.utils.fromWei(ballanceWGX))
        })
        .catch((e) => {
          console.log(e)
        })
    } catch (error) {
      console.log(error)
    }
  }

  async function withdraw() {
    try {
      contract.methods
        .withdraw(web3.utils.toWei(withdrawal))
        .send({ from: String(account) })
        .then(async function (receipt) {
          console.log('receipt', receipt)
          const ballanceGX = await web3.eth.getBalance(String(account))
          const ballanceWGX = await contract.methods
            .balanceOf(String(account))
            .call()
          updateBallanceGX(web3.utils.fromWei(ballanceGX))
          updateBallanceWGX(web3.utils.fromWei(ballanceWGX))
        })
        .catch((e) => {
          console.log(e)
        })
    } catch (error) {
      return console.error('ERROR 1:', error)
    }
  }

  if (!web3 || !contract) {
    return (
      <div>
        Loading Web3, accounts, and contract...
        <br />
        <br />
        Please make sure you are logged into Metamask and have selected the
        correct network.
      </div>
    )
  } else if (account === undefined) {
    return <div>Please connect your account via Metamask to proceed.</div>
  }
  return (
    <>
      <Card className="Ballances">
        <Card.Body>
          <b>Your account:</b> {account}
          <br />
          <b>WGX address:</b> {process.env.REACT_APP_WGX_ADDRESS}
          <br />
          <b>Your GX ballance:</b> {ballanceGX} <br />
          <b>Your WGX ballance:</b> {ballanceWGX}
        </Card.Body>
      </Card>

      <Tabs defaultActiveKey="deposit" className="Exchange">
        <Tab eventKey="deposit" title="Deposit" className="tab">
          <h2>
            Exchage {deposit} GX for {deposit} WGX
          </h2>
          <input
            type="number"
            name="depositAmount"
            onChange={updateDepositAmount}
          />
          <Button variant="primary" onClick={sendDeposit}>
            Deposit {deposit} GX
          </Button>
        </Tab>
        <Tab eventKey="withdraw" title="Withdraw" className="tab">
          <h2>
            Exchage {withdrawal} WGX for {withdrawal} GX
          </h2>
          <input
            type="number"
            name="WithdrawalAmount"
            onChange={updateWithdrawalAmount}
          />
          <Button variant="primary" onClick={withdraw}>
            Withdraw {withdrawal} WGX
          </Button>
        </Tab>
      </Tabs>
    </>
  )
}
