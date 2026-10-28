import React, { useState } from 'react';
import { Sparkles, BookOpen, Share2, Check, ExternalLink, ShieldAlert, GraduationCap } from 'lucide-react';

interface NavbarProps {
  onOpenCliches: () => void;
  onResetToDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCliches, onResetToDemo }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const shareText = `🎓 Check out this Smart FYP Scope & Uniqueness Validator! It scans your university project idea, tells you if it's a rejected cliché, and upgrades it with a 90%+ blueprint: ${window.location.href}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`🎓 Hey team, check your FYP idea on this Smart Scope & Uniqueness Validator before professors reject it: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onResetToDemo}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <GraduationCap className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-lg">Smart FYP</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Validator v2.4
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-500">
              Uniqueness Scorer · Smart Upgrades · Architecture Blueprint
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenCliches}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Browse universally rejected FYP topics and their modern upgrades"
          >
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <span className="hidden sm:inline">Hall of</span> Clichés
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            title="Share with FYP Group Partner on WhatsApp"
          >
            <Share2 className="h-4 w-4 text-emerald-600" />
            <span className="hidden sm:inline">Share on</span> WhatsApp
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 text-slate-400" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
