'use client';
import { client } from "@/app/client";
import Link from "next/link";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import Image from 'next/image';
import thirdwebIcon from "@public/thirdweb.svg";

const Navbar = () => {
    const account = useActiveAccount();

    return (
        <nav className="bg-black border-b-4 border-orange-500 shadow-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Image
                            src={thirdwebIcon}
                            alt="Logo"
                            width={32}
                            height={32}
                            style={{
                                filter: "drop-shadow(0px 0px 24px #ffa726a8)",
                            }}
                        />
                    </div>

                    {/* Nav links */}
                    <div className="hidden sm:flex space-x-6">
                        <Link href="/">
                            <p className="mb-2 text-xl font-semibold tracking-tight text-white hover:text-orange-400 text-sm font-medium transition-colors duration-200">
                                Explore   
                            </p>
                        </Link>
                        {account && (
                            <Link href={`/dashboard/${account?.address}`}>
                                <p className="mb-2 text-xl font-semibold tracking-tight text-white hover:text-orange-400 text-sm font-medium transition-colors duration-200">
                                    My Dashboard
                                </p>
                            </Link>
                        )}
                    </div>

                    {/* Connect Button */}
                    <div className="flex items-center">
                        <ConnectButton
                            client={client}
                            connectButton={{
                                label: "Connect Wallet",
                                style: {
                                    backgroundColor: "#f97316", // orange-500
                                    color: "#fff",
                                    borderRadius: "0.5rem",
                                    padding: "0.5rem 1rem",
                                    fontWeight: "500",
                                    fontSize: "0.875rem",
                                    transition: "transform 0.2s ease",
                                },
                                className: "hover:scale-105",
                            }}
                            detailsButton={false}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
