# ThriveCoinERC721BurnableToken - ThriveCoin ERC721 L1/L2 Burnable Token (ThriveCoinERC721BurnableToken.sol)

**View Source:** [contracts/ThriveCoinERC721BurnableToken.sol](../contracts/ThriveCoinERC721BurnableToken.sol)

**Extends ↗:** [ThriveCoinERC721Token](../contracts/ThriveCoinERC721Token.sol)

**Author:** vigan.abd

**Description**: Implementation of the THRIVE ERC721 Burnable Token.
THRIVEBURNABLE is a simple ERC721 token that has burning mechanism as
additional capability compared to THRIVENFT.

Key features:
- mint
- burn
- auto id
- uri storage
- enumerable
- pausable
- role management

## Contract Methods
- [constructor(string memory name, string memory symbol)](#constructor)
- [burn(uint256 tokenId)](#burn)

### constructor
Grants `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE` and `PAUSER_ROLE` to the account that
deploys the contract.
```solidity
constructor(string memory name, string memory symbol) ThriveCoinERC721Token(name, symbol)
```

**Arguments**
- `name<string>` - Name of the token that complies with IERC721 interface
- `symbol<string>` - Symbol of the token that complies with IERC721 interface

**Returns**
- `void` 

### burn
Burns `tokenId`. See {ERC721-_burn}.

Requirements:
- The caller must own `tokenId` or be an approved operator.
```solidity
function burn(uint256 tokenId) public virtual
```

**Arguments**
- `tokenId<uint256>` - Token identifier

**Returns**
- `void`
