import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCustomContractRead, useCustomContractWrite } from "../../hooks/scaffold-eth";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";

const Address: NextPage = () => {
  function getCommitInBytes(price0: BigNumber, price1: BigNumber, price2: BigNumber, price3: BigNumber): string {
    const encodedData = ethers.utils.solidityPack(
      ["uint256", "uint256", "uint256", "uint256"],
      [price0, price1, price2, price3],
    );
    const hash = ethers.utils.keccak256(encodedData);
    return hash;
  }

  interface CommitInput {
    input1: BigNumber;
    input2: BigNumber;
  }

  const [commitInput, setCommitInput] = useState<CommitInput>({
    input1: BigNumber.from("0"),
    input2: BigNumber.from("0"),
  });

  const handleCommitInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCommitInput(prevCommitInput => ({
      ...prevCommitInput,
      [name]: BigNumber.from(value),
    }));
  };

  const handleCommit = (event: React.FormEvent) => {
    event.preventDefault();
    // Perform commit logic here
  };

  const router = useRouter();

  const address: string = router.query.address?.toString() ?? "0x0";
  const [userCommit, setUserCommit] = useState("0x56553487f6661fa95bc98d8e92fd6d0332ce008bf8fce601aba2e2ef1846136e");

  const { data: timeAtDeploy } = useCustomContractRead({
    contractName: "MonthlyCPI",
    functionName: "timeAtDeploy",
    address: address,
  });

  const mystr = "0x56553487f6661fa95bc98d8e92fd6d0332ce008bf8fce601aba2e2ef1846136e";

  const { writeAsync, isLoading } = useCustomContractWrite({
    contractName: "MonthlyCPI",
    functionName: "commit",
    address: address,
    args: [`0x${userCommit}`],
    //args: [mystr],
  });

  return (
    <>
      {/* <div>Hello {address}</div>
      <div>Time at deploy is: {Number(timeAtDeploy)}</div>
      <button onClick={writeAsync}>click me</button> */}
      <div>
        <header className="py-10 px-8">
          <h1 className="text-4xl font-bold">Reveal Commit App</h1>
          <p className="mt-4 text-lg">App description goes here...</p>
        </header>

        <main className="container mx-auto py-10 px-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">Commit</h2>
              <p className="mt-2">Commit description goes here...</p>
              <form onSubmit={handleCommit}>
                <input
                  type="text"
                  className="mt-4 p-2 border border-gray-300 rounded"
                  placeholder="Enter number 1..."
                  name="input1"
                  value={commitInput.input1.toString()}
                  onChange={handleCommitInputChange}
                />
                <input
                  type="text"
                  className="mt-4 p-2 border border-gray-300 rounded"
                  placeholder="Enter number 2..."
                  name="input2"
                  value={commitInput.input2.toString()}
                  onChange={handleCommitInputChange}
                />
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                  Commit
                </button>
              </form>
            </div>

            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">Reveal</h2>
              <p className="mt-2">Reveal description goes here...</p>
              <input
                type="text"
                className="mt-4 p-2 border border-gray-300 rounded"
                placeholder="Enter numbers..."
                // value={revealInput}
                // onChange={handleRevealInputChange}
              />
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Reveal</button>
            </div>

            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">Claim Reward</h2>
              <p className="mt-2">Claim reward description goes here...</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Claim Reward</button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Address;
