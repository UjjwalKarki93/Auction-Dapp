const { ethers, Contract } = require("ethers");

function call() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://bsc-dataseed.binance.org/"
  );
  const XThotWalletAddress = "0xe0a616c3659be29567e08819772e6905307adf21";
  const abi = [
    "event Transfer(address indexed from, address indexed to, uint amount)",
  ];
  const contractInstance = new Contract(XThotWalletAddress, abi, provider);

  let filter = contractInstance.filters.Transfer(null, XThotWalletAddress);
  // {
  //   address: 'dai.tokens.ethers.eth',
  //   topics: [
  //     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  //     null,
  //     '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72'
  //   ]
  // }
  contractInstance.on(filter, (from, to, amount, event) => {
    // The to will always be "address"
    console.log(` Active users: ${from}.`);
  });
}

call();
