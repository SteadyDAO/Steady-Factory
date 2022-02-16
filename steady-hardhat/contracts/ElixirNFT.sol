// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "base64-sol/base64.sol";
import "./interfaces/IAcademy.sol";
import "./interfaces/ITreasure.sol";

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
    address public academy;
    address public treasure;

    struct Spagyria {
        uint256 amount;
        uint256 forgePrice;
        address chyme;
        address alchemistId;
        uint256 timeToMaturity;
    }

    // tokenId => Spagyria
    mapping(uint256 => Spagyria) public elements;
    
    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor (string memory name_, string memory symbol_, address _treasure) ERC721(name_, symbol_) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        treasure = _treasure;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setAcademy(address _academy) external onlyRole(DEFAULT_ADMIN_ROLE) {
        academy = _academy;
    }

    function setTreasure(address _treasure) external onlyRole(DEFAULT_ADMIN_ROLE) {
        treasure = _treasure;
    }

    function getSteadyRequired(uint256 tokenId) public view returns(uint256 steadyRequired, uint256 chymeAmount) {
        Spagyria memory myElixir = elements[tokenId];
        (,, uint8 ratioOfSteady, uint8 decimals,) = IAcademy(address(academy)).getChymeInfo(address(elements[tokenId].chyme));
        uint divisor = 100 * 10 ** decimals;
        return (myElixir.forgePrice *  ratioOfSteady * myElixir.amount / divisor, myElixir.amount);
    }

    function safeMint
        (
        address _to, 
        address _chyme,
        uint256 _forgePrice,
        uint256 _amount,
        uint256 _timeToMaturity
        ) 
        public 
        onlyRole(MINTER_ROLE) 
        {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(_to, tokenId);
            elements[tokenId] = Spagyria(_amount, _forgePrice, _chyme, msg.sender, _timeToMaturity);
        }
    
    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) 
        public 
        view 
        virtual 
        override 
        returns (string memory) 
        {
            require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

            string memory name = string(abi.encodePacked('Elxir Spagyria #', toString(tokenId)));
            string memory description = "Elixir NFT Spagyria";
            (string memory elixirCurrentSteadyValue,
            uint256 currentPrice,
            uint256 forgeConstant,
            uint256 timeLeft ) = calculateParams(tokenId);
            string memory attributes = generateAttributes(tokenId,elixirCurrentSteadyValue, currentPrice,forgeConstant);
            string memory image = generateBase64Image(tokenId,timeLeft,elixirCurrentSteadyValue);
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
                                '", "attributes":[', 
                                attributes,
                                '], "image": "', 
                                'data:image/svg+xml;base64,', 
                                image,
                                '"}'
                            )
                        )
                    )
                )
            );
        }
    
    function calculateParams(uint256 tokenId) public view returns (
        string memory elixirCurrentSteadyValue,
        uint256 currentPrice,
        uint256 forgeConstant,
        uint256 timeLeft )  {
        (address oracleAddress,, uint8 ratioOfSteady, uint8 decimals,) = 
                                        IAcademy(address(academy)).getChymeInfo(elements[tokenId].chyme);
            currentPrice = uint256(IAcademy(academy).priceFromOracle(oracleAddress));
            forgeConstant = elements[tokenId].forgePrice * ratioOfSteady / 100;
            elixirCurrentSteadyValue = toString((currentPrice  
                                                - forgeConstant) 
                                                * elements[tokenId].amount / 10 ** decimals);
            timeLeft = 0;
            if(elements[tokenId].timeToMaturity > block.timestamp){
                timeLeft = (elements[tokenId].timeToMaturity - block.timestamp) / 86400;
            }
        return (elixirCurrentSteadyValue,currentPrice,forgeConstant,timeLeft);
    }

    function generateAttributes(uint256 tokenId,string memory elixirCurrentSteadyValue, uint256 currentPrice, uint256 forgeConstant) 
        public view returns (string memory) {
            return string(
                abi.encodePacked(
                    '{"display_type": "date", "trait_type": "Matures By", "value":',toString(elements[tokenId].timeToMaturity),'}',
                    ',{"display_type": "number", "trait_type": "Forge Price", "value":',toString((elements[tokenId].forgePrice)),'}',
                    ',{"display_type": "number", "trait_type": "Amount", "value":',toString((elements[tokenId].amount)),'}',
                    ',{"display_type": "number", "trait_type": "Current Price", "value":',toString(currentPrice),'}',
                    ',{"display_type": "number", "trait_type": "elixirCurrentSteadyValue Price", "value":',elixirCurrentSteadyValue,'}',
                    ',{"trait_type": "Alchemist", "value":"',toHexString(uint160(elements[tokenId].alchemistId), 20),'"}',
                    ',{"display_type": "number", "trait_type": "forgeConstant", "value":',toString(forgeConstant),'}')
                    );
}

    function generateBase64Image(uint256 tokenId,uint256 timeLeft,string memory elixirCurrentSteadyValue) 
        public view returns (string memory) {
        return Base64.encode(bytes(generateImage(tokenId,timeLeft,elixirCurrentSteadyValue)));
    }

    function generateImage(uint256 tokenId,uint256 timeLeft,string memory elixirCurrentSteadyValue) 
        public view returns (string memory) {
            
            //display a treasure chest with remaining time in days and also a percentage to show progress 1825 = days in 5 years
            string memory treasureChest = ITreasure(treasure).generateTreasureChest(toString(timeLeft), toString(timeLeft*100/1825));
            return string(
                abi.encodePacked(
                    ITreasure(treasure).generateHeader(),
                    '<text x="14" y="215" font-size="10px" font-family="Arial">Value</text>',
                    '<text x="79" y="215" font-size="14px"  font-family="Arial">',elixirCurrentSteadyValue,'</text>',
                    '<text x="14" y="265" font-family="Arial">Alchemist</text>',
                    '<text x="14" y="280"  font-size="7px"  font-family="Arial">',toHexString(uint160(elements[tokenId].alchemistId), 20),' </text>',
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
    function toString(uint256 value) public pure returns (string memory) {
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
    function toHexString(uint256 value, uint256 length) public pure returns (string memory) {
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

    function burn(uint256 tokenId) public override(ERC721Burnable) {
        super.burn(tokenId);
    }

}