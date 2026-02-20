import { useState } from 'react';
import { toast } from 'sonner';
import { TransformResponse } from '@/src/lib/prompts';

export function useTransform() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TransformResponse | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
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

  const reset = () => {
    setInput('');
    setResult(null);
  };

  return {
    input,
    setInput,
    isLoading,
    result,
    handleSubmit,
    reset,
  };
}
