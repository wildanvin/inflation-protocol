// scripts/interactWithContract.ts

import { ethers } from "hardhat";

async function main() {
  function getCommitInBytes(price0: number, price1: number, price2: number, price3: number): string {
    const encodedData = ethers.utils.solidityPack(
      ["uint256", "uint256", "uint256", "uint256"],
      [price0, price1, price2, price3],
    );
    const hash = ethers.utils.keccak256(encodedData);
    return hash;
  }

  const account = (await ethers.getSigners())[0];
  const contractAddress = "0xf5059a5D33d5853360D16C683c16e67980206f36"; // Replace with your contract address
  const Contract = await ethers.getContractFactory("MonthlyCPI"); // Replace with your contract name
  const contract = await Contract.attach(contractAddress);

  // Interact with the contract
  const commit1 = getCommitInBytes(110, 10, 10, 10);
  console.log("committing with", commit1);

  const tx = await contract.commit(commit1);
  console.log("Transaction hash:", tx.hash);
  console.log("Committed with account:", account.address);

  // Wait for the transaction to be mined
  await tx.wait();
  console.log("Transaction confirmed");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
