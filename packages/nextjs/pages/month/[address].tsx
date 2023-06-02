import { useRouter } from "next/router";
import { useCustomContractRead, useCustomContractWrite } from "../../hooks/scaffold-eth";
import type { NextPage } from "next";
import { Commit } from "~~/components/Commit";

const Address: NextPage = () => {
  const router = useRouter();

  const address: string = router.query.address?.toString() ?? "0x0";

  const { data: timeAtDeploy } = useCustomContractRead({
    contractName: "MonthlyCPI",
    functionName: "timeAtDeploy",
    address: address,
  });

  return (
    <>
      <div>Hello {address}</div>
      <div>Time at deploy is: {Number(timeAtDeploy)}</div>

      <div>
        <header className="py-10 px-8">
          <h1 className="text-4xl font-bold">Reveal Commit App</h1>
          <p className="mt-4 text-lg">App description goes here...</p>
        </header>

        <main className="container mx-auto py-10 px-8">
          <div className="grid grid-cols-3 gap-8">
            <Commit address={address} />

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
