'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { 
  Sparkles, 
  Twitter, 
  Linkedin, 
  Mail, 
  Instagram, 
  Copy, 
  Check, 
  Loader2,
  Zap,
  ExternalLink,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { TransformResponse } from '@/src/lib/prompts';

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

export default function Home() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TransformResponse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      toast.error('Please enter a URL or some text');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to transform content');
      }

      setResult(data);
      toast.success('Content transformed successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(platform);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const isUrl = input.trim().startsWith('http://') || input.trim().startsWith('https://');

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl shadow-lg shadow-violet-500/25">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Content Shapeshifter Pro
            </h1>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-6">
            Transform any blog post, article, or text into platform-optimized content with AI
          </p>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-zinc-400">Powered by</span>
            <span className="text-sm font-semibold text-white">Groq</span>
            <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded-full text-zinc-500">Llama 3</span>
          </div>
        </header>

        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste text or enter a URL to transform..."
                rows={6}
                disabled={isLoading}
                className={cn(
                  "w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl",
                  "text-zinc-100 placeholder:text-zinc-600",
                  "focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50",
                  "transition-all duration-200 resize-none",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              />
              <div className="absolute bottom-4 right-4 text-xs text-zinc-600">
                {isUrl ? 'URL detected' : 'Text mode'}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={cn(
                "w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600",
                "text-white font-semibold rounded-xl",
                "flex items-center justify-center space-x-2",
                "hover:from-violet-500 hover:to-indigo-500",
                "focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950",
                "transition-all duration-200 shadow-lg shadow-violet-500/25",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                "active:scale-[0.98]"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Shapeshifting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Shapeshift Content</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-zinc-800 border-t-violet-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-violet-500 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-semibold text-white animate-pulse">
                  Analyzing & transforming...
                </p>
                <p className="text-zinc-500">
                  Scraping content and generating AI variants
                </p>
              </div>
            </div>

            {/* Skeleton Loaders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && !isLoading && (
          <div className="space-y-8 animate-fade-in">
            {/* Source Preview */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/30">
                  <h2 className="text-lg font-semibold flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-violet-500" />
                    <span>Source Preview</span>
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image */}
                    {result.imageUrl && (
                      <div className="flex-shrink-0">
                        <div className="relative w-full lg:w-64 h-48 rounded-xl overflow-hidden bg-zinc-800">
                          <Image
                            src={result.imageUrl}
                            alt="Extracted image"
                            fill
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent" />
                        </div>
                      </div>
                    )}

                    {/* Text Summary */}
                    <div className="flex-1">
                      {result.title && (
                        <h3 className="text-xl font-semibold text-white mb-3">
                          {result.title}
                        </h3>
                      )}
                      <div className="prose prose-invert prose-sm max-w-none">
                        <p className="text-zinc-400 leading-relaxed">
                          {result.extractedText.substring(0, 500)}
                          {result.extractedText.length > 500 && '...'}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center space-x-4 text-sm text-zinc-500">
                        <span className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{result.extractedText.length.toLocaleString()} characters</span>
                        </span>
                        {result.imageUrl && (
                          <span className="flex items-center space-x-1">
                            <ImageIcon className="w-4 h-4" />
                            <span>Image extracted</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Content Grid */}
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Your Transformed Content
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.results.map((item, index) => {
                  const Icon = platformIcons[item.platform] || FileText;
                  const gradient = platformColors[item.platform] || 'from-zinc-600 to-zinc-700';
                  
                  return (
                    <div
                      key={item.platform}
                      className={cn(
                        "group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden",
                        "hover:border-zinc-700 transition-all duration-300",
                        "hover:shadow-xl hover:shadow-black/20"
                      )}
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      {/* Header */}
                      <div className={cn(
                        "px-6 py-4 bg-gradient-to-r",
                        gradient
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-white">
                              {item.platform}
                            </span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(item.content, item.platform)}
                            className={cn(
                              "p-2 rounded-lg transition-all duration-200",
                              "hover:bg-white/20 active:scale-95",
                              copiedId === item.platform && "bg-green-500/20 text-green-400"
                            )}
                            title="Copy to clipboard"
                          >
                            {copiedId === item.platform ? (
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
                            {item.content}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-6 py-3 bg-zinc-900/50 border-t border-zinc-800 flex items-center justify-between">
                        <span className="text-xs text-zinc-500">
                          {item.content.length.toLocaleString()} characters
                        </span>
                        <button
                          onClick={() => copyToClipboard(item.content, item.platform)}
                          className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center space-x-1"
                        >
                          <span>Copy</span>
                          {copiedId === item.platform && <Check className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <button
                onClick={() => {
                  setInput('');
                  setResult(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all duration-200"
              >
                <Sparkles className="w-4 h-4" />
                <span>Transform Another</span>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !isLoading && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Twitter, label: 'Twitter Thread', color: 'text-sky-500' },
                { icon: Linkedin, label: 'LinkedIn Post', color: 'text-blue-600' },
                { icon: Mail, label: 'Newsletter', color: 'text-orange-500' },
                { icon: Instagram, label: 'Instagram', color: 'text-pink-600' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl flex flex-col items-center space-y-2"
                >
                  <item.icon className={cn("w-8 h-8", item.color)} />
                  <span className="text-sm text-zinc-500">{item.label}</span>
                </div>
              ))}
            </div>
            <p className="text-zinc-500">
              Enter a URL to scrape and transform, or paste your own text above
            </p>
          </div>
        )}
      </div>
    </main>
  );
}