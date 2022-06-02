'use strict'

/* eslint-env mocha */

const assert = require('assert')
const ThriveCoinERC721Token = artifacts.require('ThriveCoinERC721Token')

describe('ThriveCoinERC721Token', () => {
  contract('erc721 metadata interface tests', (accounts) => {
    let erc721 = null

    before(async () => {
      erc721 = await ThriveCoinERC721Token.deployed()

      await erc721.mint(accounts[0], 'ipfs://panda', { from: accounts[0] })
    })

    it('token info params should be accessible', async () => {
      const name = await erc721.name.call()
      const symbol = await erc721.symbol.call()

      assert.strictEqual(name, 'ThriveCoinNFT')
      assert.strictEqual(symbol, 'THRIVENFT')
    })

    it('tokenURI should return URI for token', async () => {
      const uri = await erc721.tokenURI.call(1)
      assert.strictEqual(uri, 'ipfs://panda')
    })

    it('tokenURI should throw when token does not exist', async () => {
      try {
        await erc721.tokenURI.call(21)
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721URIStorage: URI query for nonexistent token'))
      }
    })
  })
})
