'use strict'

const ThriveCoinERC721AvatarToken = artifacts.require('ThriveCoinERC721AvatarToken')

module.exports = async function (deployer, network, accounts) {
  if (['development', 'test', 'private'].includes(network)) {
    const owner = accounts[0]
    const config = {
      name_: 'ThriveCoinAvatarNFT',
      symbol_: 'THRIVEAVATAR',
      receiver: owner,
      feeNumerator: 100
    }

    await deployer.deploy(ThriveCoinERC721AvatarToken, ...Object.values(config), { from: owner })
  }

  if (['goerli', 'mumbai'].includes(network)) {
    const owner = accounts[0]
    const config = {
      name_: 'ThriveCoinAvatarNFTStaging',
      symbol_: 'THRIVEAVATARSTAGING',
      receiver: '0xeFd9434A2B1076D5C84D242b6f4AAb47270EcEAC',
      feeNumerator: 100
    }
    await deployer.deploy(ThriveCoinERC721AvatarToken, ...Object.values(config), { from: owner })
  }
}
