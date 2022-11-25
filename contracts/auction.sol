//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

//@title A simple auction contract for a product where multiple auctions can be done after transfer of ownership
contract auction {

    address payable public owner;
    struct product{
        uint endTime;
        uint basePrice;
        string description;
        uint charge;
        bool isClosed;
        uint highestBid;
        address highestBidder;
        mapping(address => uint) TotalBidders; 
    }

product ProductInstance;

event auctionEnded (address indexed buyer,uint indexed FinalPrice );
event newAuction(uint indexed basePrice,uint charge,address indexed owner);
event bidPlacers(address indexed bidders,uint amount);



    constructor(uint _basePrice,string memory _description,uint _charge,uint _auctionTime){
    owner = payable(msg.sender);
    ProductInstance.basePrice = _basePrice;
    ProductInstance.description = _description;
    ProductInstance.charge = _charge;
    ProductInstance.isClosed = false;
    ProductInstance.endTime=block.timestamp + _auctionTime*60;
    ProductInstance.highestBidder = address(0);
    }

modifier onlyOwner{
    require(owner == msg.sender,"only owner is allowed");
    _;
}

function endAuction() internal {
    require(block.timestamp >= ProductInstance.endTime,"the bidding endtime is not reached");
    require(ProductInstance.highestBid > 0,"bid is not done on the product");
    owner.transfer(address(this).balance);
    ProductInstance.isClosed = true;
    owner = payable(ProductInstance.highestBidder);  
    emit auctionEnded(owner,ProductInstance.highestBid);
}


//@dev places the bid 
function placeBid()public payable{
    require(ProductInstance.isClosed == false,"the auction is closed");
    require(msg.value > 0 && msg.value >= ProductInstance.basePrice,"amount cant be zero");
    require(msg.value > ProductInstance.highestBid,"less than the bid amount");
    emit bidPlacers(msg.sender,msg.value);
    uint AmountAfterCharge = msg.value - ProductInstance.charge;
    if( msg.value > ProductInstance.highestBid) {
        ProductInstance.highestBidder = msg.sender;
        ProductInstance.highestBid = msg.value;
        if(block.timestamp >= ProductInstance.endTime)
        endAuction();
    }
    else{
        payable(msg.sender).transfer(AmountAfterCharge);
    }

}


function readAuction() public view  returns(uint,string memory,address,uint,bool,address){
return(ProductInstance.basePrice,ProductInstance.description,ProductInstance.highestBidder,ProductInstance.highestBid,ProductInstance.isClosed,owner);
}

//new owner can start the auction again
//@param _charge and _basePrice ,the new value to be set by the new owner.
//@dev new owner can start Auction again
function startAuction(uint _charge,uint _basePrice)public onlyOwner{
    require(ProductInstance.isClosed,"auction can't be started");
    ProductInstance.isClosed == false;
    ProductInstance.charge == _charge;
    ProductInstance.basePrice == _basePrice;
}


}