const { assert } = require("console");

describe("Token", (accounts) => {
	it("Token - should put 100 coin in the first account", async () => {
		const Token = await ethers.getContractFactory("Token");
		const token = Token.deploy();
		token
			.then((instance) => instance.balanceOf.call(accounts[0]))
			.then((balance) => {
				assert.equal(balance.toString(), 100, "Token Balance is not 100");
				done();
			});
	});
});
