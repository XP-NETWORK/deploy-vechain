// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; 

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "./BridgeNFTBatch.sol";

contract XPNft1155Royalties is ERC1155, Ownable, BridgeNFTBatch, ERC2981 {
	struct SetRoyalty {
		address receiver;
		uint96 feeNumerator; // 10000 == 100%
	}
	
	constructor(string memory baseURL, SetRoyalty memory setRoyaltyInfo) ERC1155(baseURL) {
		if (setRoyaltyInfo.receiver != address(0)) {
			_setDefaultRoyalty(setRoyaltyInfo.receiver, setRoyaltyInfo.feeNumerator);
		}
	}

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

	function mint(address to, uint256 id, bytes calldata rawInfo) override external onlyOwner {
		if (rawInfo.length != 0) {
			SetRoyalty memory setRoyaltyInfo = abi.decode(rawInfo, (SetRoyalty));
			if (setRoyaltyInfo.receiver != address(0)) {
				_setTokenRoyalty(id, setRoyaltyInfo.receiver, setRoyaltyInfo.feeNumerator);
			}
		}

		_mint(to, id, 1, "");
	}

    function _burn(address from, uint256 tokenId, uint256 qty) internal virtual override {
        super._burn(from, tokenId, qty);
        _resetTokenRoyalty(tokenId);
    }

	function burnFor(address from, uint256 id) override external onlyOwner {
		_burn(from, id, 1);
	}

	function mintBatch(address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata rawInfo) override external onlyOwner {
		if (rawInfo.length != 0) {
			SetRoyalty[] memory setRoyaltyInfo = abi.decode(rawInfo, (SetRoyalty[]));
			if (setRoyaltyInfo[0].receiver != address(0) && setRoyaltyInfo.length == ids.length) {
				for (uint i = 0; i < setRoyaltyInfo.length; i++) {
					_setTokenRoyalty(ids[i], setRoyaltyInfo[i].receiver, setRoyaltyInfo[i].feeNumerator);
				}
			}
		}

        _mintBatch(to, ids, amounts, "");
    }

    function burnBatchFor(address from, uint256[] calldata ids, uint256[] calldata amounts) override external onlyOwner {
        _burnBatch(from, ids, amounts);
    }

    function baseURI() override external view returns (string memory)  {
        return uri(0);
    }
}