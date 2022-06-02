'use strict'

/* eslint-env mocha */

const assert = require('assert')
const ThriveCoinERC721Token = artifacts.require('ThriveCoinERC721Token')

describe('ThriveCoinERC721Token', () => {
  contract('erc721 enumerable interface tests', (accounts) => {
    let erc721 = null

    before(async () => {
      erc721 = await ThriveCoinERC721Token.deployed()

      await erc721.mint(accounts[0], 'ipfs://panda', { from: accounts[0] })
      await erc721.mint(accounts[0], 'ipfs://bear', { from: accounts[0] })
      await erc721.mint(accounts[3], 'ipfs://dragon', { from: accounts[0] })
      await erc721.mint(accounts[3], 'ipfs://puma', { from: accounts[0] })
      await erc721.mint(accounts[0], 'ipfs://lion', { from: accounts[0] })
    })

    it('totalSupply should return total number of tokens stored in contract', async () => {
      const totalSupply = await erc721.totalSupply.call()
      assert.strictEqual(totalSupply.toNumber(), 5)
    })

    it('tokenByIndex should iterate over each index', async () => {
      const totalSupply = await erc721.totalSupply.call()
      const tokens = []
      for (let index = 0; index < totalSupply; index++) {
        tokens.push((await erc721.tokenByIndex.call(index)).toNumber())
      }

      assert.deepStrictEqual(tokens, [1, 2, 3, 4, 5])
    })

    it('tokenByIndex should throw when trying to access out of bound index', async () => {
      try {
        await erc721.tokenByIndex.call(25)
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721Enumerable: global index out of bounds'))
      }
    })

    it('tokenOfOwnerByIndex should iterate over each index', async () => {
      const totalSupply = await erc721.balanceOf.call(accounts[0])
      const tokens = []
      for (let index = 0; index < totalSupply; index++) {
        tokens.push((await erc721.tokenOfOwnerByIndex.call(accounts[0], index)).toNumber())
      }

      assert.deepStrictEqual(tokens, [1, 2, 5])
    })

    it('tokenOfOwnerByIndex should throw when trying to access out of bound index', async () => {
      try {
        await erc721.tokenOfOwnerByIndex.call(accounts[0], 25)
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721Enumerable: owner index out of bounds'))
      }
    })
  })
})
