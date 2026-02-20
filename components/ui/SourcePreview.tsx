import Image from 'next/image';
import { FileText, Image as ImageIcon } from 'lucide-react';

interface SourcePreviewProps {
  imageUrl: string | null;
  title: string | null;
  extractedText: string;
}

export function SourcePreview({ imageUrl, title, extractedText }: SourcePreviewProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/30">
        <h2 className="text-lg font-semibold flex items-center space-x-2">
          <FileText className="w-5 h-5 text-violet-500" />
          <span>Source Preview</span>
        </h2>
      </div>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {imageUrl && (
            <div className="flex-shrink-0">
              <div className="relative w-full lg:w-64 h-48 rounded-xl overflow-hidden bg-zinc-800">
                <Image
                  src={imageUrl}
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

          <div className="flex-1">
            {title && (
              <h3 className="text-xl font-semibold text-white mb-3">
                {title}
              </h3>
            )}
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-zinc-400 leading-relaxed">
                {extractedText.substring(0, 500)}
                {extractedText.length > 500 && '...'}
              </p>
            </div>
            <div className="mt-4 flex items-center space-x-4 text-sm text-zinc-500">
              <span className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>{extractedText.length.toLocaleString()} characters</span>
              </span>
              {imageUrl && (
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
  );
}
