const Auction = artifacts.require("Auction");

module.exports = function (deployer) {
	deployer.deploy(
		Auction,
		40,
		1637072812,
		1637418412,
		5,
		"0x5bb6d3f1f8F0A2A6233d4D3d8cE5c4E424885439"
	);
};
