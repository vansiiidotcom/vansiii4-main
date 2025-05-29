import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';
import { useLocation } from 'react-router-dom';

const Contact = () => {
  const contactFormRef = useRef<HTMLFormElement | null>(null);
  const workFormRef = useRef<HTMLFormElement | null>(null);
  const [contactStatus, setContactStatus] = useState<string | null>(null);
  const [workStatus, setWorkStatus] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<'contact' | 'work'>('contact');
  const location = useLocation();

  // Check URL query parameter to set initial form
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const formType = params.get('form');
    if (formType === 'work') {
      setActiveForm('work');
    } else {
      setActiveForm('contact');
    }
  }, [location]);

  const sendContactEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contactFormRef.current) return;

    // Check if all required fields are filled
    const formData = new FormData(contactFormRef.current);
    const fields = [
      'full_name',
      'email',
      'brand_name',
      'role_type',
      'website_instagram',
      'services',
      'looking_for',
      'timeline',
      'hear_about',
    ];
    let allFilled = true;

    fields.forEach((field) => {
      if (!formData.get(field)) {
        allFilled = false;
      }
    });

    // Check role_details if role_type is not Other
    const roleType = formData.get('role_type');
    if (roleType !== 'Other' && !formData.get('role_details')) {
      allFilled = false;
    }

    if (!allFilled) {
      setContactStatus('Please fill in all fields.');
      return;
    }

    emailjs
      .sendForm(
        'service_67208uq',     // replace with your service ID
        'template_yb2zpqo',    // replace with your contact template ID
        contactFormRef.current,
        'RynTqOjWPIw3t_X8-'      // replace with your public key
      )
      .then(
        () => {
          setContactStatus('Message sent successfully!');
          contactFormRef.current?.reset();
        },
        (error) => {
          console.error(error);
          setContactStatus('Failed to send message. Please try again.');
        }
      );
  };

  const sendWorkEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!workFormRef.current) return;

    emailjs
      .sendForm(
        'service_67208uq',     // replace with your service ID
        'template_yb2zpqo',    // replace with your work template ID
        workFormRef.current,
        'RynTqOjWPIw3t_X8-'      // replace with your public key
      )
      .then(
        () => {
          setWorkStatus('Message sent successfully!');
          workFormRef.current?.reset();
        },
        (error) => {
          console.error(error);
          setWorkStatus('Failed to send message. Please try again.');
        }
      );
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] pt-20">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-center mb-12"
        >
          Let's Connect
        </motion.h1>

        {/* Tab Slider */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 p-1 rounded-full border-2 border-gray-300">
            <button
              onClick={() => setActiveForm('contact')}
              className={`px-6 py-2 rounded-full text-lg font-medium transition-colors ${
                activeForm === 'contact'
                  ? 'bg-vansiii-accent text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Contact Us
            </button>
            <button
              onClick={() => setActiveForm('work')}
              className={`px-6 py-2 rounded-full text-lg font-medium transition-colors ${
                activeForm === 'work'
                  ? 'bg-vansiii-accent text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Work With Us
            </button>
          </div>
        </div>

        {/* Form Switcher */}
        {activeForm === 'contact' ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
            <form
              ref={contactFormRef}
              onSubmit={sendContactEmail}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">What’s your full name?</label>
                <input
                  type="text"
                  name="full_name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">What’s your email address?</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">What’s your brand/business name?</label>
                <input
                  type="text"
                  name="brand_name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Are you the founder or working with the brand?</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role_type"
                      value="Founder/Owner"
                      required
                      className="mr-2"
                    />
                    Founder/Owner
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role_type"
                      value="Team Member"
                      required
                      className="mr-2"
                    />
                    Team Member
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role_type"
                      value="Agency/Consultant"
                      required
                      className="mr-2"
                    />
                    Agency/Consultant
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role_type"
                      value="Other"
                      required
                      className="mr-2"
                    />
                    Other: <input
                      type="text"
                      name="role_type_other"
                      className="ml-2 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                  </label>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">If you're working at the company, what's your role?</label>
                <input
                  type="text"
                  name="role_details"
                  placeholder="e.g., Marketing Manager, Brand Strategist, Co-founder, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Share your website or Instagram (or both):</label>
                <input
                  type="text"
                  name="website_instagram"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Which service(s) are you interested in?</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="services"
                      value="Branding & Visual Identity"
                      className="mr-2"
                    />
                    Branding & Visual Identity
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="services"
                      value="Social Media Management"
                      className="mr-2"
                    />
                    Social Media Management
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="services"
                      value="Content Strategy"
                      className="mr-2"
                    />
                    Content Strategy
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="services"
                      value="Paid Ads (Meta, Google, etc.)"
                      className="mr-2"
                    />
                    Paid Ads (Meta, Google, etc.)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="services"
                      value="Website Design"
                      className="mr-2"
                    />
                    Website Design
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="services"
                      value="Packaging Design"
                      className="mr-2"
                    />
                    Packaging Design
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="services"
                      value="Something else"
                      className="mr-2"
                    />
                    Something else (tell us more below!)
                  </label>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Briefly tell us what you're looking for.</label>
                <textarea
                  name="looking_for"
                  rows={5}
                  required
                  placeholder="e.g., We’re launching a skincare line and need help with branding & launch strategy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                ></textarea>
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">What's your ideal timeline to start?</label>
                <select
                  name="timeline"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="">Select an option</option>
                  <option value="ASAP">ASAP</option>
                  <option value="Within a month">Within a month</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Do you have a budget in mind? (Optional, but helps us tailor things better!)</label>
                <input
                  type="text"
                  name="budget"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">How did you hear about Vansiii?</label>
                <select
                  name="hear_about"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="">Select an option</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Referred by a friend">Referred by a friend</option>
                  <option value="Google">Google</option>
                  <option value="Other">Other</option>
                </select>
                {contactFormRef.current?.hear_about?.value === 'Other' && (
                  <input
                    type="text"
                    name="hear_about_other"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                )}
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Anything else we should know before we hop on a call?</label>
                <textarea
                  name="additional_info"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                ></textarea>
              </div>
              <button
  type="submit"
  className="w-full bg-vansiii-accent text-white py-3 rounded-md font-semibold hover:bg-vansiii-accent transition"
>
  Send Message
</button>
{workStatus && (
  <p className="mt-4 text-center text-sm text-gray-600">{workStatus}</p>
)}
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Work With Us</h2>
            <form
              ref={workFormRef}
              onSubmit={sendWorkEmail}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-vansiii-accent text-white py-3 rounded-md font-semibold hover:bg-vansiii-accent transition"
              >
                Send Message
              </button>
              {workStatus && (
                <p className="mt-4 text-center text-sm text-gray-600">{workStatus}</p>
              )}
            </form>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-xl text-gray-600">
            Available for projects worldwide.<br />
            Let's create something amazing together.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;