// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

import "./Token.sol";
import "hardhat/console.sol";

contract Auction{
    address payable public owner;
    address payable public buyer;
    address tokenAddr;
    uint256 public startPrice;
    uint256 public startDate;
    uint256 public endDate;
    uint256 public currentTime;
    uint256 public auctionedAmount;
    Token public token;

    //we auction 1 token per auction by default
    event Bid(address buyer, uint256 amount);

    constructor(
        uint256 startPrice_,
        uint256 startDate_,
        uint256 endDate_,
        uint256 tokenAmount_,
        address tokenAddr_
    ) payable {
        require(startPrice_ > 0, "invalid startPrice_");
        require(endDate_ > startDate_, "invalid endDate_ or startDate_");
        token = Token(tokenAddr_);
        uint256 TKNbalance = token.balanceOf(msg.sender);
        require(TKNbalance > tokenAmount_, "not enough token to be auctioned");
        owner = payable(msg.sender);
        startPrice = startPrice_;
        startDate = startDate_;
        endDate = endDate_;
        currentTime = block.timestamp;
        //How many TKN that is auctioned
        auctionedAmount = tokenAmount_;
    }

    function bid(address buy, uint amount) external payable {
        require(buy != owner, "owner are unable to bid in the Auction");
        require(block.timestamp > startDate, "Auction hasn't started yet");
        require(block.timestamp < endDate, "Auction is Done");
        require(buyer == address(0), "Auction item has been bought");
        require(amount < 1e35);
        require(
            address(buy).balance > amount,
            "Not enough balance to bid"
        );

        uint256 price = currentPrice();

        require(amount >= price, "amount is lower than price");
        //to prevent owner from setup an auction and using the auctioned token amount for other transaction
        require(
            token.balanceOf(owner) > auctionedAmount,
            "not enough token to be auctioned"
        );

        buyer = payable(buy);
        // buyer.transfer(amount);
        // buyer.call({value:amount}).gas(2500);
        //send ETh from buyer to owner of the token assets
        (bool sent, ) = owner.call{value: amount}("");
        require(!sent, "ETH is not sent");

        token.transferFrom(owner, buyer, auctionedAmount);
        emit Bid(buyer, amount);
    }

    function currentPrice() public payable returns (uint256) {
        require(block.timestamp > startDate, "Auction hasn't started yet");
        uint256 elapse = block.timestamp - startDate;
        uint256 calculated = (elapse * 100) / (endDate - startDate);
        uint256 deduction = (calculated * startPrice) / 100;
        uint256 currPrice = startPrice - deduction;
        return currPrice;
    }

    function getOwner() public view returns(address){
      return owner;
    }
}
