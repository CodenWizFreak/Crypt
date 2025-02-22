"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Wallet } from "lucide-react"

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-sm" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text bg-300% animate-gradient"
          >
            Cryptonian
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Home
            </button>
            
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("team")}
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Team
            </button>
            <button
              onClick={() => scrollToSection("privacy")}
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Privacy
            </button>
            <Button
              variant="outline"
              className="border-purple-500 bg-transparent text-white hover:bg-purple-900/20 group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity" />
              <Wallet className="h-5 w-5 text-white mr-2" />
              <span>Connect Wallet</span>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-purple-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-4">
            <button
              onClick={() => scrollToSection("home")}
              className="block w-full text-left text-gray-300 hover:text-purple-400 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left text-gray-300 hover:text-purple-400 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left text-gray-300 hover:text-purple-400 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("team")}
              className="block w-full text-left text-gray-300 hover:text-purple-400 transition-colors"
            >
              Team
            </button>
            <button
              onClick={() => scrollToSection("privacy")}
              className="block w-full text-left text-gray-300 hover:text-purple-400 transition-colors"
            >
              Privacy
            </button>
            <Button
              variant="outline"
              className="w-full border-purple-500 bg-transparent text-white hover:bg-purple-900/20 group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity" />
              <Wallet className="h-5 w-5 text-white mr-2" />
              <span>Connect Wallet</span>
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}

