//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

//@title A simple auction contract for a product where multiple auctions can be done after transfer of ownership
contract auction {

    address payable public owner;
    struct product{
        
        uint basePrice;
        string description;
        uint charge;
        bool isClosed;
        uint highestBid;
        address highestBidder;
        
    }
    mapping(address => uint) trackBids;
        mapping(address => uint) trackIncrement;
        address[] public bidders;

product ProductInstance;

event auctionEnded (address indexed buyer,uint indexed FinalPrice );
event newAuction(uint indexed basePrice,uint charge,address indexed owner);
event bidPlacers(address indexed bidders,uint prevBid,uint incrementAmount,uint recBid);



    constructor(uint _basePrice,string memory _description,uint _charge){
    owner = payable(msg.sender);
    ProductInstance.basePrice = _basePrice;
    ProductInstance.description = _description;
    ProductInstance.charge = _charge;
    ProductInstance.isClosed = false;
    ProductInstance.highestBidder = address(0);
    }

modifier onlyOwner{
    require(owner == msg.sender,"only owner is allowed");
    _;
}


function endAuction() public onlyOwner{
       ProductInstance.isClosed = true;
       //only transfers charges collected inside contract to the owner
        owner.transfer(address(this).balance);
}
function claimProduct() public payable {
   
    require(ProductInstance.isClosed ,"owner hasnot ended auction");
     require(ProductInstance.highestBidder == msg.sender,"you are not he highest bidder");
    require(ProductInstance.highestBid > 0,"bid is not done on the product");
    owner = payable(ProductInstance.highestBidder);  
    emit auctionEnded(owner,ProductInstance.highestBid);
}


//@dev places the bid 
function placeBid()public payable{
    require(ProductInstance.isClosed == false,"the auction is closed");
    require(msg.value > 0 && msg.value >= ProductInstance.basePrice,"amount cant be zero");
    require(msg.value+trackIncrement[msg.sender] > ProductInstance.highestBid,"less than the bid amount");
  
          trackBids[msg.sender]=msg.value;
            trackIncrement[msg.sender] += trackBids[msg.sender];
            emit bidPlacers(msg.sender,trackIncrement[msg.sender]-trackBids[msg.sender],msg.value,trackIncrement[msg.sender]);

      uint AmountAfterCharge = trackBids[msg.sender]-ProductInstance.charge;   
        ProductInstance.highestBidder = msg.sender;
        ProductInstance.highestBid = trackIncrement[msg.sender];
        payable(msg.sender).transfer(AmountAfterCharge);
        

        
       
    

    }
   




function readAuction() public view  returns(uint,string memory,address,uint,bool,address,uint){
return(ProductInstance.basePrice,ProductInstance.description,ProductInstance.highestBidder,ProductInstance.highestBid,ProductInstance.isClosed,owner,ProductInstance.charge);
}

function getOwner() public view returns(address){
    return owner;
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