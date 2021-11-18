// SPDX-License-Identifier: MIT
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("Token", "TKN") {
        _mint(msg.sender, 100);
        balanceOf(msg.sender);
    }
}
