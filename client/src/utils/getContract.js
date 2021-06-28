import WrappedGX from '../contracts/WrappedGX.json'

export default async function getContract(web3) {
  let instance = null
  // Get the contract instance.
  const networkId = await web3.eth.net.getId()
  const deployedNetwork = WrappedGX.networks[networkId]

  if (deployedNetwork) {
    instance = new web3.eth.Contract(
      WrappedGX.abi,
      deployedNetwork && deployedNetwork.address
    )
  } else {
    window.alert(
      'Sorry, the WrappedGX smart contract is not deployed to the current network.'
    )
  }

  return instance
}
