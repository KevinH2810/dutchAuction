const Auction = artifacts.require("Auction");

module.exports = function (deployer) {
	deployer.deploy(
		Auction,
		40,
		1637072812,
		1637418412,
		5,
		"0x06f099e7F1be2d1A494c38c03a5E88a0b79AE5E4"
	);
};
