"use client"

import { Clock, HeartHandshake, IndianRupee, KeyRound, ShieldCheck, Zap } from 'lucide-react';
import React, { useState } from 'react';
import ContactModal from './ContactModal';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isCTA?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, isCTA = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);


  if (isCTA) {
    return (
      <>
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="mb-4 text-white">
              {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
            <p className="text-white/90 mb-6">{description}</p>

            {/* CTA Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl cursor-pointer">
              Connect with OpenPic
            </button>
          </div>
        </div>
        <ContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Contact Us"
          subtitle="Tell us about your needs and we'll create the perfect solution for you"
        />
      </>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const FeatureBlock: React.FC = () => {
  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Save Time",
      description: "Stop scrolling through all photos. Find yours with one-click."
    },
    {
      icon: <KeyRound className="w-8 h-8" />,
      title: "Own Your Moments",
      description: "Don't wait for others. All your moments at your fingertip."
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Compliant-Storage",
      description: "Be assured that all your photos are secure and encrypted."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-Time",
      description: "Get your pictures from camera to OpenPic in seconds."
    },
    {
      icon: <IndianRupee className="w-8 h-8" />,
      title: "Flexible Pricing",
      description: "Pay for only what you need."
    },
    {
      icon: <HeartHandshake className="w-8 h-8" />,
      title: "Contact Us",
      description: "We'll be happy to help you forward."
    }
  ];

  return (
    <div className="w-full px-4 py-16">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
          People Love OpenPic
        </h1>
        <p className="text-base md:text-xl text-gray-600">
          Memories don't have to wait
        </p>
      </div>

      {/* Mobile: Single column, Desktop: 3 columns */}
      <div className="max-w-sm mx-auto md:max-w-7xl md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 space-y-4 md:space-y-0">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            isCTA={index === features.length - 1} // Make the last card a CTA
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureBlock;
