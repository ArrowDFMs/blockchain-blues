// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Communicator {

    string public calendarTime;
    address constant oracleAddress = address(0);

    error SenderNotOracle(address sender, address oracleAddress);

    /**
     * @dev Emitted to communicate with off-chain resource
     */
    event Signal(
        address indexed sender,
        uint256 value
    );

    /**
     * @dev Ensures only oracle node can set calendar time
     */
     modifier onlyOracle() {
        if (msg.sender != oracleAddress) {
            revert SenderNotOracle(msg.sender, oracleAddress);
        }
            _;
     }

    constructor () {}

    function emitSignal(
        uint256 value
    ) external {
        emit Signal(address(this), value);
    }

    function setTime(
        string calldata _calendarTime
        ) external onlyOracle {
            calendarTime = _calendarTime;
        }

}