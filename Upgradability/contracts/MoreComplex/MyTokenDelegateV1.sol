// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Proxiable {
    // Code position in storage is keccak256("PROXIABLE") = "0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7"
    bytes32 private constant UUID = 0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7;

    function updateCodeAddress(address newAddress) internal {
        require(
            bytes32(UUID) == Proxiable(newAddress).proxiableUUID(),
            "Not compatible"
        );
        assembly { // solium-disable-line
            sstore(UUID, newAddress)
        }
    }
    
    function proxiableUUID() public pure returns (bytes32) {
        return UUID;
    }
}

contract Owned {
    address owner;

    function setOwner(address _owner) internal {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner is allowed to perform this action");
        _;
    }
}

contract LibraryLockDataLayout {
    bool public initialized = false;
}

contract LibraryLock is LibraryLockDataLayout {
    // Ensures no one can manipulate the Logic Contract once it is deployed.
    // PARITY WALLET HACK PREVENTION

    modifier delegatedOnly() {
        require(initialized == true, "The library is locked. No direct 'call' is allowed");
        _;
    }

    function initialize() internal {
        initialized = true;
    }
}

contract ERC20DataLayout is LibraryLockDataLayout {
    uint256 internal totalSupply;
    mapping(address=>uint256) internal tokens;
}

contract SmallERC20 is ERC20DataLayout {
    function _transfer(address to, uint256 amount) internal {
        require(tokens[msg.sender] >= amount, "Not enough funds for transfer");
        tokens[to] += amount;
        tokens[msg.sender] -= amount;
    }

    function _totalSupply() internal view returns(uint256) {
        return totalSupply;
    }
}

contract MyTokenDelegateV1 is SmallERC20, Owned, Proxiable, LibraryLock {
    function constructor1(uint256 _initialSupply) public delegatedOnly {
        totalSupply = _initialSupply;
        tokens[msg.sender] = _initialSupply;
        initialize();
        setOwner(msg.sender);
    }

    function updateCode(address newCode) public { // onlyOwner
        updateCodeAddress(newCode);
    }

    function ttotalSupply() public returns(uint256) {
        return SmallERC20._totalSupply();
    }

    function transfer(address to, uint256 amount) public {
        SmallERC20._transfer(to, amount);
    }
}