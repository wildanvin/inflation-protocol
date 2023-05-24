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

  const contractAddress = "0x9d4454B023096f34B160D6B654540c56A1F81688"; // Replace with your contract address
  const commit0 = getCommitInBytes(110, 10, 10, 10);
  const commit1 = getCommitInBytes(110, 10, 101, 10);

  //const account = (await ethers.getSigners())[5];
  const [account0, account1] = await ethers.getSigners();

  //Interact with account0
  const Contract0 = await ethers.getContractFactory("MonthlyCPI", account0);
  const contract0 = await Contract0.attach(contractAddress);

  const tx0 = await contract0.commit(commit0);
  console.log("Committed with address:", account0.address);
  await tx0.wait();

  //Interact with account1
  const Contract1 = await ethers.getContractFactory("MonthlyCPI", account1);
  const contract1 = await Contract1.attach(contractAddress);

  const tx1 = await contract1.commit(commit1);
  console.log("Committed with address:", account1.address);
  await tx1.wait();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
