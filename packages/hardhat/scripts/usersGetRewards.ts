// scripts/interactWithContract.ts

import { factoryCPI } from "./adresses";
import { ethers } from "hardhat";

async function main() {
  const contractAddress = factoryCPI;

  //const account = (await ethers.getSigners())[5];
  const [account0, account1, account2, account3] = await ethers.getSigners();

  //Interact from account0
  const Contract0 = await ethers.getContractFactory("FactoryCPI", account0);
  const contract0 = await Contract0.attach(contractAddress);

  const tx0 = await contract0.claimReward();
  console.log("Claimed from address:", account0.address);
  await tx0.wait();

  //Interact from account1
  const Contract1 = await ethers.getContractFactory("FactoryCPI", account1);
  const contract1 = await Contract1.attach(contractAddress);

  const tx1 = await contract1.claimReward();
  console.log("Claimed from address:", account1.address);
  await tx1.wait();

  //Interact from account2
  const Contract2 = await ethers.getContractFactory("FactoryCPI", account2);
  const contract2 = await Contract2.attach(contractAddress);

  const tx2 = await contract2.claimReward();
  console.log("Claimed from address:", account2.address);
  await tx2.wait();

  //Interact from account3
  const Contract3 = await ethers.getContractFactory("FactoryCPI", account3);
  const contract3 = await Contract3.attach(contractAddress);

  const tx3 = await contract3.claimReward();
  console.log("Claimed from address:", account3.address);
  await tx3.wait();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
