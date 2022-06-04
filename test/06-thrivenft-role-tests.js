'use strict'

/* eslint-env mocha */

const assert = require('assert')
const { keccak256 } = require('@ethersproject/keccak256')
const ThriveCoinERC721Token = artifacts.require('ThriveCoinERC721Token')

describe('ThriveCoinERC721Token', () => {
  contract('role tests', (accounts) => {
    let erc721 = null
    const ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const MINTER_ROLE = keccak256(Buffer.from('MINTER_ROLE', 'utf8'))
    const PAUSER_ROLE = keccak256(Buffer.from('PAUSER_ROLE', 'utf8'))
    const DUMMY_ROLE = keccak256(Buffer.from('DUMMY_ROLE', 'utf8'))

    before(async () => {
      erc721 = await ThriveCoinERC721Token.deployed()

      await erc721.grantRole(MINTER_ROLE, accounts[1], { from: accounts[0] })
      await erc721.grantRole(PAUSER_ROLE, accounts[2], { from: accounts[0] })
      await erc721.mint(accounts[0], 'ipfs://panda', { from: accounts[0] })
      await erc721.mint(accounts[0], 'ipfs://lion', { from: accounts[0] })
      await erc721.mint(accounts[0], 'ipfs://tiger', { from: accounts[0] })
    })

    it('hasRole should return true when user has role', async () => {
      const res = await erc721.hasRole(ADMIN_ROLE, accounts[0])
      assert.strictEqual(res, true)
    })

    it('hasRole should return false when user does not have role', async () => {
      const res = await erc721.hasRole(MINTER_ROLE, accounts[2])
      assert.strictEqual(res, false)
    })

    it('deployer should have all three roles by default', async () => {
      const res = await Promise.all([
        erc721.hasRole.call(ADMIN_ROLE, accounts[0]),
        erc721.hasRole.call(MINTER_ROLE, accounts[0]),
        erc721.hasRole.call(PAUSER_ROLE, accounts[0])
      ])

      assert.strictEqual(res.every(r => r === true), true)
    })

    it('getRoleAdmin should return admin role for all three roles', async () => {
      const res = await Promise.all([
        erc721.getRoleAdmin.call(ADMIN_ROLE),
        erc721.getRoleAdmin.call(MINTER_ROLE),
        erc721.getRoleAdmin.call(PAUSER_ROLE)
      ])

      assert.strictEqual(res.every(r => r === ADMIN_ROLE), true)
    })

    it('only admin role can grant roles', async () => {
      await erc721.grantRole(MINTER_ROLE, accounts[3], { from: accounts[0] })
      const hasRole = await erc721.hasRole(MINTER_ROLE, accounts[3])
      assert.strictEqual(hasRole, true)

      try {
        await erc721.grantRole(PAUSER_ROLE, accounts[3], { from: accounts[1] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.strictEqual(
          err.message.includes(`AccessControl: account ${accounts[1].toLowerCase()} is missing role ${ADMIN_ROLE}`),
          true
        )
      }
    })

    it('also admin role can be granted', async () => {
      await erc721.grantRole(ADMIN_ROLE, accounts[4], { from: accounts[0] })
      const hasRole = await erc721.hasRole(ADMIN_ROLE, accounts[4])
      assert.strictEqual(hasRole, true)
    })

    it('grantRole should emit RoleGranted event', async () => {
      const res = await erc721.grantRole(PAUSER_ROLE, accounts[3], { from: accounts[0] })
      const txLog = res.logs[0]

      assert.strictEqual(txLog.event, 'RoleGranted')
      assert.strictEqual(txLog.args.role, PAUSER_ROLE)
      assert.strictEqual(txLog.args.account, accounts[3])
      assert.strictEqual(txLog.args.sender, accounts[0])
    })

    it('only admin role can revoke role', async () => {
      await erc721.revokeRole(MINTER_ROLE, accounts[3], { from: accounts[0] })
      const hasRole = await erc721.hasRole(MINTER_ROLE, accounts[3])
      assert.strictEqual(hasRole, false)

      try {
        await erc721.revokeRole(PAUSER_ROLE, accounts[3], { from: accounts[1] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.strictEqual(
          err.message.includes(`AccessControl: account ${accounts[1].toLowerCase()} is missing role ${ADMIN_ROLE}`),
          true
        )
      }
    })

    it('revokeRole should emit RoleRevoked event', async () => {
      const res = await erc721.revokeRole(PAUSER_ROLE, accounts[3], { from: accounts[0] })
      const txLog = res.logs[0]

      assert.strictEqual(txLog.event, 'RoleRevoked')
      assert.strictEqual(txLog.args.role, PAUSER_ROLE)
      assert.strictEqual(txLog.args.account, accounts[3])
      assert.strictEqual(txLog.args.sender, accounts[0])
    })

    it('account can renounce their role', async () => {
      await erc721.grantRole(PAUSER_ROLE, accounts[3], { from: accounts[0] })
      const hasRoleBefore = await erc721.hasRole(PAUSER_ROLE, accounts[3])
      assert.strictEqual(hasRoleBefore, true)

      await erc721.renounceRole(PAUSER_ROLE, accounts[3], { from: accounts[3] })
      const hasRoleAfter = await erc721.hasRole(PAUSER_ROLE, accounts[3])
      assert.strictEqual(hasRoleAfter, false)
    })

    it('renounce should emit RoleRevoked event', async () => {
      await erc721.grantRole(PAUSER_ROLE, accounts[3], { from: accounts[0] })
      const res = await erc721.renounceRole(PAUSER_ROLE, accounts[3], { from: accounts[3] })
      const txLog = res.logs[0]

      assert.strictEqual(txLog.event, 'RoleRevoked')
      assert.strictEqual(txLog.args.role, PAUSER_ROLE)
      assert.strictEqual(txLog.args.account, accounts[3])
      assert.strictEqual(txLog.args.sender, accounts[3])
    })

    it('account can renounce only their role', async () => {
      await erc721.grantRole(PAUSER_ROLE, accounts[3], { from: accounts[0] })

      try {
        await erc721.renounceRole(PAUSER_ROLE, accounts[3], { from: accounts[0] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.strictEqual(
          err.message.includes('AccessControl: can only renounce roles for self'),
          true
        )
      }
    })

    it('granRole could work for any role', async () => {
      const res = await erc721.grantRole(DUMMY_ROLE, accounts[3], { from: accounts[0] })
      const txLog = res.logs[0]

      assert.strictEqual(txLog.event, 'RoleGranted')
      assert.strictEqual(txLog.args.role, DUMMY_ROLE)
      assert.strictEqual(txLog.args.account, accounts[3])
      assert.strictEqual(txLog.args.sender, accounts[0])
    })

    it('role members be enumerable', async () => {
      const minters = [accounts[0], accounts[1]]
      const length = await erc721.getRoleMemberCount.call(MINTER_ROLE)

      for (let index = 0; index < length; index++) {
        const minter = await erc721.getRoleMember(MINTER_ROLE, index)
        assert.strictEqual(minter, minters[index])
      }
    })

    it('token transfer is allowed to any user', async () => {
      await erc721.safeTransferFrom(accounts[0], accounts[1], 1, { from: accounts[0] })
      await erc721.transferFrom(accounts[1], accounts[2], 1, { from: accounts[1] })
      const owner = await erc721.ownerOf.call(1)
      assert.strictEqual(owner, accounts[2])
    })

    it('approval and allowance is allowed to any user', async () => {
      await erc721.approve(accounts[1], 1, { from: accounts[2] })
      await erc721.setApprovalForAll(accounts[1], true, { from: accounts[0] })
    })

    it('mint can be done only by MINTER_ROLE', async () => {
      await erc721.mint(accounts[1], 'ipfs://dragonfly', { from: accounts[0] })
      await erc721.mint(accounts[1], 'ipfs://cheetah', { from: accounts[1] })

      try {
        await erc721.mint(accounts[1], 'ipfs://donkey', { from: accounts[2] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.strictEqual(
          err.message.includes('ThriveCoinERC721Token: must have minter role to mint'),
          true
        )
      }
    })

    it('pause can be done only by PAUSER_ROLE', async () => {
      await erc721.pause({ from: accounts[0] })
      await erc721.unpause({ from: accounts[0] })
      await erc721.pause({ from: accounts[2] })
      await erc721.unpause({ from: accounts[2] })

      try {
        await erc721.pause({ from: accounts[1] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.strictEqual(
          err.message.includes('ThriveCoinERC721Token: must have pauser role to pause'),
          true
        )
      }
    })

    it('unpause can be done only by PAUSER_ROLE', async () => {
      await erc721.pause({ from: accounts[0] })
      await erc721.unpause({ from: accounts[0] })
      await erc721.pause({ from: accounts[2] })

      try {
        await erc721.unpause({ from: accounts[1] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.strictEqual(
          err.message.includes('ThriveCoinERC721Token: must have pauser role to unpause'),
          true
        )
      }
    })
  })
})
