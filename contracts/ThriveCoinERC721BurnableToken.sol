// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "./ThriveCoinERC721Token.sol";

/**
 * @author vigan.abd
 * @title ThriveCoin ERC721 L1/L2 Burnable Token
 *
 * @dev Implementation of the THRIVE ERC721 Burnable Token.
 * THRIVEBURNABLE is a simple ERC721 token that has burning mechanism as
 * additional capability compared to THRIVENFT.
 *
 * Key features:
 * - mint
 * - burn
 * - auto id
 * - uri storage
 * - enumerable
 * - pausable
 * - role management
 */
contract ThriveCoinERC721BurnableToken is ThriveCoinERC721Token {
  /**
   * @dev Grants `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE` and `PAUSER_ROLE` to the
   * account that deploys the contract.
   *
   * @param name - Name of the token that complies with IERC721 interface
   * @param symbol - Symbol of the token that complies with IERC721 interface
   */
  constructor(string memory name, string memory symbol) ThriveCoinERC721Token(name, symbol) {}

  /**
   * @dev Burns `tokenId`. See {ERC721-_burn}.
   *
   * Requirements:
   * - The caller must own `tokenId` or be an approved operator.
   *
   * @param tokenId - Token identifier
   */
  function burn(uint256 tokenId) public virtual {
    require(
      _isApprovedOrOwner(_msgSender(), tokenId),
      "ThriveCoinERC721BurnableToken: caller is not owner nor approved"
    );
    _burn(tokenId);
  }
}
