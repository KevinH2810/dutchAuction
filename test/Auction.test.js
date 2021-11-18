const Auction = artifacts.require("Auction");

contract("Auction", (accounts) => {
	it("it should deploy the contract correctly with correct parameter", () => {
		Auction.deployed(
			45,
			Date.now() / 1000,
			Date.now() / 1000 + 259200,
			6,
			"0xe7E621b4A3DF0d596101d2691Bae52CdcFb6E80F"
		)
			.then((instace) => instace.currentPrice.call())
			.then((price) => {
				assert.notEqual(
					price.valueOf(),
					0,
					"currentPrice is not working, returning 0 price"
				);
			});
	});
});
