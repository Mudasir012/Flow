import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Github, Twitter, Linkedin, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '/#features' },
      { name: 'Pricing', href: '/#pricing' },
      { name: 'API', href: '/api' },
      { name: 'Video Editor', href: '/videoeditor' },
    ],
    resources: [
      { name: 'Documentation', href: '/documentation' },
      { name: 'Guides', href: '/documentation#getting-started' },
      { name: 'API Reference', href: '/api#endpoints' },
      { name: 'Community', href: '/documentation#support' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="relative bg-[#020617] text-slate-300 py-16 lg:py-24 overflow-hidden border-t border-white/5">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-8 group">
              <div className="p-2.5 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent italic">
                Flow
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm mb-8 text-lg leading-relaxed">
              Empowering the next generation of creators with AI-driven social tools and cinematic experiences. Join the revolution.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('/') ? (
                        link.href.includes('#') ? (
                            <a 
                                href={link.href}
                                className="text-slate-400 hover:text-purple-400 transition-colors duration-300 flex items-center group"
                            >
                                <span className="w-0 group-hover:w-2 h-0.5 bg-purple-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                {link.name}
                            </a>
                        ) : (
                            <Link
                                to={link.href}
                                className="text-slate-400 hover:text-purple-400 transition-colors duration-300 flex items-center group"
                            >
                                <span className="w-0 group-hover:w-2 h-0.5 bg-purple-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                {link.name}
                            </Link>
                        )
                    ) : (
                      <a
                        href={link.href}
                        className="text-slate-400 hover:text-purple-400 transition-colors duration-300 flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-purple-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-slate-500">
          <p>© {currentYear} FlowGram by Flow. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>System Status: Operational</span>
            </div>
            <p>Made with ❤️ for Creators</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
