// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Proxy {
    // Code position in storage is keccak256("PROXIABLE") = "0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7"
    constructor(bytes memory constructData, address contractLogic) {
        // save the code address
        assembly {
            sstore(0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7, contractLogic)
        }
        (bool success,) = contractLogic.delegatecall(constructData);
        require(success, "Construction failed");
    }

    fallback(bytes calldata) external payable returns (bytes memory) {
        address contractLogic;
        assembly {
            contractLogic := sload(0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7)
        }

        (bool success, bytes memory data) = contractLogic.delegatecall(msg.data);
        if (!success) {
            // Uniswap-like decoding of reverted errors in delegatecall
            assembly {
                let ptr := mload(0x40)
                let size := returndatasize()
                returndatacopy(ptr, 0, size)
                revert(ptr, size)
            }
        }
        return data;
    }
}