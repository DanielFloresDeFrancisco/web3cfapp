import { client } from "@/app/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

type CampaignCardProps = {
  campaignAddress: string;
};

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaignAddress }) => {
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: campaignAddress,
  });

  const { data: campaignName } = useReadContract({
    contract: contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: campaignDescription } = useReadContract({
    contract: contract,
    method: "function description() view returns (string)",
    params: [],
  });

  const { data: goal } = useReadContract({
    contract: contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    contract: contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  const totalBalance = balance?.toString() || "0";
  const totalGoal = goal?.toString() || "1";
  let balancePercentage =
    (parseInt(totalBalance) / parseInt(totalGoal)) * 100;

  if (balancePercentage >= 100) balancePercentage = 100;

  return (
    <div className="flex flex-col justify-between w-full max-w-sm p-6 bg-black border-4 border-orange-500 rounded-3xl shadow-lg transition duration-300 hover:shadow-orange-500/30">
      <div>
        {!isLoadingBalance && (
          <div className="mb-4">
            <div className="relative w-full h-4 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-4 bg-orange-500 rounded-full text-xs text-black text-right pr-2 flex items-center justify-end transition-all duration-300"
                style={{ width: `${balancePercentage}%` }}
              >
                {balancePercentage >= 100 ? "Goal Reached" : `${balancePercentage.toFixed(0)}%`}
              </div>
            </div>
          </div>
        )}

        <h5 className="mb-2 text-xl font-semibold tracking-tight text-white">
          {campaignName || "Loading..."}
        </h5>

        <p className="mb-4 text-sm text-gray-300">
          {campaignDescription || "No description available."}
        </p>
      </div>

      <Link href={`/campaign/${campaignAddress}`} passHref>
        <p className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg transform transition-transform duration-200 hover:scale-105">
          View Campaign
          <svg
            className="w-4 h-4 ml-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </p>
      </Link>
    </div>
  );
};
