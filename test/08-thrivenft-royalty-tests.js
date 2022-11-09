'use strict'

/* eslint-env mocha */

const assert = require('assert')
const { keccak256 } = require('@ethersproject/keccak256')
const ThriveCoinERC721RoyaltyToken = artifacts.require('ThriveCoinERC721RoyaltyToken')

describe('ThriveCoinERC721RoyaltyToken', () => {
  contract('royalty tests', (accounts) => {
    let erc721 = null
    const ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const MINTER_ROLE = keccak256(Buffer.from('MINTER_ROLE', 'utf8'))

    before(async () => {
      erc721 = await ThriveCoinERC721RoyaltyToken.deployed()

      await erc721.grantRole(MINTER_ROLE, accounts[1], { from: accounts[0] })
      await erc721.grantRole(ADMIN_ROLE, accounts[2], { from: accounts[0] })
      await erc721.methods['mint(address,string)'](accounts[0], 'ipfs://dragon', { from: accounts[0] })
    })

    it('supportsInterface should return true when contract supports interface', async () => {
      const res = await erc721.supportsInterface('0x2a55205a') // IERC721 interface id
      assert.ok(res)
    })

    it('royaltyInfo should return default royalty receiver and numerator if not specified for token', async () => {
      const res = await erc721.royaltyInfo(1, '5000000')
      assert.strictEqual(res[0], accounts[0])
      assert.strictEqual(res[1].toNumber(), 50000)
    })

    it('royaltyInfo should return token info when it is set for token', async () => {
      await erc721.methods['mint(address,string,address,uint96)'](
        accounts[2], 'ipfs://koi', accounts[1], '200', { from: accounts[0] }
      )
      const res = await erc721.royaltyInfo(2, '5000000')
      assert.strictEqual(res[0], accounts[1])
      assert.strictEqual(res[1].toNumber(), 100000)
    })

    it('mint should set default royalty for token when not specified', async () => {
      await erc721.methods['mint(address,string)'](
        accounts[2], 'ipfs://dragonfish', { from: accounts[0] }
      )

      const tokenId = 3
      const royalty = await erc721.royaltyInfo(tokenId, '3000000')
      const uri = await erc721.tokenURI(tokenId)

      assert.strictEqual(royalty[0], accounts[0])
      assert.strictEqual(royalty[1].toNumber(), 30000)
      assert.strictEqual(uri, 'ipfs://dragonfish')
    })

    it('mint should set royalty info for token when specified', async () => {
      await erc721.methods['mint(address,string,address,uint96)'](
        accounts[1], 'ipfs://tiger', accounts[1], '300', { from: accounts[0] }
      )

      const tokenId = 4
      const royalty = await erc721.royaltyInfo(tokenId, '3000000')
      const uri = await erc721.tokenURI.call(tokenId)

      assert.strictEqual(royalty[0], accounts[1])
      assert.strictEqual(royalty[1].toNumber(), 90000)
      assert.strictEqual(uri, 'ipfs://tiger')
    })

    it('default royalty info can be changed', async () => {
      const royaltyToken3Before = await erc721.royaltyInfo(3, '3000000')
      const royaltyToken4Before = await erc721.royaltyInfo(4, '3000000')

      assert.strictEqual(royaltyToken3Before[0], accounts[0])
      assert.strictEqual(royaltyToken3Before[1].toNumber(), 30000)

      assert.strictEqual(royaltyToken4Before[0], accounts[1])
      assert.strictEqual(royaltyToken4Before[1].toNumber(), 90000)

      await erc721.setDefaultRoyalty(accounts[3], '200', { from: accounts[0] })
      const royaltyToken3After = await erc721.royaltyInfo(3, '3000000')
      const royaltyToken4After = await erc721.royaltyInfo(4, '3000000')

      assert.strictEqual(royaltyToken3After[0], accounts[3])
      assert.strictEqual(royaltyToken3After[1].toNumber(), 60000)

      assert.strictEqual(royaltyToken4After[0], accounts[1])
      assert.strictEqual(royaltyToken4After[1].toNumber(), 90000)
    })

    it('only admin role can change default royalty', async () => {
      await erc721.setDefaultRoyalty(accounts[1], '60', { from: accounts[2] })

      try {
        await erc721.setDefaultRoyalty(accounts[1], '60', { from: accounts[1] })
        throw new Error('Should not reach here')
      } catch (err) {
        assert.strictEqual(
          err.message.includes('ThriveCoinERC721RoyaltyToken: must have admin role'),
          true
        )
      }
    })
  })
})
