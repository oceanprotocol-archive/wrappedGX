const wrappedGX = artifacts.require('WrappedGX')

module.exports = async function (deployer) {
  // Deploying WrappedGX Contract
  deployer.deploy(wrappedGX)
}
