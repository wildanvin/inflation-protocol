import React from "react";
import { useScaffoldContractWrite } from "../hooks/scaffold-eth";
import { BigNumber } from "ethers";

interface ClaimProps {
  time: BigNumber | undefined;
}

export const Claim: React.FC<ClaimProps> = ({ time }) => {
  const { writeAsync } = useScaffoldContractWrite({
    contractName: "FactoryCPI",
    functionName: "claimReward",
  });

  /*
  HANDLE DATES:
  */

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  function formatDate(unixTimestamp: any) {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString(undefined, options);
  }

  function addDaysToUnixTimestamp(unixTimestamp: any, days: any) {
    const millisecondsPerDay = 86400000; // 1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    const timestampInMilliseconds = unixTimestamp * 1000; // Convert Unix timestamp to milliseconds
    const targetTimestamp = timestampInMilliseconds + days * millisecondsPerDay;
    const targetUnixTimestamp = Math.floor(targetTimestamp / 1000); // Convert back to Unix timestamp
    return targetUnixTimestamp;
  }
  return (
    <div className="flex flex-col border border-gray-300 rounded-lg shadow-md px-6 py-6">
      <h2 className="text-2xl font-bold">3. Claim Reward</h2>
      <p className="my-0">
        {" "}
        <b>From: </b>
        {formatDate(addDaysToUnixTimestamp(time, 6))}
      </p>

      <button onClick={writeAsync} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Claim Reward
      </button>
    </div>
  );
};
