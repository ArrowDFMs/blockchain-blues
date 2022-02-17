// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Communicator {
    // STORAGE
    string public calendarTime;
    address constant oracleAddress = 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199; // account calling contract from listener

    // ERRORS
    error SenderNotOracle(address sender, address oracleAddress);

    // EVENTS
    /**
     * @dev Emitted to communicate with off-chain resource
     */
    event Signal();

    // MODIFIERS
    /**
     * @dev Ensures only oracle node can set calendar time
     */
    modifier onlyOracle() {
        if (msg.sender != oracleAddress) {
            revert SenderNotOracle(msg.sender, oracleAddress);
        }
        _;
    }

    // CONSTRUCTOR
    constructor() {
        calendarTime = "00/00/0000 00:00:00";
    }

    // FUNCTIONS
    function emitSignal() external {
        emit Signal();
    }

    function setTime(
        string calldata _calendarTime
    ) external onlyOracle {
        calendarTime = _calendarTime;
    }
}