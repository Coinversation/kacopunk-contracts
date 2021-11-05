// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.3.2 (token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol)
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Kasiar is
  Context,
  AccessControlEnumerable,
  ERC721Enumerable,
  ERC721Burnable,
  ERC721Pausable
{
  using Counters for Counters.Counter;
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  mapping(uint256 => uint256) public tokenIdKeyMap;
  mapping(uint256 => uint256) public tokenRomdomKeyMap;

  uint256 private SSS = 2;
  uint256 private SS = 16;
  uint256 private S = 64;
  uint256 private A = 2918;
  uint256 private total = 3000;
  //
  uint256[] public NFT_SSS;
  uint256[] public NFT_SS;
  uint256[] public NFT_S;
  uint256[] public NFT_A;

  Counters.Counter private _tokenIdTracker;

  string private _baseTokenURI;

  constructor()
    //  string memory name,
    // string memory symbol,
    // string memory baseTokenURI
    ERC721("name", "symbol")
  {
    _baseTokenURI = "baseTokenURI";

    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }

  function mint(address to) public virtual {
    require(
      hasRole(MINTER_ROLE, _msgSender()),
      "ERC721PresetMinterPauserAutoId: must have minter role to mint"
    );
    uint256 R = _random(__random());

    if (R < SSS && NFT_SSS.length < SSS) {
      NFT_SSS.push(R);
    } else if (R < SS && NFT_SS.length < SS) {
      NFT_SS[NFT_SS.length] = R;
    } else if (R < S && NFT_SS.length < S) {
      NFT_S.push(R);
    } else {
      NFT_A.push(R);
    }
    tokenIdKeyMap[_tokenIdTracker.current()] = R;
    tokenRomdomKeyMap[R] = _tokenIdTracker.current();

    _mint(to, R);
    _tokenIdTracker.increment();
  }

  function _random(uint256 _r) public view returns (uint256) {
    if (_exists(tokenRomdomKeyMap[_r])) {
      _random(_r + 1);
    }
    return _r;
  }

  function __random() private view returns (uint256) {
    return
      uint256(
        keccak256(
          abi.encodePacked(
            block.difficulty,
            block.timestamp,
            _tokenIdTracker.current()
          )
        )
      ) % total;
  }

  function tokenURI(uint256 _tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(_exists(tokenIdKeyMap[_tokenId]), "token is not mint");
    return
      string(
        abi.encodePacked(_baseTokenURI, uint2str(tokenIdKeyMap[_tokenId]))
      );
  }

  function uint2str(uint256 _i)
    internal
    pure
    returns (string memory _uintAsString)
  {
    if (_i == 0) {
      return "0";
    }
    uint256 j = _i;
    uint256 len;
    while (j != 0) {
      len++;
      j /= 10;
    }
    bytes memory bstr = new bytes(len);
    uint256 k = len;
    while (_i != 0) {
      k = k - 1;
      uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
      bytes1 b1 = bytes1(temp);
      bstr[k] = b1;
      _i /= 10;
    }
    return string(bstr);
  }

  function xtokenURI(uint256 _tokenId) public view returns (uint256) {
    return tokenIdKeyMap[_tokenId];
  }

  function pause() public virtual {
    require(
      hasRole(PAUSER_ROLE, _msgSender()),
      "ERC721PresetMinterPauserAutoId: must have pauser role to pause"
    );
    _pause();
  }

  function unpasuse() public virtual {
    require(
      hasRole(PAUSER_ROLE, _msgSender()),
      "ERC721PresetMinterPauserAutoId: must have pauser role to unpause"
    );
    _unpause();
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable, ERC721Pausable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

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
