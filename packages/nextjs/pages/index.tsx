import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Address } from "../components/scaffold-eth";
import type { NextPage } from "next";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface Month {
  id: string;
  name: string;
}

const Home: NextPage = () => {
  const { data: cpisArray } = useScaffoldContractRead({
    contractName: "FactoryCPI",
    functionName: "getCPIsArray",
  });

  const [availableMonths, setAvailableMonths] = useState<Month[]>([
    { id: "1", name: "January" },
    { id: "2", name: "February" },
    { id: "3", name: "March" },
    // Add more months as needed
  ]);

  return (
    <>
      <Head>
        <title>Inflation Protocol</title>
        <meta name="description" content="Created with 🏗 scaffold-eth-2" />
      </Head>

      <div className="grid grid-cols-3 gap-4 p-4 md:p-8">
        {cpisArray?.map(address => (
          <Link key={address} href={`/month/${address}`}>
            <div className="bg-gray-200 p-4 rounded-lg">
              <span className="text-gray-800">
                <Address address={address} />
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 p-4 md:p-8">
        {availableMonths.map(month => (
          <Link key={month.id} href={`/month/${month.id}`}>
            <div className="bg-gray-200 p-4 rounded-lg">
              <span className="text-gray-800">{month.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
