async function main() {
  const basePrice = ethers.utils.parseEther("0.0001");
  const description = "apple";
  //in wei
  const charge = 100000;

  const auctionContract = await ethers.getContractFactory("auction");
  const deployedContract = await auctionContract.deploy(
    basePrice,
    description,
    charge
  );
  await deployedContract.deployed();
  console.log(`deployed address: ${deployedContract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
