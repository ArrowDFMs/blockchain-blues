// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Communicator {

    string public calendarTime;
    address constant oracleAddress = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266; // account calling contract from listener

    error SenderNotOracle(address sender, address oracleAddress);

    /**
     * @dev Emitted to communicate with off-chain resource
     */
    event Signal();

    /**
     * @dev Ensures only oracle node can set calendar time
     */
     modifier onlyOracle() {
        if (msg.sender != oracleAddress) {
            revert SenderNotOracle(msg.sender, oracleAddress);
        }
            _;
     }

    function emitSignal() external {
        emit Signal();
    }

    function setTime(
        string calldata _calendarTime
        ) external onlyOracle {
            calendarTime = _calendarTime;
        }

}