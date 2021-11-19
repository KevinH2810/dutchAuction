/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
module.exports = {
	solidity: {
		compilers: [
			{
				version: "0.5.5",
			},
			{
				version: "0.6.7",
			},
			{
				version: "0.8.0",
			},
		],
	},
};
