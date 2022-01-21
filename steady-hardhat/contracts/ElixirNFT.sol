// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "base64-sol/base64.sol";

import "hardhat/console.sol";


library Treasure {
 function generateTreasureChest() internal pure returns (string memory) {
        return string(abi.encodePacked(
                        '<g id="Treasure_Chest_Closed">',
                            '<g>',
                                '<rect x="197.3" y="117.1" class="st20" width="3.8" height="3.8"/>',
                                '<rect x="197.3" y="113.3" class="st21" width="3.8" height="3.8"/>',
                                '<rect x="197.3" y="109.5" class="st20" width="3.8" height="3.8"/>',
                                '<rect x="197.3" y="105.7" class="st21" width="3.8" height="3.8"/>',
                                '<rect x="98.9" y="105.7" class="st33" width="3.8" height="3.8"/>',
                                '<rect x="98.9" y="101.9" class="st20" width="3.8" height="3.8"/>',
                                '<rect x="98.9" y="98.1" class="st21" width="3.8" height="3.8"/>',
                                '<rect x="98.9" y="94.3" class="st33" width="3.8" height="3.8"/>',
                                '<rect x="98.9" y="90.5" class="st20" width="3.8" height="3.8"/>',
                            '</g>',
                        '</g>'
        )
        );
    }
}
/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension, but not including the Enumerable extension, which is available separately as
 * {ERC721Enumerable}.
 */
contract Elixir is ERC721, ERC721Burnable, AccessControl  {
    using Counters for Counters.Counter;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;

    // todo, change to UF specific owner.
    address public owner = 0xc1c5da1673935527d4EFE1714Ef8dcbee12a9380;

    struct Spagyria {
        uint256 fees;
        uint256 amount;
        uint256 ratio;
        uint256 forgePrice;
        address oracle;
        address alchemistId;
    }

    // tokenId => Spagyria
    mapping(uint256 => Spagyria) public elements;
    
    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor (string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function safeMint(address to,  uint256 forgePrice, uint256 ratio , address oracle, uint fees, uint amount) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        elements[tokenId] = Spagyria(fees, amount, ratio, forgePrice, oracle, msg.sender);
    }

    function priceFromOracle(address _priceOracle) public view returns (int256 price) {
        // bytes memory payload = abi.encodeWithSignature("getLatestPrice()");
        bytes memory payload = abi.encodeWithSignature("latestAnswer()");
        (, bytes memory returnData) = address(_priceOracle).staticcall(payload);
        (price) = abi.decode(returnData, (int256));
        //minimumn price of 0.00000001 and max price of 1 Trillion
        require(price >= 1 && price <= 1000000000000000000000000000000, "Oracle price is out of range");
    }
    
    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory name = string(abi.encodePacked(' Elxir Spagyria #', toString(tokenId)));
        string memory description = "Elixir NFT Spagyria";

        string memory image = generateBase64Image(tokenId);


        return string(
            abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"', 
                            name,
                            '", "description":"', 
                            description,
                            '", "image": "', 
                            'data:image/svg+xml;base64,', 
                            image,
                            '"}'
                        )
                    )
                )
            )
        );
    }

    function generateBase64Image(uint256 tokenId) public view returns (string memory) {
        return Base64.encode(bytes(generateImage(tokenId)));
    }

    function generateImage(uint256 tokenId) public view returns (string memory) {
       
        string memory treasureChest = Treasure.generateTreasureChest();
        uint256 ForgeConstant = elements[tokenId].forgePrice * elements[tokenId].ratio / 100;
        string memory elixirCurrentSteadyValue = toString((uint256(priceFromOracle(elements[tokenId].oracle)) 
                                                                    - ForgeConstant) 
                                                                    * elements[tokenId].amount / 1000000);
        

        return string(
            abi.encodePacked(
                '<svg class="svgBody" width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">',
                '<defs>',
                '<style>',
                '@import url("https://fonts.googleapis.com/css2?family=Orbitron");',
                '</style>',
                '</defs>',
                '<style><![CDATA[svg text{stroke:none}]]></style>',
                '<style type="text/css">',
	            '.st0{fill:#FFFFFF;}.st1{display:none;fill:none;stroke:#FFFFFF;stroke-width:0.5;}',
                '.st2{fill:#B0EFEB;}.st3{fill:#EDFFA9;}.st4{display:none;}.st5{fill:#FFFFFF;}',
                '.st20{fill:#FFB031;} .st21{fill:#FFA300;} .st22{fill:#E58D00;} .st23{fill:#2D190B;} .st24{fill:#3D2515;} ', 
                '.st25{fill:#3F2819;}.st26{fill:#211207;} .st27{fill:#4C3322;} .st28{fill:#351F10;} .st29{fill:#5B412F;}',
                '.st30{fill:#563D2D;} .st31{fill:#664C3A;} .st32{fill:#68471F;} .st33{fill:#F9D39B;} .st34{fill:#28160B;} .st35{fill:none;}',
                '</style>',
                '<g id="Base_Layer">',
                '<path d="M10,0h280c5.5,0,10,4.5,10,10v280c0,5.5-4.5,10-10,10H10c-5.5,0-10-4.5-10-10V10C0,4.5,4.5,0,10,0z"/>',
                '<rect y="64.2" class="st0" width="300" height="117.4"/>',
                '<rect x="0" y="187.9" class="st2" width="300" height="53.9"/>',
	            '<rect x="0" y="244.5" class="st3" width="300.5" height="45.4"/>',
	            '<rect x="226.9" y="86.8" class="st4" width="56.3" height="212.7"/>',
	            '<line class="st5" x1="235" y1="90" x2="235" y2="300"/>',
	            '<line class="st6" x1="245" y1="90" x2="245" y2="300"/>',
	            '<line class="st7" x1="255" y1="90" x2="255" y2="300"/>',
	            '<line class="st8" x1="275.2" y1="90" x2="275.2" y2="300"/>',
                '<text x="50" y="40" class="st0" font-size="30px" font-family="Orbitron">ELIXIR NFT</text>',
                '<text x="14" y="210" font-family="Orbitron">Elixir Price - </text>',
                '<text x="124" y="210" font-family="Orbitron">',elixirCurrentSteadyValue,' </text>',
                '<text x="14" y="265" font-family="Orbitron">Alchemist</text>',
                '<text x="14" y="280"  font-size="7px"  font-family="Orbitron">',toHexString(uint160(elements[tokenId].alchemistId), 20),' </text>',
	            '<line class="st9" x1="265.2" y1="90" x2="265.2" y2="300"/>',
                '</g>',
                treasureChest,
                '</svg>'
            )
        );
    }

    // from: https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/utils/Strings.sol
    /**
     * @dev Converts a `uint256` to its ASCII `string` decimal representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
        bytes16 private constant _ALPHABET = "0123456789abcdef";

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _ALPHABET[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "HEX_L");
        return string(buffer);
    }

}