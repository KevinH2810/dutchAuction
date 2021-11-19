const { expect } = require("chai");
const { assert } = require("console");
const { BigNumber } = require("ethers");

describe("Auction", (accounts) => {
	let token;
	let auction;

	it("Auction - it should deploy the contract correctly with correct parameter", async () => {
		const Token = await ethers.getContractFactory("Token");
		const Auction = await ethers.getContractFactory("Auction");

		token = await Token.deploy();
		auction = Auction.deploy(
			45,
			Math.floor(Date.now() / 1000),
			Math.floor(Date.now() / 1000 + 259200),
			6,
			token.address
		);

		auction
			.then((instance) => instance.currentPrice.call())
			.then((price) => {
				expect(price).to.not.equal(0);
			});
	});

	it("Auction - test Bid function Success", async () => {
		const accounts = await hre.ethers.getSigners();
		const Token = await ethers.getContractFactory("Token");
		const Auction = await ethers.getContractFactory("Auction");

		token = await Token.deploy();
		auction = await Auction.deploy(
			45,
			Math.floor(Date.now() / 1000 - 3600),
			Math.floor(Date.now() / 1000 + 259200),
			6,
			token.address
		);
		let x = await auction.owner();
		let amount = await auction.auctionedAmount();
		console.log("owner = ", x);
		console.log("amount = ", amount.toNumber());

		token = Token.attach(token.address);
		//set the allowance
		await token.approve(auction.address, ethers.utils.parseUnits("20", "wei"), {
			from: accounts[0].address,
		});

		//check the allowance
		const contractAllowance = await token.allowance(
			accounts[0].address,
			auction.address
		);
		console.log("allowance = ", contractAllowance.toNumber());

		//bid the item
		auction = Auction.attach(accounts[1].address);
		const res = await auction.bid({
			value: ethers.utils.parseUnits("21", "wei"),
		});

		const result = await res.wait();

		console.log("res = ", res);
		console.log("result = ", result);

		const balance1 = await token.balanceOf(accounts[1].address);
		const balance0 = await token.balanceOf(accounts[0].address);

		console.log("accounts 1 token ", balance1.toNumber());
		console.log("accounts 0 token ", balance0.toNumber());

		expect(balance1.toNumber()).to.equal(21);
	});
});
