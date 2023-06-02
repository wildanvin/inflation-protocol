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
    price0: number;
    price1: number;
    price2: number;
    price3: number;
  }

  const [commitInput, setCommitInput] = useState<CommitInput>({
    price0: 0,
    price1: 0,
    price2: 0,
    price3: 0,
  });

  const [userCommit, setUserCommit] = useState("");

  const handleCommitInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { name, value } = event.target;
      setCommitInput(prevCommitInput => ({
        ...prevCommitInput,
        [name]: value,
      }));

      // const commit = getCommitInBytes(
      //   ethers.utils.parseEther(commitInput.price0.toString()),
      //   ethers.utils.parseEther(commitInput.price1.toString()),
      //   ethers.utils.parseEther(commitInput.price2.toString()),
      //   ethers.utils.parseEther(commitInput.price3.toString()),
      // );
      // setUserCommit(commit);
      // console.log(commitInput);
    } catch (error) {
      // Code to handle the exception
      console.error("An error occurred:", error);
    }
  };

  const handleCommit = (event: React.FormEvent) => {
    event.preventDefault();
    // const commit = getCommitInBytes(
    //   ethers.utils.parseEther(commitInput.price0.toString()),
    //   ethers.utils.parseEther(commitInput.price1.toString()),
    //   ethers.utils.parseEther(commitInput.price2.toString()),
    //   ethers.utils.parseEther(commitInput.price3.toString()),
    // );
    // setUserCommit(commit);
    console.log(`The commit is: ${userCommit}`);
    writeAsync();
  };

  useEffect(() => {
    const commit = getCommitInBytes(
      ethers.utils.parseEther(commitInput.price0.toString()),
      ethers.utils.parseEther(commitInput.price1.toString()),
      ethers.utils.parseEther(commitInput.price2.toString()),
      ethers.utils.parseEther(commitInput.price3.toString()),
    );
    setUserCommit(commit);
  }, [commitInput]);

  const router = useRouter();

  const address: string = router.query.address?.toString() ?? "0x0";

  const { data: timeAtDeploy } = useCustomContractRead({
    contractName: "MonthlyCPI",
    functionName: "timeAtDeploy",
    address: address,
  });

  const { writeAsync, isLoading } = useCustomContractWrite({
    contractName: "MonthlyCPI",
    functionName: "commit",
    //address: address,
    address: "0x36C02dA8a0983159322a80FFE9F24b1acfF8B570",
    args: [userCommit],
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
                  type="number"
                  className="mt-4 p-2 border border-gray-300 rounded text-gray-900"
                  placeholder="Enter number 1..."
                  name="price0"
                  value={commitInput.price0.toString()}
                  onChange={handleCommitInputChange}
                />
                <input
                  type="number"
                  className="mt-4 p-2 border border-gray-300 rounded text-gray-900"
                  placeholder="Enter number 2..."
                  name="price1"
                  value={commitInput.price1.toString()}
                  onChange={handleCommitInputChange}
                />
                <input
                  type="number"
                  className="mt-4 p-2 border border-gray-300 rounded text-gray-900"
                  placeholder="Enter number 3..."
                  name="price2"
                  value={commitInput.price2.toString()}
                  onChange={handleCommitInputChange}
                />
                <input
                  type="number"
                  className="mt-4 p-2 border border-gray-300 rounded text-gray-900"
                  placeholder="Enter number 4..."
                  name="price3"
                  value={commitInput.price3.toString()}
                  onChange={handleCommitInputChange}
                />
                <br />
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
