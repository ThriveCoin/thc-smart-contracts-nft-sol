'use strict'

/* eslint-env mocha */

const assert = require('assert')
const ThriveCoinERC721Token = artifacts.require('ThriveCoinERC721Token')
const ERC721HolderTest = artifacts.require('ERC721HolderTest')
const Migrations = artifacts.require('Migrations')
const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

describe('ThriveCoinERC721Token', () => {
  contract('mint tests', (accounts) => {
    let erc721 = null; let erc721holder = null; let migrations = null

    before(async () => {
      erc721 = await ThriveCoinERC721Token.deployed()
      erc721holder = await ERC721HolderTest.deployed()
      migrations = await Migrations.deployed()
    })

    it('should mint token with uri to account', async () => {
      const beforeTotalSupply = await erc721.totalSupply.call()
      const beforeBalanceOf = await erc721.balanceOf.call(accounts[1])

      await erc721.mint(accounts[1], 'ipfs://panda', { from: accounts[0] })

      const afterTotalSupply = await erc721.totalSupply.call()
      const afterBalanceOf = await erc721.balanceOf.call(accounts[1])
      const ownerOf = await erc721.ownerOf.call(1)
      const uri = await erc721.tokenURI.call(1)

      assert.strictEqual(beforeTotalSupply.toNumber(), 0)
      assert.strictEqual(beforeBalanceOf.toNumber(), 0)
      assert.strictEqual(afterTotalSupply.toNumber(), 1)
      assert.strictEqual(afterBalanceOf.toNumber(), 1)
      assert.strictEqual(ownerOf, accounts[1])
      assert.strictEqual(uri, 'ipfs://panda')
    })

    it('should auto increment token id', async () => {
      const beforeTotalSupply = await erc721.totalSupply.call()
      const beforeBalanceOf = await erc721.balanceOf.call(accounts[2])

      await erc721.mint(accounts[2], 'ipfs://lion', { from: accounts[0] })

      const afterTotalSupply = await erc721.totalSupply.call()
      const afterBalanceOf = await erc721.balanceOf.call(accounts[2])
      const ownerOf = await erc721.ownerOf.call(2)
      const uri = await erc721.tokenURI.call(2)

      assert.strictEqual(beforeTotalSupply.toNumber(), 1)
      assert.strictEqual(beforeBalanceOf.toNumber(), 0)
      assert.strictEqual(afterTotalSupply.toNumber(), 2)
      assert.strictEqual(afterBalanceOf.toNumber(), 1)
      assert.strictEqual(ownerOf, accounts[2])
      assert.strictEqual(uri, 'ipfs://lion')
    })

    it('should emit transfer event', async () => {
      const res = await erc721.mint(accounts[1], 'ipfs://gorilla', { from: accounts[0] })
      const transferLog = res.logs[0]

      assert.strictEqual(transferLog.event, 'Transfer')
      assert.strictEqual(transferLog.args.from, ADDRESS_ZERO)
      assert.strictEqual(transferLog.args.to, accounts[1])
      assert.strictEqual(transferLog.args.tokenId.toNumber(), 3)
    })

    it('should mint to ERC721Receiver implementer contract', async () => {
      await erc721.mint(erc721holder.address, 'ipfs://zebra', { from: accounts[0] })

      const ownerOf = await erc721.ownerOf.call(4)
      const uri = await erc721.tokenURI.call(4)

      assert.strictEqual(ownerOf, erc721holder.address)
      assert.strictEqual(uri, 'ipfs://zebra')
    })

    it('cannot mint to non ERC721Receiver implementer contract', async () => {
      let error
      try {
        await erc721.mint(migrations.address, 'ipfs://zebra', { from: accounts[0] })
      } catch (err) {
        error = err
      }

      assert.ok(error instanceof Error)
    })

    it('cannot mint to zero address', async () => {
      try {
        await erc721.mint(ADDRESS_ZERO, 'ipfs://snake', { from: accounts[0] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: mint to the zero address'))
      }
    })
  })
})
