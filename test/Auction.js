const { expect } = require("chai");
const { assert } = require("console");
const { BigNumber } = require("ethers");

describe("Auction", () => {
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

		token = Token.attach(token.address);
		//set the allowance
		await token.approve(auction.address, ethers.utils.parseUnits("10", "wei"), {
			from: accounts[0].address,
		});

		//check the allowance
		await token.allowance(accounts[0].address, auction.address);
		//bid the item
		auction = Auction.attach(auction.address);

		let initBalance1 = await accounts[1].getBalance();
		console.log("balance before = ", initBalance1.toString());

		let initBalance0 = await accounts[0].getBalance();
		console.log("balance owner before = ", initBalance0.toString());

		const res = await auction
			.connect(accounts[1])
			.bid({ value: ethers.utils.parseUnits("50", "wei") });

		let afterBalance1 = await accounts[1].getBalance();
		console.log("balance after = ", afterBalance1.toString());

		let afterBalance0 = await accounts[0].getBalance();
		console.log("balance owner after = ", afterBalance0.toString());

		const balance1 = await token.balanceOf(accounts[1].address);
		const balance0 = await token.balanceOf(accounts[0].address);

		expect(balance1.toNumber()).to.equal(6);
		expect(balance0.toNumber()).to.equal(94);
		expect(afterBalance0.toString()).to.equal(initBalance0.add(50).toString());
	});

	it("Auction - test Bid function - Fail - Bid price is lower than current price", async () => {
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

		token = Token.attach(token.address);
		//set the allowance
		await token.approve(auction.address, ethers.utils.parseUnits("10", "wei"), {
			from: accounts[0].address,
		});

		//check the allowance
		await token.allowance(accounts[0].address, auction.address);
		//bid the item
		await expect(
			auction
				.connect(accounts[0])
				.bid(accounts[1].address, ethers.utils.parseUnits("1", "wei"))
		).to.be.revertedWith("amount is lower than price");
	});

	it("Auction - test Bid function - Fail - Auction is not started yet", async () => {
		const accounts = await hre.ethers.getSigners();
		const Token = await ethers.getContractFactory("Token");
		const Auction = await ethers.getContractFactory("Auction");

		token = await Token.deploy();
		auction = await Auction.deploy(
			45,
			Math.floor(Date.now() / 1000 + 14400),
			Math.floor(Date.now() / 1000 + 259200),
			6,
			token.address
		);
		await expect(
			auction
				.connect(accounts[0])
				.bid(accounts[1].address, ethers.utils.parseUnits("55", "wei"))
		).to.be.revertedWith("Auction hasn't started yet");
	});

	it("Auction - test Bid function - Fail - Owner participate in bidding", async () => {
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

		token = Token.attach(token.address);
		//set the allowance
		await token.approve(auction.address, ethers.utils.parseUnits("10", "wei"), {
			from: accounts[0].address,
		});

		//check the allowance
		await token.allowance(accounts[0].address, auction.address);
		//bid the item
		expect(
			auction
				.connect(accounts[0])
				.bid(accounts[0].address, ethers.utils.parseUnits("60", "wei"))
		).to.be.revertedWith(
			"'owner are now allowed to participate in the Auction"
		);
	});

	it("Auction - test reserve Price - Success", async () => {
		const accounts = await hre.ethers.getSigners();
		const Token = await ethers.getContractFactory("Token");
		const Auction = await ethers.getContractFactory("Auction");

		token = await Token.deploy();
		auction = await Auction.deploy(
			45,
			Math.floor(Date.now() / 1000 - 259200),
			Math.floor(Date.now() / 1000 + 86400),
			6,
			token.address
		);

		await auction.setReservePrice(30);

		const currentPriceAfter = await auction.currentPrice.call();
		expect(currentPriceAfter).to.equal(30);
	});
});
