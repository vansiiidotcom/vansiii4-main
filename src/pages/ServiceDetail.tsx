import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

interface Service {
  title: string;
  slug: string;
  hero: string;
  description: string;
  process: string[];
  technologies: string[];
  benefits: string[];
}

const services: Record<string, Service> = {
  "web-development": {
    title: "Web Development",
    slug: "web-development",
    hero: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    description: "We create cutting-edge web applications that combine stunning visuals with powerful functionality. Our development process focuses on creating scalable, maintainable, and high-performance solutions.",
    process: [
      "Requirements Analysis",
      "Architecture Planning",
      "UI/UX Development",
      "Development",
      "Testing & QA",
      "Deployment",
      "Maintenance & Support"
    ],
    technologies: [
      "React & Next.js",
      "Node.js",
      "TypeScript",
      "GraphQL",
      "PostgreSQL",
      "AWS",
      "Docker"
    ],
    benefits: [
      "Scalable Architecture",
      "Mobile-First Approach",
      "SEO Optimization",
      "Performance Optimization",
      "Security Best Practices",
      "Analytics Integration"
    ]
  },
  "ui-ux-design": {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    hero: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    description: "Our design team creates intuitive and engaging user experiences that delight users and achieve business goals. We follow a user-centered design approach, ensuring every decision is backed by research and testing.",
    process: [
      "User Research & Interviews",
      "Competitive Analysis",
      "User Journey Mapping",
      "Information Architecture",
      "Wireframing & Prototyping",
      "Visual Design & Branding",
      "Usability Testing & Iteration"
    ],
    technologies: [
      "Figma",
      "Adobe Creative Suite",
      "Sketch & InVision",
      "Principle",
      "Maze & UsabilityHub",
      "Miro",
      "Zeplin"
    ],
    benefits: [
      "Increased User Satisfaction",
      "Higher Conversion Rates",
      "Reduced Development Time",
      "Data-Driven Design Decisions",
      "Consistent User Experience",
      "Accessibility Compliance"
    ]
  },
  "photography": {
    title: "Photography",
    slug: "photography",
    hero: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e",
    description: "We deliver exceptional photography services that capture the essence of your brand, products, and events. Our professional team combines technical expertise with creative vision to produce stunning visual content.",
    process: [
      "Creative Consultation",
      "Concept Development",
      "Location & Equipment Planning",
      "Professional Photoshoot",
      "Image Selection & Review",
      "Advanced Post-Processing",
      "Final Delivery & Archive"
    ],
    technologies: [
      "Professional DSLR & Mirrorless",
      "Studio Lighting Systems",
      "Adobe Lightroom & Capture One",
      "Photoshop",
      "Color Management Systems",
      "Professional Lens Collection",
      "High-End Studio Equipment"
    ],
    benefits: [
      "Professional Image",
      "Consistent Brand Aesthetics",
      "Quick Turnaround Times",
      "Multiple Format Delivery",
      "Commercial Usage Rights",
      "Secure Image Storage"
    ]
  },
  "video-production": {
    title: "Video Production",
    slug: "video-production",
    hero: "https://images.unsplash.com/photo-1579187707643-35646d22b596",
    description: "From pre-production to final delivery, we create compelling video content that engages your audience and tells your story effectively. Our team handles every aspect of video production with professional expertise.",
    process: [
      "Creative Strategy & Planning",
      "Script & Storyboard Development",
      "Location & Talent Scouting",
      "Professional Filming",
      "Sound Design & Music",
      "Post-Production & Effects",
      "Final Review & Delivery"
    ],
    technologies: [
      "Cinema Cameras & Equipment",
      "Professional Audio Systems",
      "Adobe Premiere Pro & After Effects",
      "DaVinci Resolve Studio",
      "Professional Sound Design",
      "Motion Graphics Tools",
      "4K/8K Production Capability"
    ],
    benefits: [
      "Cinematic Quality Content",
      "Professional Storytelling",
      "Multiple Format Support",
      "High-End Production Value",
      "Custom Motion Graphics",
      "Professional Color Grading"
    ]
  },
  "digital-marketing": {
    title: "Digital Marketing",
    slug: "digital-marketing",
    hero: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    description: "We create and execute comprehensive digital marketing strategies that drive growth, engagement, and measurable results. Our data-driven approach ensures optimal ROI across all digital channels.",
    process: [
      "Market Research & Analysis",
      "Strategy Development",
      "Campaign Planning",
      "Content Creation & Design",
      "Channel Implementation",
      "Performance Monitoring",
      "Optimization & Reporting"
    ],
    technologies: [
      "Google Analytics & Tag Manager",
      "SEMrush & Ahrefs",
      "HubSpot & Mailchimp",
      "Social Media Management Tools",
      "Ad Platform Management",
      "Marketing Automation",
      "CRM Integration"
    ],
    benefits: [
      "Increased Brand Visibility",
      "Higher Conversion Rates",
      "Improved ROI Tracking",
      "Data-Driven Decisions",
      "Multi-Channel Presence",
      "Automated Lead Generation"
    ]
  },
  "brand-identity": {
    title: "Brand Identity",
    slug: "brand-identity",
    hero: "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
    description: "We develop comprehensive brand identities that capture your unique value proposition and resonate with your target audience. Our strategic approach ensures your brand stands out in today's competitive market.",
    process: [
      "Brand Discovery Workshop",
      "Market & Competitor Analysis",
      "Brand Strategy Development",
      "Visual Identity Design",
      "Brand Guidelines Creation",
      "Asset Development",
      "Implementation Support"
    ],
    technologies: [
      "Adobe Creative Suite",
      "Brand Management Platforms",
      "Typography Design Tools",
      "Color Management Systems",
      "Asset Management Tools",
      "Digital Brand Libraries",
      "Style Guide Platforms"
    ],
    benefits: [
      "Unique Brand Position",
      "Consistent Brand Experience",
      "Professional Brand Image",
      "Scalable Brand System",
      "Clear Brand Guidelines",
      "Future-Proof Design"
    ]
  }
};

const ServiceDetail = () => {
  const { title: slug } = useParams<{ title: string }>();
  const navigate = useNavigate();

  // Find service by slug
  const service = Object.values(services).find(s => s.slug === slug) || services[slug as keyof typeof services];

  if (!service) {
    console.error(`Service not found for slug: ${slug}`);
    return (
      <div className="min-h-screen bg-vansiii-bg pt-24">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-2xl text-vansiii-black">Service not found</h1>
          <Link to="/services" className="text-vansiii-accent hover:accent-text transition-colors">
            ← Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vansiii-bg">
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={service.hero}
          alt={service.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error(`Failed to load image: ${service.hero}`);
            e.currentTarget.src = 'https://via.placeholder.com/1200x600?text=Image+Not+Found';
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="absolute inset-0 flex flex-col justify-center px-4">
          <div className="max-w-7xl mx-auto w-full">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/services')}
              className="flex items-center gap-2 text-vansiii-white mb-8 hover:text-vansiii-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Services
            </motion.button>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-vansiii-white mb-6"
            >
              {service.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-vansiii-white/90 max-w-3xl"
            >
              {service.description}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Our Process */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-vansiii-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-2xl font-medium mb-6 text-vansiii-black">Our Process</h2>
            <ul className="space-y-4">
              {service.process.map((step, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-600">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-vansiii-accent text-vansiii-white flex items-center justify-center">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-vansiii-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-2xl font-medium mb-6 text-vansiii-black">Technologies</h2>
            <ul className="space-y-4">
              {service.technologies.map((tech, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-600">
                  <Check className="w-5 h-5 text-vansiii-accent flex-shrink-0" />
                  {tech}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-vansiii-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-2xl font-medium mb-6 text-vansiii-black">Benefits</h2>
            <ul className="space-y-4">
              {service.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-600">
                  <Check className="w-5 h-5 text-vansiii-accent flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-xl text-gray-600 mb-8">
            Ready to get started with {service.title.toLowerCase()}?
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-vansiii-white bg-vansiii-accent rounded-full hover:accent-bg transition-colors"
          >
            Get in Touch
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceDetail;