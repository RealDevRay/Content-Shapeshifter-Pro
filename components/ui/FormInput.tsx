import { Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import React from 'react';

interface FormInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function FormInput({ input, setInput, isLoading, onSubmit }: FormInputProps) {
  const isUrl = input.trim().startsWith('http://') || input.trim().startsWith('https://');

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
  );
}
