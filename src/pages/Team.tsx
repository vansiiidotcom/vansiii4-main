// Line 1: Imports
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye } from 'lucide-react';

// Line 5: TeamMember interface
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

// Line 16: Team members data
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Vanshika Wadhwa",
    role: "Creative Director",
    image: "src/assets/images/PHOTO-2025-05-27-22-37-43.jpg",
    bio: "Vanshika Wadhwa, CEO of Vansiii, is a multidisciplinary creative turned visionary leader. With roots in art, content writing, and graphic design, she now drives strategic branding and digital storytelling at Vansiii, blending creativity with clarity to help brands connect, convert, and thrive in the ever-evolving digital landscape.",
    skills: ["Brand Strategy", "Art Direction", "Team Leadership"],
    social: {
      linkedin: "https://linkedin.com/in/sarah-johnson",
    }
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Lead Developer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    bio: "Michael specializes in front-end development and has a passion for creating seamless user experiences.",
    skills: ["React", "TypeScript", "UI/UX"],
    social: {
      linkedin: "https://linkedin.com/in/michaelchen",
    }
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Art Director",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    bio: "Emma brings creative concepts to life through her exceptional artistic vision and attention to detail.",
    skills: ["Digital Art", "Illustration", "Brand Design"],
    social: {
      linkedin: "https://instagram.com/emmacreates"
    }
  },
  {
    id: 4,
    name: "David Kim",
    role: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    bio: "David crafts intuitive user interfaces and experiences that delight users and drive engagement.",
    skills: ["User Research", "Prototyping", "Visual Design"],
    social: {
      linkedin: "https://linkedin.com/in/davidkim"
    }
  },
  {
    id: 5,
    name: "Lisa Martinez",
    role: "Marketing Manager",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    bio: "Lisa develops and executes marketing strategies that help our clients reach their target audience effectively.",
    skills: ["Digital Marketing", "Content Strategy", "Analytics"],
    social: {
      linkedin: "https://twitter.com/lisammarketing"
    }
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Technical Lead",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    bio: "James oversees the technical aspects of our projects, ensuring robust and scalable solutions.",
    skills: ["System Architecture", "Backend Development", "DevOps"],
    social: {
      linkedin: "https://linkedin.com/in/jameswilson"
    }
  },
];

// Line 91: TeamMemberModal component
const TeamMemberModal = ({ member, onClose }: { member: TeamMember; onClose: () => void }) => {
  return (
    // Line 93: Modal overlay
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Line 100: Modal content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Line 107: Grid layout */}
        <div className="grid md:grid-cols-2">
          {/* Line 109: Image container */}
          <div className="max-h-[80vh]">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-contain"
            />
          </div>
          {/* Line 115: Text content */}
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-2">{member.name}</h2>
            <p className="text-vansiii-accent mb-6">{member.role}</p>
            
            <p className="text-gray-600 mb-6">{member.bio}</p>
            
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4">
              {Object.entries(member.social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-vansiii-accent transition-colors"
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Line 150: Team component
const Team = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    // Line 154: Main container - Keep reduced padding-top
    <div className="min-h-screen bg-[#F8F5F1] pt-12">
      {/* Line 156: Content wrapper - Keep reduced vertical padding */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-light mb-12 tracking-tighter text-center"
        >
          Meet the Team
        </motion.h1>

        {/* Line 165: Team grid - Keep centered with padding */}
        <div className="grid grid-cols-3 gap-6 px-8 justify-center max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            // Line 168: Team member card - Center content
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group cursor-pointer flex flex-col items-center"
              onClick={() => setSelectedMember(member)}
            >
              {/* Line 175: Image wrapper - Keep adjusted image size */}
              <div className="aspect-[3/4] overflow-hidden rounded-xl max-h-[300px] w-full relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                {/* Line 180: Overlay - Scoped to image container */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-center">
                    <Eye className="w-8 h-8 text-white mb-2 mx-auto" />
                    <p className="text-white text-sm font-medium">View Profile</p>
                  </div>
                </div>
              </div>
              {/* Line 188: Member info - Centered */}
              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Line 198: Modal */}
      <AnimatePresence>
        {selectedMember && (
          <TeamMemberModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Line 209: Export
export default Team;