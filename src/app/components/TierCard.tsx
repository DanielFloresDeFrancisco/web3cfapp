import { prepareContractCall, ThirdwebContract } from "thirdweb";
import { TransactionButton } from "thirdweb/react";

type Tier = {
  name: string;
  amount: bigint;
  backers: bigint;
};

type TierCardProps = {
  tier: Tier;
  index: number;
  contract: ThirdwebContract;
  isEditing: boolean;
};

export const TierCard: React.FC<TierCardProps> = ({ tier, index, contract, isEditing }) => {
  return (
    <div className="p-5 bg-slate-900 border border-slate-700 rounded-2xl shadow-md hover:shadow-lg hover:shadow-orange-500 transition duration-300 flex flex-col justify-between text-white">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">{tier.name}</h3>
          <p className="text-lg text-orange-400 font-medium">
            {Number(tier.amount) / 1e18} Sepolia ETH
          </p>
        </div>
        <p className="text-sm text-gray-300">Total Backers: {tier.backers.toString()}</p>
      </div>

      <TransactionButton
        transaction={() =>
          prepareContractCall({
            contract: contract,
            method: "function fund(uint256 _tierIndex) payable",
            params: [BigInt(index)],
            value: tier.amount,
          })
        }
        onError={(error) => alert(`Error: ${error.message}`)}
        onTransactionConfirmed={async () => alert("Funded successfully!")}
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-2xl transition-colors duration-200 cursor-pointer"
      >
        Select
      </TransactionButton>

      {isEditing && (
        <TransactionButton
          transaction={() =>
            prepareContractCall({
              contract: contract,
              method: "function removeTier(uint256 _index)",
              params: [BigInt(index)],
            })
          }
          onError={(error) => alert(`Error: ${error.message}`)}
          onTransactionConfirmed={async () => alert("Removed successfully!")}
          className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-2xl transition-colors duration-200 cursor-pointer"
        >
          Remove
        </TransactionButton>
      )}
    </div>
  );
};
