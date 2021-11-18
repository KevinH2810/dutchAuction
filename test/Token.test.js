const Token = artifacts.require("Token");

contract("Token", (accounts) => {
	it("should put 100 coin in the first account", () => {
		Token.deployed()
			.then((instance) => instance.getBalance.call(accounts[0]))
			.then((balance) => {
				assert.equal(
					balance.valueOf(),
					10000,
					"10000 wasn't in the first account"
				);
			});
	});
});
