"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PrivacyAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="border-purple-500/30">
        <AccordionTrigger className="text-left text-purple-400">Data Collection and Usage</AccordionTrigger>
        <AccordionContent className="text-white">
          We collect information that you provide directly to us, including when you create an account, make a purchase,
          or contact us for support. This may include your name, email address, wallet address, and transaction history.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2" className="border-purple-500/30">
        <AccordionTrigger className="text-left text-purple-400">Blockchain Data</AccordionTrigger>
        <AccordionContent className="text-white">
          Due to the nature of blockchain technology, transactions and wallet addresses are publicly visible. However,
          we do not link this information to your personal identity without your consent.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3" className="border-purple-500/30">
        <AccordionTrigger className="text-left text-purple-400">NFT Ownership and Rights</AccordionTrigger>
        <AccordionContent className="text-white">
          When you mint or purchase NFTs on our platform, you own the NFT but we retain the intellectual property rights
          to the underlying content. You may display and resell your NFTs according to our terms of service.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4" className="border-purple-500/30">
        <AccordionTrigger className="text-left text-purple-400">Security Measures</AccordionTrigger>
        <AccordionContent className="text-white">
          We implement industry-standard security measures to protect your personal information and digital assets. This
          includes encryption, secure socket layer technology, and regular security audits.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-5" className="border-purple-500/30">
        <AccordionTrigger className="text-left text-purple-400">Third-Party Services</AccordionTrigger>
        <AccordionContent className="text-white">
          We may use third-party services for payment processing, analytics, and customer support. These services have
          their own privacy policies and we ensure they maintain similar security standards.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-6" className="border-purple-500/30">
        <AccordionTrigger className="text-left text-purple-400">Cookie Policy</AccordionTrigger>
        <AccordionContent className="text-white">
          We use cookies and similar tracking technologies to enhance your experience on our platform. You can control
          cookie settings through your browser preferences.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-7" className="border-purple-500/30">
        <AccordionTrigger className="text-left text-purple-400">Data Retention</AccordionTrigger>
        <AccordionContent className="text-white">
          We retain your personal information for as long as necessary to provide our services and comply with legal
          obligations. You can request deletion of your data subject to certain limitations.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-8" className="border-purple-500/30">
        <AccordionTrigger className="text-left text-purple-400">Updates to Privacy Policy</AccordionTrigger>
        <AccordionContent className="text-white">
          We may update this privacy policy from time to time. We will notify you of any material changes through our
          platform or via email.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

