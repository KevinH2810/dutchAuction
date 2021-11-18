// SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("Token", "TKN") {
        _mint(msg.sender, 100);
    }
}
