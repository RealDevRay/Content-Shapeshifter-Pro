import { Sparkles, Loader2, Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import React, { useState } from 'react';
import { UserSettings } from '@/src/lib/prompts';

interface FormInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

export function FormInput({ input, setInput, isLoading, onSubmit, settings, setSettings }: FormInputProps) {
  const isUrl = input.trim().startsWith('http://') || input.trim().startsWith('https://');
  const [showSettings, setShowSettings] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text or enter a URL to transform..."
          rows={6}
          disabled={isLoading}
          className={cn(
            "w-full px-6 py-4 bg-white border-2 border-black/10 rounded-2xl shadow-sm",
            "text-black font-medium placeholder:text-gray-400",
            "focus:outline-none focus:ring-0 focus:border-black",
            "transition-all duration-200 resize-none",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
        <div className="absolute bottom-4 right-4 text-xs text-gray-400">
          {isUrl ? 'URL detected' : 'Text mode'}
        </div>
      </div>

      {/* Settings Toggle Button */}
      <button
        type="button"
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
      >
        <Settings2 className="w-5 h-5 text-black" />
        <span className="text-black">Advanced Settings</span>
        {showSettings ? <ChevronUp className="w-4 h-4 text-black" /> : <ChevronDown className="w-4 h-4 text-black" />}
      </button>

      {/* Expandable Settings Panel */}
      {showSettings && (
        <div className="p-4 bg-gray-50 border border-gray-200 shadow-inner rounded-xl space-y-4 animate-fade-in">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Temperature / Creativity */}
            <div className="space-y-2">
              <label className="flex justify-between text-sm text-gray-700 font-medium">
                <span>Creativity (Temperature)</span>
                <span className="text-gray-500">{settings.temperature}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                className="w-full accent-violet-600"
              />
              <p className="text-xs text-gray-400">Lower is more focused, higher is more creative.</p>
            </div>

            {/* Content Length */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-700 font-medium">Length Preference</label>
              <select
                value={settings.lengthPreference}
                onChange={(e) => setSettings({ ...settings, lengthPreference: e.target.value as any })}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-violet-500 shadow-sm"
              >
                <option value="short">Short & Concise</option>
                <option value="default">Default Length</option>
                <option value="long">Long & Detailed</option>
              </select>
            </div>

            {/* Hashtag Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm text-gray-700 font-medium">Include Hashtags</label>
                <p className="text-xs text-gray-500">Appends hashtags where appropriate</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.includeHashtags}
                onClick={() => setSettings({ ...settings, includeHashtags: !settings.includeHashtags })}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                  settings.includeHashtags ? "bg-violet-600" : "bg-gray-300"
                )}
              >
                <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow", settings.includeHashtags ? "translate-x-6" : "translate-x-1")} />
              </button>
            </div>

            {/* Emoji Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm text-gray-700 font-medium">Include Emojis</label>
                <p className="text-xs text-gray-500">Sprinkles emojis naturally in output</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.includeEmojis}
                onClick={() => setSettings({ ...settings, includeEmojis: !settings.includeEmojis })}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                  settings.includeEmojis ? "bg-black" : "bg-gray-300"
                )}
              >
                <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow", settings.includeEmojis ? "translate-x-6" : "translate-x-1")} />
              </button>
            </div>

            {/* X Account Type */}
            <div className="space-y-2">
              <label className="block text-sm text-black font-bold">X Account Type</label>
              <select
                value={settings.xAccountType}
                onChange={(e) => setSettings({ ...settings, xAccountType: e.target.value as any })}
                className="w-full bg-white border-2 border-black/10 rounded-lg px-3 py-2 text-sm text-black font-medium focus:outline-none focus:border-black shadow-sm"
              >
                <option value="basic">Basic (280 char limit)</option>
                <option value="premium">Premium (Longer posts allowed)</option>
              </select>
              <p className="text-xs text-gray-500">Affects X thread generation logic.</p>
            </div>

          </div>

          {/* Additional Platform Formats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
            {/* X Format Type */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-700 font-medium">X (Twitter) Format</label>
              <select
                value={settings.xFormat}
                onChange={(e) => setSettings({ ...settings, xFormat: e.target.value as any })}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-violet-500 shadow-sm"
              >
                <option value="thread">Full Thread (Multiple posts)</option>
                <option value="post">Single Post (Standalone)</option>
              </select>
            </div>

            {/* LinkedIn Format Type */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-700 font-medium">LinkedIn Format</label>
              <select
                value={settings.linkedinFormat}
                onChange={(e) => setSettings({ ...settings, linkedinFormat: e.target.value as any })}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-violet-500 shadow-sm"
              >
                <option value="post">Standard Feed Post</option>
                <option value="article">Long-form Article</option>
              </select>
            </div>
            
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className={cn(
          "w-full sm:w-auto px-8 py-4 bg-gray-900 border border-transparent shadow",
          "text-white font-semibold rounded-xl",
          "flex items-center justify-center space-x-2",
          "hover:bg-gray-800",
          "focus:outline-none focus:ring-2 focus:ring-gray-900/50 focus:ring-offset-2",
          "transition-all duration-200",
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
  );
}
