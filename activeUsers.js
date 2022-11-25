// const PETNaddress = "0x57457B5D725D85A70a3625D6a71818304e773618"
// const hotWalletAddress = "0xe0a616c3659be29567e08819772e6905307adf21";
// const filter = {
//     address: PETNaddress,
//     topics: [
//         utils.id("Transfer(address,address,uint256)"),
//         null,
//         hexZeroPad(myAddress, 32)
//     ]
//     };
const filter = contract.filters.Transfer(null, hotWalletAddress);
// {
//   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
//   topics: [
//     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
//     null,
//     '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72'
//   ]
// }

contract.on(filter, (from, To, Amount, event) => {
  console.log(`transfer from ${from}`);
});
