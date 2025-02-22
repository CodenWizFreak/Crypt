"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Instagram } from "lucide-react"

interface TeamMember {
  name: string
  role: string
  image: string
  linkedin: string
  instagram: string
}

export default function InfiniteTeamCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const teamMembers: TeamMember[] = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=400&width=400",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
    {
      name: "Sarah Williams",
      role: "Lead Developer",
      image: "/placeholder.svg?height=400&width=400",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
    {
      name: "Mike Chen",
      role: "Product Manager",
      image: "/placeholder.svg?height=400&width=400",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
    {
      name: "Priya Patel",
      role: "Creative Director",
      image: "/placeholder.svg?height=400&width=400",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % teamMembers.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="overflow-hidden relative">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${teamMembers.length * 100}%`,
        }}
      >
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="w-full flex justify-center px-4"
            style={{ flex: `0 0 ${100 / teamMembers.length}%` }}
          >
            <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm w-full max-w-2xl transform hover:scale-105 transition-transform duration-300">
  <CardContent className="p-10 text-center space-y-6">
    <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-purple-500/50">
      <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
    </div>
    <h3 className="text-3xl font-semibold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
      {member.name}
    </h3>
    <p className="text-purple-400 text-xl">{member.role}</p>
    <div className="flex justify-center gap-6">
      <Link
        href={member.linkedin}
        className="text-gray-400 hover:text-purple-500 transform hover:scale-110 transition-transform"
      >
        <Linkedin className="h-7 w-7" />
      </Link>
      <Link
        href={member.instagram}
        className="text-gray-400 hover:text-purple-500 transform hover:scale-110 transition-transform"
      >
        <Instagram className="h-7 w-7" />
      </Link>
    </div>
  </CardContent>
</Card>


          </div>
        ))}
      </div>
    </div>
  )
}

