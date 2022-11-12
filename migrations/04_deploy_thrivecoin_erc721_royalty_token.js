'use strict'

const ThriveCoinERC721RoyaltyToken = artifacts.require('ThriveCoinERC721RoyaltyToken')

module.exports = async function (deployer, network, accounts) {
  if (['development', 'test', 'private'].includes(network)) {
    const owner = accounts[0]
    const config = {
      name_: 'ThriveCoinRoyaltyNFT',
      symbol_: 'THRIVEROYALTY',
      receiver: owner,
      feeNumerator: 100
    }

    await deployer.deploy(ThriveCoinERC721RoyaltyToken, ...Object.values(config), { from: owner })
  }
}
