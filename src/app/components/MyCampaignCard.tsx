import { client } from "@/app/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

type MyCampaignCardProps = {
    contractAddress: string;
};

export const MyCampaignCard: React.FC<MyCampaignCardProps> = ({ contractAddress }) => {
    const contract = getContract({
        client: client,
        chain: sepolia,
        address: contractAddress,
    });

    const { data: name } = useReadContract({
        contract,
        method: "function name() view returns (string)",
        params: []
    });

    const { data: description } = useReadContract({
        contract,
        method: "function description() view returns (string)",
        params: []
    });

    return (
        <div className="flex flex-col justify-between max-w-sm p-6 bg-zinc-900 border-2 border-orange-500 rounded-2xl shadow-lg hover:shadow-orange-500/20 transition-shadow duration-300">
            <div>
                <h5 className="mb-2 text-2xl font-semibold text-white">{name}</h5>
                <p className="mb-4 text-sm text-zinc-300">{description}</p>
            </div>

            <Link href={`/campaign/${contractAddress}`} passHref>
                <p className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-xl hover:scale-105 transition-transform duration-200">
                    View Campaign
                    <svg
                        className="rtl:rotate-180 w-4 h-4 ms-2"
                        aria-hidden="true"
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
