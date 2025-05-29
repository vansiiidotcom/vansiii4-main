import React from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, Camera, Video, Megaphone, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Code,
    title: "Web Development",
    slug: "web-development",
    description: "Custom web applications built with modern technologies and best practices. From simple websites to complex web applications.",
    features: [
      "Frontend Development",
      "Backend Development",
      "API Integration",
      "Performance Optimization",
      "Responsive Design",
      "SEO Optimization"
    ]
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    slug: "ui-ux-design",
    description: "User-centered design solutions that combine aesthetics with functionality. Creating intuitive and engaging digital experiences.",
    features: [
      "User Interface Design",
      "User Experience Design",
      "Wireframing & Prototyping",
      "Design Systems",
      "User Research",
      "Usability Testing"
    ]
  },
  {
    icon: Camera,
    title: "Photography",
    slug: "photography",
    description: "Professional photography services for products, events, and commercial purposes. Capturing moments that tell your story.",
    features: [
      "Product Photography",
      "Event Coverage",
      "Commercial Photography",
      "Photo Editing",
      "Studio Sessions",
      "Location Shoots"
    ]
  },
  {
    icon: Video,
    title: "Video Production",
    slug: "video-production",
    description: "End-to-end video production services from concept to final delivery. Creating engaging visual content for your brand.",
    features: [
      "Commercial Videos",
      "Product Demonstrations",
      "Event Coverage",
      "Motion Graphics",
      "Video Editing",
      "Color Grading"
    ]
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    slug: "digital-marketing",
    description: "Strategic digital marketing solutions to grow your online presence and reach your target audience effectively.",
    features: [
      "Social Media Marketing",
      "Content Strategy",
      "Email Marketing",
      "SEO/SEM",
      "Analytics & Reporting",
      "Campaign Management"
    ]
  },
  {
    icon: Layout,
    title: "Brand Identity",
    slug: "brand-identity",
    description: "Comprehensive branding solutions that help establish and strengthen your brand's presence in the market.",
    features: [
      "Logo Design",
      "Brand Guidelines",
      "Visual Identity",
      "Brand Strategy",
      "Marketing Collateral",
      "Brand Voice & Messaging"
    ]
  }
];

const Services = () => {
  return (
    <div className="min-h-screen bg-vansiii-bg pt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tighter text-vansiii-black">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer a comprehensive range of creative and technical services 
            to help bring your vision to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-vansiii-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Link to={`/services/${service.slug}`}>
                <service.icon className="w-12 h-12 text-vansiii-accent mb-6 group-hover:scale-110 transition-transform" />
                <h2 className="text-2xl font-medium mb-4 group-hover:text-vansiii-accent transition-colors">{service.title}</h2>
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <ul className="space-y-3">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <li 
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 bg-vansiii-accent rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 text-vansiii-accent font-medium">
                  Learn More →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-xl text-gray-600 mb-8">
            Ready to start your project?
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

export default Services;