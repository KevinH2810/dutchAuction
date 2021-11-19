# Dutch Auction

## Description
This is a simple Dutch Auction in Smart Contract. in which the assets will start at the designated price and it will gradually decreate the price automaticalle until the time runs out or when someone `bid`(`buy`) the assets, in which the smart contract will deduce `wei` according to the price buyer bid and transfer the asset into the `buyer`.


## Test Server
- refer to [Hardhat](https://hardhat.org/tutorial/) for more Documentation

## Command Line
```
$ git clone git@github.com:KevinH2810/dutchAuction-smartContract.git

$ npm i
```

### Run Test

before we continue to testing, make sure you have installed hardhat on your local, 
refer to: [hardhat](https://hardhat.org/getting-started/)

after installing hardhat, make sure you also have install the prequisite libs.

to test the contract in overall use the following command :
```
$ npx hardhat test
```
Or if you want to test specific file use:
