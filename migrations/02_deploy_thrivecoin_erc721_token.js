'use strict'

const ThriveCoinERC721Token = artifacts.require('ThriveCoinERC721Token')

module.exports = async function (deployer, network, accounts) {
  if (['development', 'test', 'private'].includes(network)) {
    const owner = accounts[0]
    const config = {
      name_: 'ThriveCoinNFT',
      symbol_: 'THRIVENFT'
    }

    await deployer.deploy(ThriveCoinERC721Token, ...Object.values(config), { from: owner })
  }
}
