'use strict'

/* eslint-env mocha */

const assert = require('assert')
const ThriveCoinERC721BurnableToken = artifacts.require('ThriveCoinERC721BurnableToken')

describe('ThriveCoinERC721BurnableToken', () => {
  contract('burn tests', (accounts) => {
    let erc721 = null

    before(async () => {
      erc721 = await ThriveCoinERC721BurnableToken.deployed()

      await erc721.mint(accounts[1], 'ipfs://panda', { from: accounts[0] })
      await erc721.mint(accounts[1], 'ipfs://bear', { from: accounts[0] })
      await erc721.mint(accounts[1], 'ipfs://dragon', { from: accounts[0] })
      await erc721.mint(accounts[1], 'ipfs://koji', { from: accounts[0] })
    })

    it('owner should be able to burn own tokens', async () => {
      const tokenId = '1'
      const accBalBefore = await erc721.balanceOf.call(accounts[1])
      await erc721.burn(tokenId, { from: accounts[1] })

      const accBalAfter = await erc721.balanceOf.call(accounts[1])
      assert.strictEqual(accBalBefore.toNumber(), 4)
      assert.strictEqual(accBalAfter.toNumber(), 3)

      try {
        await erc721.ownerOf.call(tokenId)
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: owner query for nonexistent token'))
      }

      try {
        await erc721.tokenURI.call(tokenId)
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721URIStorage: URI query for nonexistent token'))
      }
    })

    it('approved account should be able to burn owner\'s token', async () => {
      const tokenId = 2
      const accBalBefore = await erc721.balanceOf.call(accounts[1])
      await erc721.approve(accounts[2], tokenId, { from: accounts[1] })
      await erc721.burn(tokenId, { from: accounts[2] })

      const accBalAfter = await erc721.balanceOf.call(accounts[1])
      assert.strictEqual(accBalBefore.toNumber(), 3)
      assert.strictEqual(accBalAfter.toNumber(), 2)

      try {
        await erc721.ownerOf.call(tokenId)
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: owner query for nonexistent token'))
      }

      try {
        await erc721.tokenURI.call(tokenId)
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721URIStorage: URI query for nonexistent token'))
      }
    })

    it('approved for all account should be able to burn owner\'s token', async () => {
      const tokenId = '3'
      const accBalBefore = await erc721.balanceOf.call(accounts[1])
      await erc721.setApprovalForAll(accounts[3], true, { from: accounts[1] })
      await erc721.burn(tokenId, { from: accounts[3] })

      const accBalAfter = await erc721.balanceOf.call(accounts[1])
      assert.strictEqual(accBalBefore.toNumber(), 2)
      assert.strictEqual(accBalAfter.toNumber(), 1)

      try {
        await erc721.ownerOf.call(tokenId)
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: owner query for nonexistent token'))
      }

      try {
        await erc721.tokenURI.call(tokenId)
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721URIStorage: URI query for nonexistent token'))
      }
    })

    it('non owner and non approved account should not be able to burn owner\'s token', async () => {
      try {
        const tokenId = '4'
        await erc721.burn(tokenId, { from: accounts[0] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ThriveCoinERC721BurnableToken: caller is not owner nor approved'))
      }
    })
  })
})
