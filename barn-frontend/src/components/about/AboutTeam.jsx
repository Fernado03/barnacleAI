import React, { useState, useEffect } from 'react';
import { ABOUT_CONTENT, COMPANY_INFO, TEAM_MEMBERS } from "../../constants/aboutConstants";
import { FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLightbulb, FaEye, FaHandshake } from 'react-icons/fa';
import { Fish, Starfish, Seaweed, Coral, Jellyfish, Anchor } from '../shared/MarineElement';

const CompanyInfoSection = () => {
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentMemberIndex((prevIndex) => 
          (prevIndex + 1) % TEAM_MEMBERS.length
        );
        setIsTransitioning(false);
      }, 500); // Duration of the fade-out effect
    }, 5000); // Change team member every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const currentMember = TEAM_MEMBERS[currentMemberIndex];

  return (
    <section className="bg-white py-16 sm:py-24 text-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Clean Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4">
            {ABOUT_CONTENT.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {ABOUT_CONTENT.description}
          </p>
        </div>

        {/* Minimalist Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Mission Card */}
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <FaLightbulb className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {ABOUT_CONTENT.mission}
            </p>
          </div>

          {/* Vision Card */}
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <FaEye className="text-2xl text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {ABOUT_CONTENT.vision}
            </p>
          </div>

          {/* Contact Card */}
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
              <FaHandshake className="text-2xl text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <a href={`mailto:${COMPANY_INFO.contact.email}`} className="hover:text-blue-600 transition-colors">
                  {COMPANY_INFO.contact.email}
                </a>
              </div>
              <div>{COMPANY_INFO.contact.phone}</div>
              <div className="text-xs">{COMPANY_INFO.contact.address}</div>
              <div className="flex justify-center space-x-3 mt-3">
                <a href={COMPANY_INFO.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  <FaLinkedin className="h-4 w-4" />
                </a>
                <a href={COMPANY_INFO.social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                  <FaTwitter className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-16 border-gray-200" />

        {/* Team Section */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Side - Team Member Photo */}
          <div className="w-full flex justify-center order-2 md:order-1">
            <div className="relative w-full max-w-sm rounded-xl shadow-2xl p-4 bg-white group transition-transform duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              
              {/* Photo container */}
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                <div className={`text-center transition-all duration-500 ease-in-out transform ${
                  isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}>
                  {currentMember.image ? (
                    <img
                      src={currentMember.image}
                      alt={'portrait of ' + currentMember.name}
                      className="w-full h-full object-cover rounded-xl shadow-md"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-teal-200 to-blue-200 rounded-full mx-auto flex items-center justify-center shadow-lg">
                      <div className="text-gray-700 text-2xl font-bold">
                        {currentMember.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                  )}

                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mt-4 text-center">Team Member of <em>SeaWise</em></p>
            </div>
          </div>

          {/* Right Side - Team Member Info */}
          <div className="space-y-8 order-1 md:order-2">
            <h3 className="text-2xl font-bold text-gray-900">Meet Our Team</h3>
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-blue-600">
                {currentMember.name}
              </h4>
              <p className="text-md font-semibold text-gray-700">
                {currentMember.role}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {currentMember.bio}
              </p>
            </div>
            
            {/* Navigation Dots */}
            <div className="flex justify-center md:justify-start space-x-2 mt-4">
              {TEAM_MEMBERS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentMemberIndex(index);
                      setIsTransitioning(false);
                    }, 500);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentMemberIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Show team member ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyInfoSection;