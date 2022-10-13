// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "base64-sol/base64.sol";
import "./interfaces/IAcademy.sol";
import "./interfaces/ITreasure.sol";
contract Elixir is ERC721, ERC721Burnable, AccessControl {
    using Counters for Counters.Counter;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter public tokenIdCounter;

    // Below owner is the owner for the purpose of setting the page details in opensea.
    address public owner = 0xc1c5da1673935527d4EFE1714Ef8dcbee12a9380;
    address public academy;
    address public treasure;

    string public alchemistId;

    struct Spagyria {
        uint256 amount;
        uint8 ratioOfSteady;
        uint256 forgePrice;
        address chyme;
        address alchemistId;
        uint256 timeToMaturity;
        address chymeVault;
        uint decimals;
    }

    // tokenId => Spagyria
    mapping(uint256 => Spagyria) public elements;

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor(
        string memory name_,
        string memory symbol_,
        address _treasure
    ) ERC721(name_, symbol_) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        treasure = _treasure;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function setAcademy(address _academy)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        academy = _academy;
    }

    function setTreasure(address _treasure)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        treasure = _treasure;
    }

    function getSteadyRequired(uint256 tokenId)
        public
        view
        returns (
            uint256 steadyRequired,
            uint256 ratioOfSteady,
            uint256 timeToMaturity,
            address chymeVault
        )
    {
        Spagyria memory myElixir = elements[tokenId];
        // (,, uint8 decimals,,,,) = IAcademy(address(academy)).getChymeInfo(
        //     address(elements[tokenId].chyme)
        // );
        uint256 divisor = 10**myElixir.decimals;
        return (
            ((myElixir.amount *
                myElixir.ratioOfSteady *
                uint256(myElixir.forgePrice)) / (100 * (divisor * divisor))) *
                (10**18),
            myElixir.ratioOfSteady,
            myElixir.timeToMaturity,
            myElixir.chymeVault
        );
    }

    function safeMint(
        address _to,
        address _chyme,
        uint8 _ratioOfSteady,
        uint256 _forgePrice,
        uint256 _amount,
        uint256 _timeToMaturity,
        address _chymeVault,
        uint256 _decimals
    ) public onlyRole(MINTER_ROLE) returns(uint256 tokenId) {
        tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        _safeMint(_to, tokenId);
        elements[tokenId] = Spagyria(
            _amount,
            _ratioOfSteady,
            _forgePrice,
            _chyme,
            msg.sender,
            _timeToMaturity,
            _chymeVault,
            _decimals
        );
        alchemistId = Strings.toHexString(uint160(elements[tokenId].alchemistId));
        return tokenId;
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
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory name = string(
            abi.encodePacked("Elxir #", Strings.toString(tokenId))
        );
        string memory description = "Elixir NFT";
        (
            int256 elixirCurrentSteadyValue,
            uint256 currentPrice,
            uint256 forgeConstant,
            uint256 timeLeft
        ) = calculateParams(tokenId);
        Spagyria memory myElixir = elements[tokenId];
        uint256 divisor = 10**myElixir.decimals;
             
        string memory attributes = generateAttributesPartA(
            tokenId,
            currentPrice,
            forgeConstant,
            divisor
        );
        string memory attributesSet = generateAttributesPartB(elixirCurrentSteadyValue > 0 ? Strings.toString(uint256(elixirCurrentSteadyValue)) : int2str(elixirCurrentSteadyValue));
        string memory image = generateBase64Image(
            tokenId,
            timeLeft,
            elixirCurrentSteadyValue > 0 ? Strings.toString(uint256(elixirCurrentSteadyValue)) : int2str(elixirCurrentSteadyValue)
        );
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
                                attributes,attributesSet,
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

    function calculateParams(uint256 tokenId)
        public
        view
        returns (
            int256 elixirCurrentSteadyValue,
            uint256 currentPrice,
            uint256 forgeConstant,
            uint256 timeLeft
        )
    {
        (address oracleAddress,,,,,,) = IAcademy(
            address(academy)
        ).getChymeInfo(elements[tokenId].chyme);
        currentPrice = uint256(
            IAcademy(academy).priceFromOracle(oracleAddress)
        );
        forgeConstant =
            (elements[tokenId].forgePrice * elements[tokenId].ratioOfSteady) /
            100;
        elixirCurrentSteadyValue = (int256(currentPrice) - int256(forgeConstant)) 
                                    * int256(elements[tokenId].amount) / int256(10**elements[tokenId].decimals * 10**elements[tokenId].decimals);
        timeLeft = 0;
        if (elements[tokenId].timeToMaturity > block.timestamp) {
            timeLeft =
                (elements[tokenId].timeToMaturity - block.timestamp) /
                86400;
        }
        return (
            elixirCurrentSteadyValue,
            currentPrice,
            forgeConstant,
            timeLeft
        );
    }

    function generateAttributesPartA(
        uint256 tokenId,
        uint256 currentPrice,
        uint256 forgeConstant,
        uint256 divisor
    ) public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '{"display_type": "date", "trait_type": "Matures By", "value":',Strings.toString(elements[tokenId].timeToMaturity),'}',
                    ',{"trait_type": "Forge Price", "value":',Strings.toString((elements[tokenId].forgePrice/divisor)),'}',
                    ',{"trait_type": "Amount", "value":',Strings.toString((elements[tokenId].amount/divisor)),'}',
                    ',{"trait_type": "Price", "value":',Strings.toString(currentPrice/divisor),'}',
                    ',{"trait_type": "forgeConstant", "value":',Strings.toString(forgeConstant/divisor),'}'
                )
            );
    }

    function generateAttributesPartB(
        string memory elixirCurrentSteadyValue
    ) public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    ',{"trait_type": "Total Value in ($)", "value":',elixirCurrentSteadyValue,'}',
                    ',{"trait_type": "Alchemist", "value":"',alchemistId,'"}'
                )
            );
    }

    function generateBase64Image(
        uint256 tokenId,
        uint256 timeLeft,
        string memory elixirCurrentSteadyValue
    ) public view returns (string memory) {
        return
            Base64.encode(
                bytes(
                    generateImage(tokenId, timeLeft, elixirCurrentSteadyValue)
                )
            );
    }

    function generateImage(
        uint256 tokenId,
        uint256 timeLeft,
        string memory elixirCurrentSteadyValue
    ) public view returns (string memory) {
        //display a treasure chest with remaining time in days and also a percentage to show progress 1095 = days in 3 years
        string memory treasureChest = ITreasure(treasure).generateTreasureChest(
            Strings.toString(timeLeft),
            Strings.toString((timeLeft * 100) / 1095)
        );
        return
            string(
                abi.encodePacked(
                    ITreasure(treasure).generateHeader(),
                    '<text x="14" y="220" font-size="10px" font-family="Arial">Elixir Value - $</text>',
                    '<text x="90" y="220" font-size="21px"  font-family="Arial">',
                    elixirCurrentSteadyValue,
                    "</text>",
                    '<text x="14" y="265" font-family="Arial">Token Address</text>',
                    '<text x="14" y="280"  font-size="11px"  font-family="Arial">',
                    Strings.toHexString(uint160(elements[tokenId].chyme), 20),
                    "</text>",
                    '<line class="st9" x1="265.2" y1="90" x2="265.2" y2="300"/>',
                    "</g>",
                    treasureChest,
                    "</svg>"
                )
            );
    }

    function burn(uint256 tokenId) public override(ERC721Burnable) {
        super.burn(tokenId);
    }

    function getCurrentTokenId() public view returns (uint256) {
        return tokenIdCounter.current();
    }
    
    /**
     * @dev Converts an `int256` to its ASCII `string` decimal representation.
     */
    function int2str(int256 i) private pure returns (string memory) {
        if (i == 0) return "0";
        bool negative = i < 0;
        uint j = uint(negative ? -i : i);
        uint l = j;     // Keep an unsigned copy
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        if (negative) ++len;  // Make room for '-' sign
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (l != 0) {
            bstr[k--] = bytes1(uint8(48 + uint256(l % 10)));
            l /= 10;
        }
        if (negative) {    // Prepend '-'
            bstr[0] = '-';
        }
        return string(bstr);
    }
}