import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCustomContractRead, useCustomContractWrite } from "../../hooks/scaffold-eth";
import type { NextPage } from "next";

const Address: NextPage = () => {
  const router = useRouter();

  const address: string = router.query.address?.toString() ?? "0x0";
  //const [userCommit, setUserCommit] = useState("0x1");

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
    //args: ["0x1"],
    args: [mystr],
  });

  return (
    <>
      <div>Hello {address}</div>
      <div>Time at deploy is: {Number(timeAtDeploy)}</div>
      <button onClick={writeAsync}>click me</button>
    </>
  );
};

export default Address;
