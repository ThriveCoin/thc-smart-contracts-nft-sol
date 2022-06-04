// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @author vigan.abd
 * @title ThriveCoin ERC721 L1/L2 Token
 *
 * @dev Implementation of the THRIVE ERC721 Token.
 * THRIVENFT is a simple ERC721 token that links a content stored in custom URI
 * to a transferable non-fungible token.
 *
 * Key features:
 * - mint
 * - auto id
 * - uri storage
 * - enumerable
 * - pausable
 * - role management
 *
 * NOTE: extends openzeppelin v4.6.0 contracts:
 * https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.6.0/contracts/access/AccessControlEnumerable.sol
 * https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.6.0/contracts/token/ERC721/extensions/ERC721Enumerable.sol
 * https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.6.0/contracts/token/ERC721/extensions/ERC721Pausable.sol
 * https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.6.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol
 */
contract ThriveCoinERC721Token is AccessControlEnumerable, ERC721Enumerable, ERC721Pausable, ERC721URIStorage {
  using Counters for Counters.Counter;

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  Counters.Counter private _tokenIdTracker;

  /**
   * @dev Grants `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE` and `PAUSER_ROLE` to the
   * account that deploys the contract.
   *
   * @param name - Name of the token that complies with IERC721 interface
   * @param symbol - Symbol of the token that complies with IERC721 interface
   */
  constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());

    _tokenIdTracker.increment(); // start id from 1 and not 0
  }

  /**
   * @param from - The address from where the token will be taken
   * @param to - The address to whom the token will be transferred
   * @param tokenId - Token identifier
   */
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable, ERC721Pausable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  /**
   * @dev Destroys `tokenId`.
   * The approval is cleared when the token is burned.
   *
   * Requirements:
   *
   * - `tokenId` must exist.
   *
   * Emits a {Transfer} event.
   */
  function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  /**
   * @dev Creates a new token for `to`. Its token ID will be automatically
   * assigned (and available on the emitted {IERC721-Transfer} event), and the token
   * URI will be stored based on call parameter.
   *
   * See {ERC721-_safeMint}.
   *
   * Requirements:
   *
   * - the caller must have the `MINTER_ROLE`.
   *
   * @param to - The address to whom the token will be minted
   * @param _tokenURI - The Uniform Resource Identifier (URI) for `tokenId` token.
   */
  function mint(address to, string memory _tokenURI) public virtual {
    require(hasRole(MINTER_ROLE, _msgSender()), "ThriveCoinERC721Token: must have minter role to mint");

    uint256 tokenId = _tokenIdTracker.current();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, _tokenURI);
    _tokenIdTracker.increment();
  }

  /**
   * @dev See {ERC721URIStorage-tokenURI}.
   */
  function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
    return ERC721URIStorage.tokenURI(tokenId);
  }

  /**
   * @dev Pauses all token transfers.
   *
   * See {ERC721Pausable} and {Pausable-_pause}.
   *
   * Requirements:
   *
   * - the caller must have the `PAUSER_ROLE`.
   */
  function pause() public virtual {
    require(hasRole(PAUSER_ROLE, _msgSender()), "ThriveCoinERC721Token: must have pauser role to pause");
    _pause();
  }

  /**
   * @dev Unpauses all token transfers.
   *
   * See {ERC721Pausable} and {Pausable-_unpause}.
   *
   * Requirements:
   *
   * - the caller must have the `PAUSER_ROLE`.
   */
  function unpause() public virtual {
    require(hasRole(PAUSER_ROLE, _msgSender()), "ThriveCoinERC721Token: must have pauser role to unpause");
    _unpause();
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControlEnumerable, ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
