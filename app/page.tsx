'use client';

import { Sparkles, Twitter, Linkedin, Mail, Instagram, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTransform } from '@/src/hooks/useTransform';
import { FormInput } from '@/components/ui/FormInput';
import { SourcePreview } from '@/components/ui/SourcePreview';
import { PlatformCard } from '@/components/ui/PlatformCard';

export default function Home() {
  const {
    input,
    setInput,
    isLoading,
    result,
    handleSubmit,
    reset,
  } = useTransform();

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
          <FormInput
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
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
              <SourcePreview
                imageUrl={result.imageUrl}
                title={result.title}
                extractedText={result.extractedText}
              />
            </div>

            {/* Generated Content Grid */}
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Your Transformed Content
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.results.map((item, index) => (
                  <PlatformCard
                    key={item.platform}
                    platform={item.platform}
                    content={item.content}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <button
                onClick={() => {
                  reset();
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