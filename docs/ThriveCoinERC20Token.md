# ThriveCoinERC721Token - ThriveCoin L1 ThriveCoin ERC721 L1/L2 Token (ThriveCoinERC721Token.sol)

**View Source:** [contracts/ThriveCoinERC721Token.sol](../contracts/ThriveCoinERC721Token.sol)

**Extends ↗:** [AccessControlEnumerable (openzeppelin@4.6.0)](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.6.0/contracts/access/AccessControlEnumerable.sol),
[ERC721Enumerable (openzeppelin@4.6.0)](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.6.0/contracts/token/ERC721/extensions/ERC721Enumerable.sol)
[ERC721Pausable (openzeppelin@4.6.0)](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.6.0/contracts/token/ERC721/extensions/ERC721Pausable.sol)
[ERC721URIStorage (openzeppelin@4.6.0)](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.6.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol)


**Author:** vigan.abd

**Description**: Implementation of the THRIVE ERC721 Token.
THRIVENFT is a simple ERC721 token that links a content stored in custom URI
to a transferable non-fungible token.

Key features:
- mint
- auto id
- uri storage
- enumerable
- pausable
- role management

## Contract Constants
- `MINTER_ROLE<bytes32>` - Minter role hash identifier (keccak256("MINTER_ROLE")) 
- `PAUSER_ROLE<bytes32>` - Pauser role hash identifier (keccak256("PAUSER_ROLE")) 

## Contract Members
- `_tokenIdTracker<Counters.Counter>` - Private id auto increment property

## Contract Methods
- [constructor(string memory name, string memory symbol)](#constructor)
- [_beforeTokenTransfer(address from, address to, uint256 tokenId)](#_beforeTokenTransfer)
- [_burn(uint256 tokenId)](#_burn)
- [mint(address to, string memory _tokenURI)](#mint)
- [tokenURI(uint256 tokenId)](#tokenURI)
- [pause()](#pause)
- [unpause()](#unpause)
- [supportsInterface(bytes4 interfaceId)](#supportsInterface)

### constructor
Grants `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE` and `PAUSER_ROLE` to the account that
deploys the contract.
```solidity
constructor(string memory name, string memory symbol) ERC721(name, symbol)
```

**Arguments**
- `name<string>` - Name of the token that complies with IERC721 interface
- `symbol<string>` - Symbol of the token that complies with IERC721 interface

**Returns**
- `void` 

### _beforeTokenTransfer
```solidity
function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721, ERC721Enumerable, ERC721Pausable)
```

**Arguments**
- `from<address>` - The address from where the token will be taken
- `to<address>` - The address to whom the token will be transferred
- `tokenId<uint256>` - Token identifier

**Returns**
- `void` 

### _burn
Destroys `tokenId`.
The approval is cleared when the token is burned.

Requirements:
- `tokenId` must exist.

Emits a {Transfer} event.

```solidity
function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage)
```

**Arguments**
- None

**Returns**
- `void` 

### mint
Creates a new token for `to`. Its token ID will be automatically
assigned (and available on the emitted {IERC721-Transfer} event), and the token
URI will be stored based on call parameter.

See {ERC721-_safeMint}.

Requirements:
- the caller must have the `MINTER_ROLE`.

```solidity
function mint(address to, string memory _tokenURI) public virtual
```

**Arguments**
- `to<address>` - The address to whom the token will be minted
- `_tokenURI<string>` - The Uniform Resource Identifier (URI) for `tokenId` token.

**Returns**
- `void` 

### tokenURI
See {ERC721URIStorage-tokenURI}.
```solidity
function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory)
```

**Arguments**
- `tokenId<uint256>` - Token identifier

**Returns**
- `string` 

### pause
Pauses all token transfers.

See {ERC721Pausable} and {Pausable-_pause}.

Requirements:
- the caller must have the `PAUSER_ROLE`.

```solidity
function pause() public virtual
```

**Arguments**
- None

**Returns**
- `void` 

### unpause
Unpauses all token transfers.

See {ERC721Pausable} and {Pausable-_unpause}.

Requirements:
- the caller must have the `PAUSER_ROLE`.

```solidity
function unpause() public virtual
```

**Arguments**
- None

**Returns**
- `void` 

### supportsInterface

Unpauses all token transfers.

See {ERC721Pausable} and {Pausable-_unpause}.

Requirements:
- the caller must have the `PAUSER_ROLE`.

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControlEnumerable, ERC721, ERC721Enumerable) returns (bool)
```

**Arguments**
- `interfaceId<bytes4>`

**Returns**
- `bool` 
