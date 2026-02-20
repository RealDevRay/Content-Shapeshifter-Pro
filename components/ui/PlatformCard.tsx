import { Check, Copy, FileText, Twitter, Linkedin, Mail, Instagram } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Twitter Thread': Twitter,
  'LinkedIn Post': Linkedin,
  'Newsletter': Mail,
  'Instagram Caption': Instagram,
};

const platformColors: Record<string, string> = {
  'Twitter Thread': 'from-sky-500 to-blue-600',
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
  const gradient = platformColors[platform] || 'from-zinc-600 to-zinc-700';

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
        "group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden",
        "hover:border-zinc-700 transition-all duration-300",
        "hover:shadow-xl hover:shadow-black/20"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className={cn("px-6 py-4 bg-gradient-to-r", gradient)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white">{platform}</span>
          </div>
          <button
            onClick={copyToClipboard}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              "hover:bg-white/20 active:scale-95",
              copied && "bg-green-500/20 text-green-400"
            )}
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="prose prose-invert prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-zinc-300 leading-relaxed font-mono text-sm">
            {content}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-zinc-900/50 border-t border-zinc-800 flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          {content.length.toLocaleString()} characters
        </span>
        <button
          onClick={copyToClipboard}
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center space-x-1"
        >
          <span>Copy</span>
          {copied && <Check className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}
