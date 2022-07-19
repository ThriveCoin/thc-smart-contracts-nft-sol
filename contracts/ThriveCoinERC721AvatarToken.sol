// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "./ThriveCoinERC721Token.sol";

/**
 * @author vigan.abd
 * @title ThriveCoin ERC721 L1/L2 Avatar Token
 *
 * @dev Implementation of the THRIVE ERC721 Avatar Token.
 * THRIVEAVATAR is a simple ERC721 with royalty capabilities. Each token
 * represents an avatar that can also be transfered to some other user.
 *
 * Key features:
 * - mint
 * - royalty
 * - auto id
 * - uri storage
 * - enumerable
 * - pausable
 * - role management
 *
 * NOTE: extends openzeppelin v4.6.0 contracts:
 * https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.6.0/contracts/token/ERC721/extensions/ERC721Royalty.sol
 */
contract ThriveCoinERC721AvatarToken is ThriveCoinERC721Token, ERC721Royalty {
  /**
   * @dev Grants `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE` and `PAUSER_ROLE` to the
   * account that deploys the contract and sets default royalty receiver and
   * basis points percentage
   *
   * @param name - Name of the token that complies with IERC721 interface
   * @param symbol - Symbol of the token that complies with IERC721 interface
   * @param receiver - Default royalty receiver
   * @param feeNumerator - Basis points percentage for default royalty receiver
   */
  constructor(
    string memory name,
    string memory symbol,
    address receiver,
    uint96 feeNumerator
  ) ThriveCoinERC721Token(name, symbol) {
    _setDefaultRoyalty(receiver, feeNumerator);
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
  ) internal virtual override(ERC721, ThriveCoinERC721Token) {
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
  function _burn(uint256 tokenId) internal virtual override(ThriveCoinERC721Token, ERC721Royalty) {
    super._burn(tokenId);
  }

  /**
   * @dev See {ThriveCoinERC721Token-tokenURI}.
   */
  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override(ERC721, ThriveCoinERC721Token)
    returns (string memory)
  {
    return ThriveCoinERC721Token.tokenURI(tokenId);
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ThriveCoinERC721Token, ERC721Royalty)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  /**
   * @dev Changes the default royalty receiver and his percentage.
   *
   * See {ERC721-_safeMint}.
   *
   * Requirements:
   *
   * - the caller must have the `DEFAULT_ADMIN_ROLE`.
   *
   * @param receiver - Default royalty receiver
   * @param feeNumerator - Basis points percentage for default royalty receiver
   */
  function setDefaultRoyalty(address receiver, uint96 feeNumerator) public {
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "ThriveCoinERC721AvatarToken: must have admin role");
    _setDefaultRoyalty(receiver, feeNumerator);
  }

  /**
   * @dev Creates a new token for `to`. Its token ID will be automatically
   * assigned (and available on the emitted {IERC721-Transfer} event), and the token
   * URI will be stored based on call parameter. Additional custom royalty
   * receiver and percentage will be assigned to token.
   *
   * See {ThriveCoinERC721Token-mint}.
   *
   * Requirements:
   *
   * - the caller must have the `MINTER_ROLE`.
   *
   * @param to - The address to whom the token will be minted
   * @param _tokenURI - The Uniform Resource Identifier (URI) for `tokenId` token.
   * @param receiver - Default royalty receiver
   * @param feeNumerator - Basis points percentage for default royalty receiver
   */
  function mint(
    address to,
    string memory _tokenURI,
    address receiver,
    uint96 feeNumerator
  ) public virtual {
    mint(to, _tokenURI);
    uint256 tokenId = totalSupply();
    _setTokenRoyalty(tokenId, receiver, feeNumerator);
  }
}
