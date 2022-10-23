// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; 

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./BridgeNFTBatch.sol";

contract XPNft1155 is ERC1155, Ownable, BridgeNFTBatch {
    constructor(string memory baseURL) ERC1155(baseURL) {} // solhint-disable-line no-empty-blocks

	function mint(address to, uint256 id, bytes calldata) override external onlyOwner {
		_mint(to, id, 1, "");
	}

	function burnFor(address from, uint256 id) override external onlyOwner {
		_burn(from, id, 1);
	}

	function mintBatch(address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata) override external onlyOwner {
        _mintBatch(to, ids, amounts, "");
    }

    function burnBatchFor(address from, uint256[] calldata ids, uint256[] calldata amounts) override external onlyOwner {
        _burnBatch(from, ids, amounts);
    }

    function baseURI() override external view returns (string memory)  {
        return uri(0);
    }
}
