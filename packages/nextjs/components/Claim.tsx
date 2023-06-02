import React from "react";
import { useState } from "react";
import { useScaffoldContractWrite } from "../hooks/scaffold-eth";
import { ethers } from "ethers";

export const Claim: React.FC = () => {
  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "FactoryCPI",
    functionName: "claimReward",
  });
  return (
    <div className="flex flex-col border border-gray-300 rounded-lg shadow-md px-6 py-6">
      <h2 className="text-2xl font-bold">Claim Reward</h2>
      <p className="mt-2">Claim reward description goes here...</p>
      <button onClick={writeAsync} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Claim Reward
      </button>
    </div>
  );
};
