const { assert } = require("console");

const Auction = artifacts.require("Auction");
const Token = artifacts.require("Token");

contract("Auction", (accounts) => {
	let token;
	let auction;

	before(async () => {
		token = await Token.deployed();
		auction = await Auction.deployed(
			45,
			Date.now() / 1000,
			Date.now() / 1000 + 259200,
			6,
			token.address
		);
	});

	it("Token - should put 100 coin in the first account", () => {
		const promise = token.balanceOf.call(accounts[0]);
		promise.then((balance) => {
			assert.equal(balance.toString(), 100, "100 wasn't in the first account");
		});
	});

	it("Auction - it should deploy the contract correctly with correct parameter", async () => {
		const promise = auction.currentPrice.call();
		promise.then((price) => {
			assert.notEqual(
				price.toString(),
				0,
				"currentPrice is not working, returning 0 price"
			);
		});
	});
});
