'use strict'

const ThriveCoinERC721BurnableToken = artifacts.require('ThriveCoinERC721BurnableToken')

module.exports = async function (deployer, network, accounts) {
  if (['development', 'test', 'private'].includes(network)) {
    const owner = accounts[0]
    const config = {
      name_: 'ThriveCoinBurnableNFT',
      symbol_: 'THRIVEBURNABLE'
    }

    await deployer.deploy(ThriveCoinERC721BurnableToken, ...Object.values(config), { from: owner })
  }
}
