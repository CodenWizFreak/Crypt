'use client'
import { useEffect, useState } from "react";

// Extend the Window interface to include wallet properties
declare global {
  interface Window {
    ethereum: any;
    aptos: any;
  }
}
import { ethers } from "ethers";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wallet,
  GamepadIcon,
  Trophy,
  Coins,
  Brain,
  Map,
  Puzzle,
  Target,
  Linkedin,
  Instagram,
} from "lucide-react";
import StarryBackground from "@/components/starry-background";
import Navigation from "@/components/navigation";
import TeamCarousel from "@/components/team-carousel";
import PrivacyAccordion from "@/components/privacy-accordion";
import ScrollButton from "@/components/scroll-button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletType, setWalletType] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const walletConfigs = [
    {
      name: "Petra",
      logo: "/petra.jpeg",  // Add the path to the Petra logo image
      check: () => typeof window !== "undefined" && window.aptos,
      connect: async () => {
        const response = await window.aptos.connect();
        return response.address;
      }
    },
    {
      name: "Rainbow",
      logo: "/rainbow.png",  // Add the path to the Rainbow logo image
      check: () => typeof window !== "undefined" && window.ethereum?.isRainbow,
      connect: async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        return await signer.getAddress();
      }
    },
    {
      name: "MetaMask",
      logo: "/metamask.webp",  // Add the path to the MetaMask logo image
      check: () => typeof window !== "undefined" && window.ethereum?.isMetaMask,
      connect: async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        return await signer.getAddress();
      }
    },
    {
      name: "Coinbase",
      logo: "/coinbase.png",  // Add the path to the Coinbase logo image
      check: () => typeof window !== "undefined" && window.ethereum?.isCoinbaseWallet,
      connect: async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        return await signer.getAddress();
      }
    }
  ];

  const connectWallet = async (walletConfig: { name: any; check?: () => any; connect: any; }) => {
    try {
      setIsConnecting(true);
      const address = await walletConfig.connect();
      setWalletAddress(address);
      setWalletType(walletConfig.name);
      localStorage.setItem("walletAddress", address);
      localStorage.setItem("walletType", walletConfig.name);

      setIsDialogOpen(false);

      // Send wallet address to FastAPI backend if it's a Petra wallet
      if (walletConfig.name === "Petra") {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/connect-wallet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address }),
          });

          if (!response.ok) {
            throw new Error('Failed to connect wallet with backend');
          }
        } catch (error) {
          console.error("Error connecting to backend:", error);
          // Continue with frontend connection even if backend fails
        }
      }
    } catch (error) {
      console.error(`Error connecting to ${walletConfig.name}:`, error);
      alert(`Error connecting to ${walletConfig.name}. Please make sure the wallet is installed and try again.`);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    // Disconnect from backend if it's a Petra wallet
    if (walletType === "Petra") {
      try {
        await fetch('http://127.0.0.1:8000/api/disconnect-wallet', {
          method: 'POST',
        });
      } catch (error) {
        console.error("Error disconnecting from backend:", error);
      }
    }

    setWalletAddress("");
    setWalletType("");
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("walletType");
  };

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    const savedType = localStorage.getItem("walletType");
    if (savedAddress && savedType) {
      setWalletAddress(savedAddress);
      setWalletType(savedType);
    }

    // Handle wallet disconnection request from Streamlit
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "streamlit_disconnect" && e.newValue === "true") {
        disconnectWallet();
        localStorage.removeItem("streamlit_disconnect");
      }
    };

    // Check for disconnection flag on page load
    const disconnectFlag = localStorage.getItem("streamlit_disconnect");
    if (disconnectFlag === "true") {
      disconnectWallet();
      localStorage.removeItem("streamlit_disconnect");
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const shortenAddress = (address: string | any[]) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-black text-white relative">
      <StarryBackground />
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center text-center px-4">
        <div className="container mx-auto space-y-8 relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text bg-200% animate-gradient-x">
              Cryptonian
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            Learn Web3, History & Geography through Gamified Experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-transform"
              onClick={() => {
                if (walletAddress) {
                  // Redirect to Streamlit dashboard with wallet address
                  window.location.href = `http://localhost:8502?wallet=${walletAddress}`;
                } else {
                  alert("Please connect your wallet first!");
                }
              }}
            >
              Get Started
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500 bg-transparent text-white hover:bg-purple-900/20 group relative overflow-hidden"
                  disabled={isConnecting}
                  onClick={() => setIsDialogOpen(true)}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity" />
                  <Wallet className="h-5 w-5 text-white mr-2" />
                  <span>
                    {walletAddress 
                      ? `${walletType}: ${shortenAddress(walletAddress)}`
                      : (isConnecting ? "Connecting..." : "Connect Wallet")}
                  </span>
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-black border-purple-500 text-white fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-black/90 p-6 rounded-lg border border-purple-500/30 backdrop-blur-sm max-w-md w-full">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Connect Wallet</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {walletConfigs.map((config) => (
                      config.check() && (
                        <Button
                          key={config.name}
                          onClick={() => connectWallet(config)}
                          className="flex items-center justify-center p-4 bg-gray-900 hover:bg-gray-800 rounded-lg border border-purple-500 transition-colors"
                          disabled={isConnecting}
                        >
                          <Image 
                            src={config.logo} 
                            alt={config.name} 
                            width={50} 
                            height={50} 
                            className="h-8 w-8"
                          />
                        </Button>
                      )
                    ))}
                  </div>

                  {walletAddress && (
                    <Button
                      onClick={disconnectWallet}
                      variant="destructive"
                      className="mt-4 w-full"
                    >
                      Disconnect
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {walletAddress && (
            <p className="text-gray-300">
              Connected Wallet: {shortenAddress(walletAddress)}
            </p>
          )}
          
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 min-h-screen flex items-center">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Explore Our Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm transform hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center space-y-4">
                <Brain className="h-16 w-16 mx-auto text-purple-500" />
                <h3 className="text-xl font-semibold">Learning Modules</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>Web3 Fundamentals</li>
                  <li>Blockchain Technology</li>
                  <li>Smart Contracts</li>
                  <li>NFTs & GameFi</li>
                  <li>DeFi Basics</li>
                  <li>Crypto Economics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm transform hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center space-y-4">
                <Map className="h-16 w-16 mx-auto text-purple-500" />
                <h3 className="text-xl font-semibold">Geography Quest</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>Indian States & Capitals</li>
                  <li>Rivers & Mountains</li>
                  <li>Cultural Landmarks</li>
                  <li>Interactive Maps</li>
                  <li>Historical Sites</li>
                  <li>Geographical Wonders</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm transform hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center space-y-4">
                <Puzzle className="h-16 w-16 mx-auto text-purple-500" />
                <h3 className="text-xl font-semibold">Historical Puzzles</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>Freedom Fighters</li>
                  <li>Ancient Dynasties</li>
                  <li>Monument Scanner</li>
                  <li>Timeline Challenges</li>
                  <li>Historical Quests</li>
                  <li>Artifact Mysteries</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm transform hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center space-y-4">
                <Target className="h-16 w-16 mx-auto text-purple-500" />
                <h3 className="text-xl font-semibold">Gamification</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>Token Rewards</li>
                  <li>NFT Achievements</li>
                  <li>Leaderboards</li>
                  <li>Progress Tracking</li>
                  <li>Daily Challenges</li>
                  <li>Skill Trees</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 min-h-screen flex items-center">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                Learn Through Play
              </h2>
              <p className="text-gray-200 text-lg">
                Cryptonian combines education with blockchain technology to create an immersive learning experience.
                Master Indian history and geography while earning rewards in our gamified ecosystem.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <GamepadIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Interactive Games</h3>
                    <p className="text-gray-300">Engage with our collection of educational games and puzzles</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <Trophy className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Achievement System</h3>
                    <p className="text-gray-300">Earn NFTs and tokens as you progress through levels</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <Coins className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Reward Marketplace</h3>
                    <p className="text-gray-300">Trade and collect unique NFTs in our marketplace</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-30 blur-xl animate-pulse" />
              <Image
                src="/meta.jpg"
                width={600}
                height={600}
                alt="About Cryptonian"
                className="relative rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-4 min-h-screen flex items-center">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Meet Our Team
          </h2>
          <TeamCarousel />
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section id="privacy" className="py-20 px-4 min-h-screen flex items-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Privacy Policy
          </h2>
          <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <PrivacyAccordion />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-purple-500/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text bg-300% animate-gradient">
                Cryptonian
              </h3>
              <p className="text-gray-300">Learn, Play, Earn in the Web3 Era</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-purple-400">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <ScrollButton targetId="about" className="hover:text-purple-400">
                    About
                  </ScrollButton>
                </li>
                <li>
                  <ScrollButton targetId="features" className="hover:text-purple-400">
                    Features
                  </ScrollButton>
                </li>
                <li>
                  <ScrollButton targetId="team" className="hover:text-purple-400">
                    Team
                  </ScrollButton>
                </li>
                <li>
                  <ScrollButton targetId="privacy" className="hover:text-purple-400">
                    Privacy
                  </ScrollButton>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-purple-400">Follow Us</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-300 hover:text-purple-400">
                  <Instagram />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-purple-400">
                  <Linkedin />
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-purple-400">Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-purple-400">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}