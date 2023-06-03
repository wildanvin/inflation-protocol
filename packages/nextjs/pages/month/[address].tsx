import { useRouter } from "next/router";
import { useCustomContractRead, useCustomContractWrite } from "../../hooks/scaffold-eth";
import type { NextPage } from "next";
import { Claim } from "~~/components/Claim";
import { Commit } from "~~/components/Commit";
import { Reveal } from "~~/components/Reveal";
import { Address as AddressComp } from "~~/components/scaffold-eth";

const Address: NextPage = () => {
  const router = useRouter();

  const address: string = router.query.address?.toString() ?? "0x0";

  const { data: timeAtDeploy } = useCustomContractRead({
    contractName: "MonthlyCPI",
    functionName: "timeAtDeploy",
    address: address,
  });

  function formatDate(unixTimestamp: any) {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString("en-us", { year: "numeric", month: "short" });
  }

  return (
    <>
      <div>
        <header className="pt-10 pb-0 px-8">
          <h1 className="text-4xl font-bold">Data for: {formatDate(timeAtDeploy)}</h1>
          <AddressComp address={address} />
        </header>

        <main className="container mx-auto py-10 px-8">
          <div className="grid grid-cols-3 gap-8">
            {/* <Commit address={"0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d"} />
            <Reveal address={"0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d"} /> */}

            <Commit address={address} />
            <Reveal address={address} />
            <Claim />
          </div>
        </main>
      </div>
    </>
  );
};

export default Address;
