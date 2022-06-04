'use strict'

/* eslint-env mocha */

const assert = require('assert')
const { keccak256 } = require('@ethersproject/keccak256')
const ThriveCoinERC721Token = artifacts.require('ThriveCoinERC721Token')

describe('ThriveCoinERC721Token', () => {
  contract('pause tests', (accounts) => {
    let erc721 = null
    const MINTER_ROLE = keccak256(Buffer.from('MINTER_ROLE', 'utf8'))

    before(async () => {
      erc721 = await ThriveCoinERC721Token.deployed()

      await erc721.mint(accounts[0], 'ipfs://panda', { from: accounts[0] })
      await erc721.mint(accounts[0], 'ipfs://lion', { from: accounts[0] })
      await erc721.mint(accounts[0], 'ipfs://tiger', { from: accounts[0] })
      await erc721.pause({ from: accounts[0] })
    })

    it('unpause should emit Unpaused event', async () => {
      const res = await erc721.unpause({ from: accounts[0] })
      const txLog = res.logs[0]

      assert.strictEqual(txLog.event, 'Unpaused')
      assert.strictEqual(txLog.args.account, accounts[0])
    })

    it('pause should emit Paused event', async () => {
      const res = await erc721.pause({ from: accounts[0] })
      const txLog = res.logs[0]

      assert.strictEqual(txLog.event, 'Paused')
      assert.strictEqual(txLog.args.account, accounts[0])
    })

    it('safeTransferFrom should fail when paused', async () => {
      try {
        await await erc721.safeTransferFrom(accounts[0], accounts[1], 1, { from: accounts[0] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721Pausable: token transfer while paused'))
      }
    })

    it('transferFrom should fail when paused', async () => {
      try {
        await await erc721.transferFrom(accounts[0], accounts[1], 1, { from: accounts[0] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721Pausable: token transfer while paused'))
      }
    })

    it('mint should fail while paused', async () => {
      let error
      try {
        await erc721.mint(accounts[1], 'ipfs://gorilla', { from: accounts[0] })
      } catch (err) {
        error = err
      }
      assert.ok(error instanceof Error)
    })

    it('grantRole should work when paused', async () => {
      await erc721.grantRole(MINTER_ROLE, accounts[1], { from: accounts[0] })
      await erc721.grantRole(MINTER_ROLE, accounts[2], { from: accounts[0] })
    })

    it('revokeRole should work when paused', async () => {
      await erc721.revokeRole(MINTER_ROLE, accounts[1], { from: accounts[0] })
    })

    it('renounceRole should work when paused', async () => {
      await erc721.renounceRole(MINTER_ROLE, accounts[2], { from: accounts[2] })
    })
  })
})
