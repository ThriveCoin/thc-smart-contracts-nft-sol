# ThriveCoinERC721RoyaltyToken - ThriveCoin ERC721 L1/L2 Royalty Token (ThriveCoinERC721RoyaltyToken.sol)

**View Source:** [contracts/ThriveCoinERC721RoyaltyToken.sol](../contracts/ThriveCoinERC721RoyaltyToken.sol)

**Extends ↗:**  [ERC721Royalty (openzeppelin@4.6.0)](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.6.0/contracts/token/ERC721/extensions/ERC721Royalty.sol),
[ThriveCoinERC721Token](../contracts/ThriveCoinERC721Token.sol)

**Author:** vigan.abd

**Description**: Implementation of the THRIVE ERC721 Royalty Token.
THRIVEROYALTY is a simple ERC721 with royalty capabilities. Each token
represents an nft that can also be transfered to some other user.

Key features:
- mint
- royalty
- auto id
- uri storage
- enumerable
- pausable
- role management

## Contract Methods
- [constructor(string memory name, string memory symbol, address receiver, uint96 feeNumerator)](#constructor)
- [_beforeTokenTransfer(address from, address to, uint256 tokenId)](#_beforeTokenTransfer)
- [_burn(uint256 tokenId)](#_burn)
- [tokenURI(uint256 tokenId)](#tokenURI)
- [supportsInterface(bytes4 interfaceId)](#supportsInterface)
- [setDefaultRoyalty(address receiver, uint96 feeNumerator)](#setdefaultroyalty)
- [mint(address to, string memory _tokenURI)](#mint)

### constructor
Grants `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE` and `PAUSER_ROLE` to the
account that deploys the contract and sets default royalty receiver and
basis points percentage
```solidity
constructor(string memory name, string memory symbol, address receiver, uint96 feeNumerator) ThriveCoinERC721Token(name, symbol)
```

**Arguments**
- `name<string>` - Name of the token that complies with IERC721 interface
- `symbol<string>` - Symbol of the token that complies with IERC721 interface
- `receiver<address>` - Default royalty receiver
- `feeNumerator<uint96>` - Basis points percentage for default royalty receiver

**Returns**
- `void` 

### _beforeTokenTransfer
```solidity
function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721, ThriveCoinERC721Token)
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
function _burn(uint256 tokenId) internal virtual override(ThriveCoinERC721Token, ERC721Royalty)
```

**Arguments**
- None

**Returns**
- `void`

### tokenURI
See {ThriveCoinERC721Token-tokenURI}.
```solidity
function tokenURI(uint256 tokenId) public view virtual override(ERC721, ThriveCoinERC721Token) returns (string memory)
```

**Arguments**
- `tokenId<uint256>` - Token identifier

**Returns**
- `string` 

### supportsInterface
See {IERC165-supportsInterface}.
```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(ThriveCoinERC721Token, ERC721Royalty) returns (bool)
```

**Arguments**
- `interfaceId<bytes4>`

**Returns**
- `bool`

### setDefaultRoyalty
Changes the default royalty receiver and his percentage.

See {ERC721-_safeMint}.

Requirements:

- the caller must have the `DEFAULT_ADMIN_ROLE`.

```solidity
function setDefaultRoyalty(address receiver, uint96 feeNumerator) public
```

**Arguments**
- `receiver<address>` - Default royalty receiver
- `feeNumerator<uint96>` - Basis points percentage for default royalty receiver

**Returns**
- `bool`

### mint
Creates a new token for `to`. Its token ID will be automatically
assigned (and available on the emitted {IERC721-Transfer} event), and the token
URI will be stored based on call parameter. Additional custom royalty
receiver and percentage will be assigned to token.

See {ThriveCoinERC721Token-mint}.

Requirements:
- the caller must have the `MINTER_ROLE`.

```solidity
function mint(address to, string memory _tokenURI, address receiver, uint96 feeNumerator) public virtual
```

**Arguments**
- `to<address>` - The address to whom the token will be minted
- `_tokenURI<string>` - The Uniform Resource Identifier (URI) for `tokenId` token.
- `receiver<address>` - Default royalty receiver
- `feeNumerator<uint96>` - Basis points percentage for default royalty receiver

**Returns**
- `void` 
