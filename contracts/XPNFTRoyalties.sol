// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7; 

import "./BridgeNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract XPNftRoyalties is Ownable, ERC721Enumerable, BridgeNFT, ERC2981, AccessControl {
	struct SetRoyalty {
		address receiver;
		uint96 feeNumerator; // 10000 == 100%
	}

    string public baseUri;
	bytes32 public constant BASE_URI_ADMIN = keccak256("BASE_URI_ADMIN");

    // WARN: baseURI_ MUST be "/" suffixed
	constructor(
		string memory name_,
		string memory symbol_,
		string memory baseURI_,
		SetRoyalty memory setRoyaltyInfo
	) ERC721(name_, symbol_) {
        baseUri = baseURI_;
		_grantRole(BASE_URI_ADMIN, msg.sender);
		if (setRoyaltyInfo.receiver != address(0)) {
			_setDefaultRoyalty(setRoyaltyInfo.receiver, setRoyaltyInfo.feeNumerator);
		}
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, ERC2981, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

	function mint(address to, uint256 id, bytes calldata rawInfo) override external onlyOwner {
		if (rawInfo.length != 0) {
			SetRoyalty memory setRoyaltyInfo = abi.decode(rawInfo, (SetRoyalty));
			if (setRoyaltyInfo.receiver != address(0)) {
				_setTokenRoyalty(id, setRoyaltyInfo.receiver, setRoyaltyInfo.feeNumerator);
			}
		}


		_safeMint(to, id);
	}

    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);
        _resetTokenRoyalty(tokenId);
    }

    function burnZerro() external {
        require(ownerOf(0) == msg.sender, "You don't own this nft!");
        _burn(0);
    }

	function burnFor(address from, uint256 id) override external onlyOwner {
        require(ownerOf(id) == from, "You don't own this nft!");
		_burn(id);
	}

    function _baseURI() internal view override returns (string memory) {
        return baseUri;
    }

    function baseURI() override external view returns (string memory)  {
        return baseUri;
    }

	function updateBaseURI(string memory newBaseUri) external onlyRole(BASE_URI_ADMIN) {

		bytes memory isEmptyString = bytes(newBaseUri);

		require(isEmptyString.length != 0, 
			"Empty string cannot be the baseUri"
		);

		require(stringToBytes32(baseUri) != stringToBytes32(newBaseUri),
			"This baseUri is already set"
		);

		baseUri = newBaseUri;
	}

	function stringToBytes32(string memory str) internal pure returns (bytes32){
		return keccak256(abi.encodePacked(str));
	}
}