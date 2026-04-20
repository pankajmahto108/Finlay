import { Link } from 'react-router-dom';
import { Globe, Share2, MessageCircle, Mail } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Qbit AI', href: '/qbit' },
    { label: 'Market Scanner', href: '/scanner' },
    { label: 'Strategy Tester', href: '/strategy' },
    { label: 'Watchlist', href: '/watchlist' },
    { label: 'Pricing', href: '#' },
  ],
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Press Kit', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'Tutorials', href: '#' },
    { label: 'Status', href: '#' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Disclaimer', href: '#' },
  ],
};

const socials = [
  { icon: Share2, href: '#', label: 'Twitter' },
  { icon: MessageCircle, href: '#', label: 'LinkedIn' },
  { icon: Globe, href: '#', label: 'GitHub' },
  { icon: Mail, href: '#', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#050a15]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00ff66] to-[#3b82f6] flex items-center justify-center shadow-lg shadow-[#00ff66]/20">
                <span className="font-black text-white text-sm">F</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Fin<span className="text-[#00ff66]">lay</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">
              The intelligent infrastructure for modern quantitative trading. Powered by advanced AI.
            </p>
            <div className="flex gap-3">
              {socials.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{title}</h4>
              <ul className="space-y-3">
                {links.map((link, j) => (
                  <li key={j}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-sm text-gray-500 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Finlay Technologies Inc. All rights reserved.
          </p>
          <p className="text-xs text-gray-700">
            Trading involves risk. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
