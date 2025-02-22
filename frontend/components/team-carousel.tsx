"use client"

import { useState } from "react"
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

export default function TeamCarousel() {
  const teamMembers: TeamMember[] = [
    {
      name: "Ananyo Dasgupta",
      role: "Frontend & Web3 Dev",
      image: "/me.jpg",
      linkedin: "www.linkedin.com/in/ananyodasgupta2804",
      instagram: "https://instagram.com",
    },
    {
      name: "Anidipta Pal",
      role: "ML & Backend Dev",
      image: "/ani.jpg",
      linkedin: "https://www.linkedin.com/in/anidipta-pal",
      instagram: "https://instagram.com",
    },
    {
      name: "Soumyadip Roy",
      role: "Frontend & Web3 Dev",
      image: "/sou.jpg",
      linkedin: "https://www.linkedin.com/in/soumyadip-roy-266166281",
      instagram: "https://instagram.com",
    },
    {
      name: "Suparno Saha",
      role: "Game Dev",
      image: "/sup.jpg",
      linkedin: "https://www.linkedin.com/in/letsbecool9792",
      instagram: "https://instagram.com",
    },
  ]

  return (
    <div className="flex justify-center space-x-8">
      {teamMembers.map((member, index) => (
        <Card
          key={index}
          className="bg-black/50 border-purple-500/30 backdrop-blur-sm w-full max-w-md mx-auto transform hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          <CardContent className="p-8 text-center space-y-6">
            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-2 border-purple-500/50">
              <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
            </div>
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              {member.name}
            </h3>
            <p className="text-purple-400 text-lg">{member.role}</p>
            <div className="flex justify-center gap-6">
              <Link
                href={member.linkedin}
                className="text-gray-400 hover:text-purple-500 transform hover:scale-110 transition-transform"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link
                href={member.instagram}
                className="text-gray-400 hover:text-purple-500 transform hover:scale-110 transition-transform"
              >
                <Instagram className="h-6 w-6" />
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

