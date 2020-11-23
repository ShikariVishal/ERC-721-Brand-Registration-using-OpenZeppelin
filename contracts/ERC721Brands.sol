pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Brands is ERC721{

    string[] public brands;
    mapping(string => bool) brandExists;

    constructor() ERC721("Brand", "BRAND") public {
    }

    function mint(string memory _brand) public {
        require(!brandExists[_brand]);
        brands.push(_brand);
        uint _id = brands.length;
        _mint(msg.sender, _id);
        brandExists[_brand] = true;
    }

    function getBrands() public view returns(string[] memory) {
        return brands;
    }

}
