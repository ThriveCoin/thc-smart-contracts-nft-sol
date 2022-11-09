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

  if (['goerli', 'mumbai'].includes(network)) {
    const owner = accounts[0]
    const config = {
      name_: 'ThriveCoinRoyaltyNFTStaging',
      symbol_: 'THRIVEROYALTYSTAGING',
      receiver: '0xeFd9434A2B1076D5C84D242b6f4AAb47270EcEAC',
      feeNumerator: 100
    }
    await deployer.deploy(ThriveCoinERC721RoyaltyToken, ...Object.values(config), { from: owner })
  }
}
