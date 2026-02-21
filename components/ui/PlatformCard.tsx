import { Check, Copy, FileText, Linkedin, Mail, Instagram } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

// Custom X (Twitter) Logo
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.975H5.106z" />
  </svg>
);

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'X Thread': XIcon,
  'LinkedIn Post': Linkedin,
  'Newsletter': Mail,
  'Instagram Caption': Instagram,
};

const platformColors: Record<string, string> = {
  'X Thread': 'from-black to-gray-900',
  'LinkedIn Post': 'from-blue-600 to-blue-800',
  'Newsletter': 'from-orange-500 to-red-600',
  'Instagram Caption': 'from-purple-500 to-pink-600',
};

interface PlatformCardProps {
  platform: string;
  content: string;
  index: number;
}

export function PlatformCard({ platform, content, index }: PlatformCardProps) {
  const [copied, setCopied] = useState(false);
  const Icon = platformIcons[platform] || FileText;
  const gradient = platformColors[platform] || 'from-gray-600 to-gray-700';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div
      className={cn(
        "group bg-white border-2 border-black/10 rounded-2xl overflow-hidden shadow-sm",
        "hover:border-black/30 transition-all duration-300",
        "hover:shadow-lg hover:shadow-gray-200"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className={cn("px-6 py-4 bg-gradient-to-r", gradient)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm shadow-sm">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white tracking-wide">{platform}</span>
          </div>
          <button
            onClick={copyToClipboard}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              "hover:bg-white/20 active:scale-95",
              copied && "bg-green-500/20 text-white"
            )}
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Copy className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-black font-medium leading-relaxed font-mono text-sm">
            {content}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium tracking-wide">
          {content.length.toLocaleString()} characters
        </span>
        <button
          onClick={copyToClipboard}
          className="text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors flex items-center space-x-1"
        >
          <span>Copy</span>
          {copied && <Check className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}
