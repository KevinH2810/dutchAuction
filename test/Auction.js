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

		token = Token.attach(token.address);
		//set the allowance
		await token.approve(auction.address, ethers.utils.parseUnits("10", "wei"), {
			from: accounts[0].address,
		});

		//check the allowance
		const contractAllowance = await token.allowance(
			accounts[0].address,
			auction.address
		);
		//bid the item
		const res = await auction.bid(
			accounts[1].address,
			ethers.utils.parseUnits("50", "wei")
		);

		const balance1 = await token.balanceOf(accounts[1].address);
		const balance0 = await token.balanceOf(accounts[0].address);

		expect(balance1.toNumber()).to.equal(6);
		expect(balance0.toNumber()).to.equal(94);
	});
});
