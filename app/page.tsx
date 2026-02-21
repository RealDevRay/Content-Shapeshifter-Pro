'use client';

import { Sparkles, Linkedin, Mail, Instagram, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTransform } from '@/src/hooks/useTransform';
import { FormInput } from '@/components/ui/FormInput';
import { SourcePreview } from '@/components/ui/SourcePreview';
import { PlatformCard } from '@/components/ui/PlatformCard';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.975H5.106z" />
  </svg>
);

export default function Home() {
  const {
    input,
    setInput,
    isLoading,
    result,
    settings,
    setSettings,
    handleSubmit,
    reset,
  } = useTransform();

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#FAFAFA] via-white to-[#FAFAFA] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-200/40 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-black rounded-2xl shadow-lg shadow-black/10 text-white">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-black tracking-tight">
              Content Shapeshifter Pro
            </h1>
          </div>
          <p className="text-gray-800 font-medium text-lg max-w-2xl mx-auto mb-6">
            Transform any blog post, article, or text into platform-optimized content with AI
          </p>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 shadow-sm rounded-full">
            <Zap className="w-4 h-4 text-black" />
            <span className="text-sm font-medium text-gray-600">Powered by</span>
            <span className="text-sm font-bold text-black">DevRay Lab</span>
            <span className="text-xs font-bold px-2 py-0.5 bg-black rounded-full text-white">AI</span>
          </div>
        </header>

        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <FormInput
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            settings={settings}
            setSettings={setSettings}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-black animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-bold text-black animate-pulse">
                  Analyzing & transforming...
                </p>
                <p className="text-gray-600 font-medium">
                  Scraping content and generating AI variants
                </p>
              </div>
            </div>

            {/* Skeleton Loaders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-100 border-2 border-black/10 rounded-2xl animate-pulse shadow-sm"
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
              <h2 className="text-2xl font-extrabold text-black mb-6 text-center">
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
                className="inline-flex items-center space-x-2 px-6 py-3 bg-black hover:bg-gray-900 text-white rounded-xl transition-all duration-200 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-bold">Transform Another</span>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !isLoading && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: XIcon, label: 'X Thread', color: 'text-black' },
                { icon: Linkedin, label: 'LinkedIn Post', color: 'text-blue-600' },
                { icon: Mail, label: 'Newsletter', color: 'text-orange-600' },
                { icon: Instagram, label: 'Instagram', color: 'text-pink-600' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 bg-gray-200/50 border-2 border-black/10 rounded-xl flex flex-col items-center space-y-2 shadow-sm pointer-events-none"
                >
                  <item.icon className={cn("w-8 h-8", item.color)} />
                  <span className="text-sm font-bold text-black">{item.label}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 font-medium">
              Enter a URL to scrape and transform, or paste your own text above
            </p>
          </div>
        )}
      </div>
    </main>
  );
}