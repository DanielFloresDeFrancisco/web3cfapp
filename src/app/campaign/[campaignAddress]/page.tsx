'use client';
import { client } from "@/app/client";
import { TierCard } from "@/app/components/TierCard";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getContract, prepareContractCall, ThirdwebContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { lightTheme, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";

export default function CampaignPage() {
    const account = useActiveAccount();
    const { campaignAddress } = useParams();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const contract = getContract({
        client: client,
        chain: sepolia,
        address: campaignAddress as string,
    });

    // Name of the campaign
    const { data: name, isLoading: isLoadingName } = useReadContract({
        contract: contract,
        method: "function name() view returns (string)",
        params: [],
    });

    // Description of the campaign
    const { data: description } = useReadContract({ 
        contract, 
        method: "function description() view returns (string)", 
        params: [] 
      });

    // Campaign deadline
    const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
        contract: contract,
        method: "function deadline() view returns (uint256)",
        params: [],
    });
    // Convert deadline to a date
    const deadlineDate = new Date(parseInt(deadline?.toString() as string) * 1000);
    // Check if deadline has passed
    const hasDeadlinePassed = deadlineDate < new Date();

    // Goal amount of the campaign
    const { data: goal, isLoading: isLoadingGoal } = useReadContract({
        contract: contract,
        method: "function goal() view returns (uint256)",
        params: [],
    });
    
    // Total funded balance of the campaign
    const { data: balance, isLoading: isLoadingBalance } = useReadContract({
        contract: contract,
        method: "function getContractBalance() view returns (uint256)",
        params: [],
    });

    // Calulate the total funded balance percentage
    const totalBalance = balance?.toString();
    const totalGoal = goal?.toString();
    let balancePercentage = (parseInt(totalBalance as string) / parseInt(totalGoal as string)) * 100;

    // If balance is greater than or equal to goal, percentage should be 100
    if (balancePercentage >= 100) {
        balancePercentage = 100;
    }

    // Get tiers for the campaign
    const { data: tiers, isLoading: isLoadingTiers } = useReadContract({
        contract: contract,
        method: "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
        params: [],
    });

    // Get owner of the campaign
    const { data: owner, isLoading: isLoadingOwner } = useReadContract({
        contract: contract,
        method: "function owner() view returns (address)",
        params: [],
    });

    // Get status of the campaign
    const { data: status } = useReadContract({ 
        contract, 
        method: "function state() view returns (uint8)", 
        params: [] 
      });
    
      return (
        <div className="mx-auto max-w-7xl px-4 mt-6 text-white">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            {!isLoadingName && (
              <h1 className="text-4xl font-bold text-orange-400">{name}</h1>
            )}
            {owner === account?.address && (
              <div className="flex gap-2 mt-4 md:mt-0">
                {isEditing && (
                  <span className="px-3 py-1 text-sm bg-gray-700 rounded-xl">
                    Status:
                    <span className="font-medium ml-1">
                      {status === 0 ? "Active" : status === 1 ? "Successful" : status === 2 ? "Failed" : "Unknown"}
                    </span>
                  </span>
                )}
                <button
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 transition rounded-xl text-white font-semibold"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Done" : "Edit"}
                </button>
              </div>
            )}
          </div>
      
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">Description</h2>
            <p className="text-gray-300">{description}</p>
          </div>
      
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">Deadline</h2>
            {!isLoadingDeadline && (
              <p className="text-gray-300">{deadlineDate.toDateString()}</p>
            )}
          </div>
      
          {!isLoadingBalance && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">
                Goal: <span className="text-orange-400">${goal?.toString()}</span>
              </h2>
              <div className="relative w-full h-6 bg-slate-800 rounded-full">
                <div
                  className="h-full bg-orange-500 rounded-full text-right transition-all duration-300"
                  style={{ width: `${balancePercentage}%` }}
                >
                  <span className="text-xs text-white px-2">{`$${balance?.toString()}`}</span>
                </div>
                <span className="absolute top-0 right-2 text-xs text-gray-200">
                  {balancePercentage >= 100 ? "Funded!" : `${balancePercentage.toFixed(1)}%`}
                </span>
              </div>
            </div>
          )}
      
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Tiers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {isLoadingTiers ? (
                <p className="text-gray-400">Loading...</p>
              ) : tiers && tiers.length > 0 ? (
                tiers.map((tier, index) => (
                  <TierCard
                    key={index}
                    tier={tier}
                    index={index}
                    contract={contract}
                    isEditing={isEditing}
                  />
                ))
              ) : !isEditing ? (
                <p className="text-gray-400">No tiers available</p>
              ) : null}
      
              {isEditing && tiers.length < 3 && (
                <button
                  className="h-full min-h-[120px] flex flex-col items-center justify-center border-2 border-dashed border-orange-500 rounded-xl text-orange-400 hover:bg-orange-900/10 transition font-medium"
                  onClick={() => setIsModalOpen(true)}
                >
                  + Add Tier
                </button>
              )}
            </div>
          </div>
      
          {isModalOpen && (
            <CreateCampaignModal
              setIsModalOpen={setIsModalOpen}
              contract={contract}
            />
          )}
        </div>
      );
      
}

type CreateTierModalProps = {
    setIsModalOpen: (value: boolean) => void
    contract: ThirdwebContract
}

const CreateCampaignModal = (
    { setIsModalOpen, contract }: CreateTierModalProps
) => {
    const [tierName, setTierName] = useState<string>("");
    const [tierAmount, setTierAmount] = useState<bigint>(1n);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
            <div className="w-1/2 bg-slate-100 p-6 rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold">Create a Funding Tier</p>
                    <button
                        className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
                        onClick={() => setIsModalOpen(false)}
                    >Close</button>
                </div>
                <div className="flex flex-col">
                    <label>Tier Name:</label>
                    <input 
                        type="text" 
                        value={tierName}
                        onChange={(e) => setTierName(e.target.value)}
                        placeholder="Tier Name"
                        className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
                    />
                    <label>Tier Cost:</label>
                    <input 
                        type="number"
                        value={parseInt(tierAmount.toString())}
                        onChange={(e) => setTierAmount(BigInt(e.target.value))}
                        className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
                    />
                    <TransactionButton
                        transaction={() => prepareContractCall({
                            contract: contract,
                            method: "function addTier(string _name, uint256 _amount)",
                            params: [tierName, tierAmount]
                        })}
                        onTransactionConfirmed={async () => {
                            alert("Tier added successfully!")
                            setIsModalOpen(false)
                        }}
                        onError={(error) => alert(`Error: ${error.message}`)}
                        theme={lightTheme()}
                    >Add Tier</TransactionButton>
                </div>
            </div>
        </div>
    )
}