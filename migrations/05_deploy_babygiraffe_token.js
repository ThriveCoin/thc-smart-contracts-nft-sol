'use strict'

const ThriveCoinERC721BurnableToken = artifacts.require('ThriveCoinERC721BurnableToken')

module.exports = async function (deployer, network, accounts) {
  if (['mumbai'].includes(network)) {
    const owner = accounts[0]
    const config = {
      name_: 'BabyGiraffeStaging',
      symbol_: 'THRIVEBABYSTAGING'
    }

    await deployer.deploy(ThriveCoinERC721BurnableToken, ...Object.values(config), { from: owner })
  }
}
