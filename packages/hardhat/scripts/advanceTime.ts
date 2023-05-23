// npx hardhat run scripts/advanceTime.ts

import { ethers } from "hardhat";

async function main() {
  // Get the current timestamp
  const blockNumber = await ethers.provider.getBlockNumber();
  const currentBlock = await ethers.provider.getBlock(blockNumber);
  const currentTimestamp = currentBlock.timestamp;

  console.log("Current timestamp:", currentTimestamp);

  // Advance the time by 30 days (3600 * 24 * 30 seconds)
  const thirtyDaysInSecs = 2592000;
  const newTimestamp = currentTimestamp + thirtyDaysInSecs;

  // Modify the timestamp of the next block
  await ethers.provider.send("evm_setNextBlockTimestamp", [newTimestamp]);

  console.log("Time advanced to:", newTimestamp);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
