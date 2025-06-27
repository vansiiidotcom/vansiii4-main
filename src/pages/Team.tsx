// Line 1: Imports
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Linkedin } from 'lucide-react';

// Line 5: TeamMember interface (unchanged)
interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  skills: string[];
  social: {
    linkedin?: string;
  };
}

// Line 16: Team members data (unchanged)
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Vanshika Wadhwa",
    role: "CEO",
    image: "https://collection.cloudinary.com/vansiii/925cb001396aff39929e37ca029ec3d6",
    bio: "Vanshika Wadhwa, CEO of Vansiii, is a multidisciplinary creative turned visionary leader. With roots in art, content writing, and graphic design, she now drives strategic branding and digital storytelling at Vansiii, blending creativity with clarity to help brands connect, convert, and thrive in the ever-evolving digital landscape.",
    skills: ["Brand Strategy", "Art Direction", "Team Leadership"],
    social: {
      linkedin: "https://linkedin.com/in/sarah-johnson",
    },
  },
  {
    id: 2,
    name: "Muskan Malpani",
    role: "Content Strategist & Marketeer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    bio: "Muskan is a creative force with experience spanning content growth, event management, and professional video production. A filmmaking student, she’s led shoots, open mics, and campaigns with film stars and influencers. With agency experience at Leo Burnett and a 328K+ strong initiative on sexual wellness, Muskan blends heart, hustle, and impact-driven storytelling.",
    skills: ["Production", "Event Organizing", "Brand Strategist", "Client Servicing", "Post Production", "Online and Offline Marketing"],
    social: {
      linkedin: "https://linkedin.com/in/michaelchen",
    },
  },
  {
    id: 3,
    name: "Karthikeya Buddhi",
    role: "Graphic Designer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    bio: "Karthikeya, our in-house Graphic Designer, brings brands to life with bold visuals and clean, strategic design. With a sharp eye for detail and a passion for storytelling through aesthetics, he crafts creative assets that not only look stunning but also drive engagement and elevate brand identity across platforms.",
    skills: ["Graphic Design", "Logo Design", "Poster Design", "Typography", "Packaging Design", "Brand Design"],
    social: {
      linkedin: "https://instagram.com/emmacreates",
    },
  },
  {
    id: 4,
    name: "Anubhuti Wadhawan",
    role: "Content Analyst",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    bio: "Anubhuti, a Content Analyst at Vansiii, combines insight with creativity—digging deep into data, trends, and audience behavior to craft content strategies that hit the mark. With a sharp editorial eye and a research-first mindset, you turn ideas into impact across every scroll, click, and campaign.",
    skills: ["Content Analysis", "Content Research", "Content Writing", "Copywriting", "Web Writing"],
    social: {
      linkedin: "https://linkedin.com/in/davidkim",
    },
  },
  {
    id: 5,
    name: "Neha Bhalodia",
    role: "Marketing Manager",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    bio: "Neha Bhalodia, a graphic designer at Vansiii, blends creativity with precision to craft visually compelling designs that resonate. With a keen sense of aesthetics and a deep understanding of brand identity, she transforms ideas into impactful visuals, making every project not just eye-catching, but strategically aligned and memorable.",
    skills: ["Graphic Design", "Logo Design", "Poster Design", "Typography", "Packaging Design", "Brand Design"],
    social: {
      linkedin: "https://twitter.com/lisammarketing",
    },
  },
  {
    id: 6,
    name: "Prakul C Prasad",
    role: "Lead Generator",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    bio: "Prakul, Lead Generator at Vansiii, is the bridge between creativity and conversion. With a sharp eye for opportunities and a strategic mindset, he connects the right clients with the right solutions. Driven by results and powered by hustle, he ensures our pipeline stays strong and our impact keeps growing.",
    skills: ["Lead Generation"],
    social: {
      linkedin: "https://linkedin.com/in/jameswilson",
    },
  },
];

// Line: Team component
export default function Team() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-gray-900 mb-12"
        >
          Meet Our Team
        </motion.h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900">{member.name}</h2>
                  <h4 className="text-md text-gray-600 mb-4">{member.role}</h4>
                  <p className="text-gray-700 text-sm mb-4">{member.bio}</p>
                  <div className="mb-4">
                    <strong className="text-gray-900">Skills:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {member.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Linkedin className="w-5 h-5 mr-2" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}