// scripts/interactWithContract.ts

import { BigNumber } from "ethers";
import { ethers } from "hardhat";

async function main() {
  function getCommitInBytes(price0: BigNumber, price1: BigNumber, price2: BigNumber, price3: BigNumber): string {
    const encodedData = ethers.utils.solidityPack(
      ["uint256", "uint256", "uint256", "uint256"],
      [price0, price1, price2, price3],
    );
    const hash = ethers.utils.keccak256(encodedData);
    return hash;
  }

  /*
    price0 = 700  * 10**18;  //$700 colombian pesos for 1 kw-hour
    price1 = 3100 * 10**18;  //$3100 comlombian pesos for 1 liter of gas
    price2 = 4600 * 10**18;  //$4600 colombian pesos for 1 liter of milk
    price3 = 75000  * 10**18;  //$75000 colombian pesos   for Internet 10 mbps upload speed (1 month)
  */

  const contractAddress = "0x9d4454B023096f34B160D6B654540c56A1F81688"; // Replace with your contract address
  const commit0 = getCommitInBytes(
    ethers.utils.parseEther("710"),
    ethers.utils.parseEther("3200"),
    ethers.utils.parseEther("4500"),
    ethers.utils.parseEther("75500"),
  );
  const commit1 = getCommitInBytes(
    ethers.utils.parseEther("700"),
    ethers.utils.parseEther("3100"),
    ethers.utils.parseEther("4600"),
    ethers.utils.parseEther("76000"),
  );
  const commit2 = getCommitInBytes(
    ethers.utils.parseEther("700"),
    ethers.utils.parseEther("2990"),
    ethers.utils.parseEther("4550"),
    ethers.utils.parseEther("75000"),
  );
  const commit3 = getCommitInBytes(
    ethers.utils.parseEther("690"),
    ethers.utils.parseEther("3000"),
    ethers.utils.parseEther("4700"),
    ethers.utils.parseEther("76000"),
  );

  //const account = (await ethers.getSigners())[5];
  const [account0, account1, account2, account3] = await ethers.getSigners();

  //Interact from account0
  const Contract0 = await ethers.getContractFactory("MonthlyCPI", account0);
  const contract0 = await Contract0.attach(contractAddress);

  const tx0 = await contract0.commit(commit0);
  console.log("Committed from address:", account0.address);
  await tx0.wait();

  //Interact from account1
  const Contract1 = await ethers.getContractFactory("MonthlyCPI", account1);
  const contract1 = await Contract1.attach(contractAddress);

  const tx1 = await contract1.commit(commit1);
  console.log("Committed from address:", account1.address);
  await tx1.wait();

  //Interact from account2
  const Contract2 = await ethers.getContractFactory("MonthlyCPI", account2);
  const contract2 = await Contract2.attach(contractAddress);

  const tx2 = await contract2.commit(commit2);
  console.log("Committed from address:", account2.address);
  await tx2.wait();

  //Interact from account3
  const Contract3 = await ethers.getContractFactory("MonthlyCPI", account3);
  const contract3 = await Contract3.attach(contractAddress);

  const tx3 = await contract3.commit(commit3);
  console.log("Committed from address:", account3.address);
  await tx3.wait();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
