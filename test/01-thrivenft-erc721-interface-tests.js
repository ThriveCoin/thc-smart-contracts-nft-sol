'use strict'

/* eslint-env mocha */

const assert = require('assert')
const ThriveCoinERC721Token = artifacts.require('ThriveCoinERC721Token')
const ERC721HolderTest = artifacts.require('ERC721HolderTest')
const Migrations = artifacts.require('Migrations')
const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

describe('ThriveCoinERC721Token', () => {
  contract('erc721 interface tests', (accounts) => {
    let erc721 = null; let erc721holder = null; let migrations = null

    before(async () => {
      erc721 = await ThriveCoinERC721Token.deployed()
      erc721holder = await ERC721HolderTest.deployed()
      migrations = await Migrations.deployed()

      await erc721.mint(accounts[0], 'ipfs://panda', { from: accounts[0] })
      await erc721.mint(accounts[0], 'ipfs://bear', { from: accounts[0] })
      await erc721.mint(accounts[0], 'ipfs://lion', { from: accounts[0] })
      await erc721.mint(accounts[3], 'ipfs://dragon', { from: accounts[0] })
      await erc721.mint(accounts[3], 'ipfs://puma', { from: accounts[0] })
    })

    it('token info params should be accessible', async () => {
      const name = await erc721.name.call()
      const symbol = await erc721.symbol.call()

      assert.strictEqual(name, 'ThriveCoinNFT')
      assert.strictEqual(symbol, 'THRIVENFT')
    })

    it('balanceOf should return expected balances', async () => {
      const acc0Bal = await erc721.balanceOf.call(accounts[0])
      const acc1Bal = await erc721.balanceOf.call(accounts[1])

      assert.strictEqual(acc0Bal.toNumber(), 3)
      assert.strictEqual(acc1Bal.toNumber(), 0)
    })

    it('balanceOf should throw when zero address is provided', async () => {
      try {
        await erc721.balanceOf(ADDRESS_ZERO)
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: balance query for the zero address'))
      }
    })

    it('ownerOf should return true when token belongs to account', async () => {
      const res = await erc721.ownerOf.call(1)
      assert.strictEqual(res, accounts[0])
    })

    it('ownerOf should throw when token does not exist', async () => {
      try {
        await erc721.ownerOf.call(50)
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: owner query for nonexistent token'))
      }
    })

    it('safeTransferFrom should transfer token from owner to destination and update token counts for accounts', async () => {
      const beforeAcc0Bal = await erc721.balanceOf.call(accounts[0])
      const beforeAcc1Bal = await erc721.balanceOf.call(accounts[1])
      const beforeOwner = await erc721.ownerOf.call(1)

      await erc721.safeTransferFrom(accounts[0], accounts[1], 1, Buffer.from([0x0]))

      const afterOwner = await erc721.ownerOf.call(1)
      const afterAcc0Bal = await erc721.balanceOf.call(accounts[0])
      const afterAcc1Bal = await erc721.balanceOf.call(accounts[1])

      assert.strictEqual(beforeAcc0Bal.toNumber(), 3)
      assert.strictEqual(beforeAcc1Bal.toNumber(), 0)
      assert.strictEqual(beforeOwner, accounts[0])
      assert.strictEqual(afterOwner, accounts[1])
      assert.strictEqual(afterAcc0Bal.toNumber(), 2)
      assert.strictEqual(afterAcc1Bal.toNumber(), 1)
    })

    it('safeTransferFrom should work without data param', async () => {
      const beforeOwner = await erc721.ownerOf.call(1)
      await erc721.safeTransferFrom(accounts[1], accounts[0], 1, { from: accounts[1] })
      const afterOwner = await erc721.ownerOf.call(1)

      assert.strictEqual(beforeOwner, accounts[1])
      assert.strictEqual(afterOwner, accounts[0])
    })

    it('safeTransferFrom should work when token is approved to be sent', async () => {
      const beforeOwner = await erc721.ownerOf.call(1)
      await erc721.approve(accounts[1], 1, { from: accounts[0] })
      await erc721.safeTransferFrom(accounts[0], accounts[1], 1, { from: accounts[1] })
      const afterOwner = await erc721.ownerOf.call(1)

      assert.strictEqual(beforeOwner, accounts[0])
      assert.strictEqual(afterOwner, accounts[1])
    })

    it('safeTransferFrom should work when token is approved to be sent for all', async () => {
      const beforeOwner = await erc721.ownerOf.call(1)
      await erc721.setApprovalForAll(accounts[2], true, { from: accounts[1] })
      await erc721.safeTransferFrom(accounts[1], accounts[2], 1, { from: accounts[2] })
      const afterOwner = await erc721.ownerOf.call(1)

      assert.strictEqual(beforeOwner, accounts[1])
      assert.strictEqual(afterOwner, accounts[2])
    })

    it('safeTransferFrom can send token to other destination beside the caller', async () => {
      const beforeOwner = await erc721.ownerOf.call(2)
      await erc721.approve(accounts[1], 2, { from: accounts[0] })
      await erc721.safeTransferFrom(accounts[0], accounts[2], 2, { from: accounts[1] })
      const afterOwner = await erc721.ownerOf.call(2)

      assert.strictEqual(beforeOwner, accounts[0])
      assert.strictEqual(afterOwner, accounts[2])
    })

    it('safeTransferFrom can send token to ERC721Receiver implementer contract', async () => {
      const beforeOwner = await erc721.ownerOf.call(2)
      await erc721.safeTransferFrom(accounts[2], erc721holder.address, 2, { from: accounts[2] })
      const afterOwner = await erc721.ownerOf.call(2)

      assert.strictEqual(beforeOwner, accounts[2])
      assert.strictEqual(afterOwner, erc721holder.address)
    })

    it('safeTransferFrom should emit transfer and approve events', async () => {
      const res = await erc721.safeTransferFrom(accounts[2], accounts[1], 1, { from: accounts[2] })
      const approveLog = res.logs[0]
      const transferLog = res.logs[1]

      assert.strictEqual(approveLog.event, 'Approval')
      assert.strictEqual(approveLog.args.owner, accounts[2])
      assert.strictEqual(approveLog.args.approved, ADDRESS_ZERO)
      assert.strictEqual(approveLog.args.tokenId.toNumber(), 1)

      assert.strictEqual(transferLog.event, 'Transfer')
      assert.strictEqual(transferLog.args.from, accounts[2])
      assert.strictEqual(transferLog.args.to, accounts[1])
      assert.strictEqual(transferLog.args.tokenId.toNumber(), 1)
    })

    it('safeTransferFrom should fail when caller is not owner or approved', async () => {
      try {
        await erc721.setApprovalForAll(accounts[2], false, { from: accounts[1] })
        await erc721.safeTransferFrom(accounts[1], accounts[2], 1, { from: accounts[2] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: transfer caller is not owner nor approved'))
      }
    })

    it('safeTransferFrom should fail when from is not owner', async () => {
      try {
        await erc721.safeTransferFrom(accounts[2], accounts[1], 1, { from: accounts[1] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: transfer from incorrect owner'))
      }
    })

    it('safeTransferFrom should fail when to is zero address', async () => {
      try {
        await erc721.safeTransferFrom(accounts[1], ADDRESS_ZERO, 1, { from: accounts[1] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: transfer to the zero address'))
      }
    })

    it('safeTransferFrom should fail when to is not ERC721Receiver implementer contract', async () => {
      let error
      try {
        await erc721.safeTransferFrom(accounts[1], migrations.address, 1, { from: accounts[1] })
      } catch (err) {
        error = err
      }

      assert.ok(error instanceof Error)
    })

    it('safeTransferFrom should fail when token does not exist', async () => {
      try {
        await erc721.safeTransferFrom(accounts[1], accounts[0], 20, { from: accounts[1] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: operator query for nonexistent token'))
      }
    })

    it('transferFrom should transfer token from owner to destination and update token counts for accounts', async () => {
      const beforeAcc0Bal = await erc721.balanceOf.call(accounts[0])
      const beforeAcc1Bal = await erc721.balanceOf.call(accounts[1])
      const beforeOwner = await erc721.ownerOf.call(1)

      await erc721.transferFrom(accounts[1], accounts[0], 1, { from: accounts[1] })

      const afterOwner = await erc721.ownerOf.call(1)
      const afterAcc0Bal = await erc721.balanceOf.call(accounts[0])
      const afterAcc1Bal = await erc721.balanceOf.call(accounts[1])

      assert.strictEqual(beforeAcc0Bal.toNumber(), 1)
      assert.strictEqual(beforeAcc1Bal.toNumber(), 1)
      assert.strictEqual(beforeOwner, accounts[1])
      assert.strictEqual(afterOwner, accounts[0])
      assert.strictEqual(afterAcc0Bal.toNumber(), 2)
      assert.strictEqual(afterAcc1Bal.toNumber(), 0)
    })

    it('transferFrom should work when token is approved to be sent', async () => {
      const beforeOwner = await erc721.ownerOf.call(1)
      await erc721.approve(accounts[1], 1, { from: accounts[0] })
      await erc721.transferFrom(accounts[0], accounts[1], 1, { from: accounts[1] })
      const afterOwner = await erc721.ownerOf.call(1)

      assert.strictEqual(beforeOwner, accounts[0])
      assert.strictEqual(afterOwner, accounts[1])
    })

    it('transferFrom should work when token is approved to be sent for all', async () => {
      const beforeOwner = await erc721.ownerOf.call(1)
      await erc721.setApprovalForAll(accounts[2], true, { from: accounts[1] })
      await erc721.transferFrom(accounts[1], accounts[2], 1, { from: accounts[2] })
      const afterOwner = await erc721.ownerOf.call(1)

      assert.strictEqual(beforeOwner, accounts[1])
      assert.strictEqual(afterOwner, accounts[2])
    })

    it('transferFrom can send token to other destination beside the caller', async () => {
      const beforeOwner = await erc721.ownerOf.call(3)
      await erc721.approve(accounts[1], 3, { from: accounts[0] })
      await erc721.transferFrom(accounts[0], accounts[2], 3, { from: accounts[1] })
      const afterOwner = await erc721.ownerOf.call(3)

      assert.strictEqual(beforeOwner, accounts[0])
      assert.strictEqual(afterOwner, accounts[2])
    })

    it('transferFrom can send token to ERC721Receiver implementer contract', async () => {
      const beforeOwner = await erc721.ownerOf.call(3)
      await erc721.transferFrom(accounts[2], erc721holder.address, 3, { from: accounts[2] })
      const afterOwner = await erc721.ownerOf.call(3)

      assert.strictEqual(beforeOwner, accounts[2])
      assert.strictEqual(afterOwner, erc721holder.address)
    })

    it('transferFrom should emit transfer and approve events', async () => {
      const res = await erc721.transferFrom(accounts[2], accounts[1], 1, { from: accounts[2] })
      const approveLog = res.logs[0]
      const transferLog = res.logs[1]

      assert.strictEqual(approveLog.event, 'Approval')
      assert.strictEqual(approveLog.args.owner, accounts[2])
      assert.strictEqual(approveLog.args.approved, ADDRESS_ZERO)
      assert.strictEqual(approveLog.args.tokenId.toNumber(), 1)

      assert.strictEqual(transferLog.event, 'Transfer')
      assert.strictEqual(transferLog.args.from, accounts[2])
      assert.strictEqual(transferLog.args.to, accounts[1])
      assert.strictEqual(transferLog.args.tokenId.toNumber(), 1)
    })

    it('transferFrom should work when to is not ERC721Receiver implementer contract', async () => {
      const beforeOwner = await erc721.ownerOf.call(4)
      await erc721.transferFrom(accounts[3], migrations.address, 4, { from: accounts[3] })
      const afterOwner = await erc721.ownerOf.call(4)

      assert.strictEqual(beforeOwner, accounts[3])
      assert.strictEqual(afterOwner, migrations.address)
    })

    it('transferFrom should fail when caller is not owner or approved', async () => {
      try {
        await erc721.setApprovalForAll(accounts[2], false, { from: accounts[1] })
        await erc721.transferFrom(accounts[1], accounts[2], 1, { from: accounts[2] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: transfer caller is not owner nor approved'))
      }
    })

    it('transferFrom should fail when from is not owner', async () => {
      try {
        await erc721.transferFrom(accounts[2], accounts[1], 1, { from: accounts[1] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: transfer from incorrect owner'))
      }
    })

    it('transferFrom should fail when to is zero address', async () => {
      try {
        await erc721.transferFrom(accounts[1], ADDRESS_ZERO, 1, { from: accounts[1] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: transfer to the zero address'))
      }
    })

    it('transferFrom should fail when token does not exist', async () => {
      try {
        await erc721.transferFrom(accounts[1], accounts[0], 20, { from: accounts[1] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: operator query for nonexistent token'))
      }
    })

    it('approve should approve transfer of token to account', async () => {
      const beforeApprove = await erc721.getApproved.call(1)
      await erc721.approve(accounts[0], 1, { from: accounts[1] })
      const afterApprove = await erc721.getApproved.call(1)

      assert.strictEqual(beforeApprove, ADDRESS_ZERO)
      assert.strictEqual(afterApprove, accounts[0])
    })

    it('approve should approve transfer of token to account also if caller is operational account', async () => {
      const beforeApprove = await erc721.getApproved.call(1)
      await erc721.setApprovalForAll(accounts[2], true, { from: accounts[1] })
      await erc721.approve(accounts[3], 1, { from: accounts[2] })
      const afterApprove = await erc721.getApproved.call(1)

      assert.strictEqual(beforeApprove, accounts[0])
      assert.strictEqual(afterApprove, accounts[3])
    })

    it('approve should work with zero address as dest', async () => {
      const beforeApprove = await erc721.getApproved.call(1)
      await erc721.approve(ADDRESS_ZERO, 1, { from: accounts[1] })
      const afterApprove = await erc721.getApproved.call(1)

      assert.strictEqual(beforeApprove, accounts[3])
      assert.strictEqual(afterApprove, ADDRESS_ZERO)
    })

    it('approve should emit approval event', async () => {
      const res = await erc721.approve(accounts[0], 1, { from: accounts[1] })
      const approveLog = res.logs[0]

      assert.strictEqual(approveLog.event, 'Approval')
      assert.strictEqual(approveLog.args.owner, accounts[1])
      assert.strictEqual(approveLog.args.approved, accounts[0])
      assert.strictEqual(approveLog.args.tokenId.toNumber(), 1)
    })

    it('approve should fail when token does not exist', async () => {
      try {
        await erc721.approve(accounts[0], 20, { from: accounts[1] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: owner query for nonexistent token'))
      }
    })

    it('approve should fail when owner and to are same address', async () => {
      try {
        await erc721.approve(accounts[1], 1, { from: accounts[1] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: approval to current owner'))
      }
    })

    it('approve should fail when caller is not owner or approved for all', async () => {
      try {
        await erc721.approve(accounts[2], 1, { from: accounts[3] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: approve caller is not owner nor approved for all'))
      }
    })

    it('setApprovalForAll should set approval flag for account as operator', async () => {
      const beforeApprovalForAll = await erc721.isApprovedForAll.call(accounts[0], accounts[1])
      await erc721.setApprovalForAll(accounts[1], true, { from: accounts[0] })
      const afterApprovalForAll = await erc721.isApprovedForAll.call(accounts[0], accounts[1])

      assert.strictEqual(beforeApprovalForAll, false)
      assert.strictEqual(afterApprovalForAll, true)
    })

    it('setApprovalForAll should work with false flag as well', async () => {
      const beforeApprovalForAll = await erc721.isApprovedForAll.call(accounts[0], accounts[1])
      await erc721.setApprovalForAll(accounts[1], false, { from: accounts[0] })
      const afterApprovalForAll = await erc721.isApprovedForAll.call(accounts[0], accounts[1])

      assert.strictEqual(beforeApprovalForAll, true)
      assert.strictEqual(afterApprovalForAll, false)
    })

    it('setApprovalForAll should emit ApprovalForAll event', async () => {
      const res = await erc721.setApprovalForAll(accounts[1], true, { from: accounts[0] })

      const approveLog = res.logs[0]

      assert.strictEqual(approveLog.event, 'ApprovalForAll')
      assert.strictEqual(approveLog.args.owner, accounts[0])
      assert.strictEqual(approveLog.args.operator, accounts[1])
      assert.strictEqual(approveLog.args.approved, true)
    })

    it('getApproved should return zero address by default', async () => {
      const res = await erc721.getApproved.call(5)
      assert.strictEqual(res, ADDRESS_ZERO)
    })

    it('getApproved should return approved address when entry exists', async () => {
      const res = await erc721.getApproved.call(1)
      assert.strictEqual(res, accounts[0])
    })

    it('getApproved should fail when token does not exist', async () => {
      try {
        await erc721.getApproved.call(20)
        throw new Error('Should not reach here')
      } catch (err) {
        assert.ok(err.message.includes('ERC721: approved query for nonexistent token'))
      }
    })

    it('isApprovedForAll should return false by default', async () => {
      const res = await erc721.isApprovedForAll.call(accounts[0], accounts[3])
      assert.strictEqual(res, false)
    })

    it('isApprovedForAll should return flag when entry exists', async () => {
      const res = await erc721.isApprovedForAll.call(accounts[0], accounts[1])
      assert.strictEqual(res, true)
    })

    it('supportsInterface should return true when contract supports interface', async () => {
      const res = await erc721.supportsInterface('0x80ac58cd') // IERC721 interface id
      assert.ok(res)
    })
  })
})
