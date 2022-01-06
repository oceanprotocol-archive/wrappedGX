import WrappedGX from '../contracts/WrappedGX.json'

export default async function getContract(web3) {
  let instance = null
  // Get the contract instance.
  const networkId = await web3.eth.net.getId()
  
    instance = new web3.eth.Contract(
      WrappedGX.abi,
      process.env.REACT_APP_WGX_ADDRESS
    )
  console.log(instance)
  return instance
}
