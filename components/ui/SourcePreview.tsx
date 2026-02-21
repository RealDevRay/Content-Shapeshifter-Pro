import Image from 'next/image';
import { FileText, Image as ImageIcon } from 'lucide-react';

interface SourcePreviewProps {
  imageUrl: string | null;
  title: string | null;
  extractedText: string;
}

export function SourcePreview({ imageUrl, title, extractedText }: SourcePreviewProps) {
  return (
    <div className="bg-white border-2 border-black/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b-2 border-black/10 bg-[#FAFAFA]">
        <h2 className="text-lg font-bold flex items-center space-x-2 text-black">
          <FileText className="w-5 h-5 text-black" />
          <span>Source Preview</span>
        </h2>
      </div>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {imageUrl && (
            <div className="flex-shrink-0">
              <div className="relative w-full lg:w-64 h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={imageUrl}
                  alt="Extracted image"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent" />
              </div>
            </div>
          )}

          <div className="flex-1">
            {title && (
              <h3 className="text-xl font-bold text-black mb-3 tracking-tight">
                {title}
              </h3>
            )}
            <div className="prose prose-sm max-w-none">
              <p className="text-black font-medium leading-relaxed text-base">
                {extractedText.substring(0, 500)}
                {extractedText.length > 500 && '...'}
              </p>
            </div>
            <div className="mt-4 flex items-center space-x-4 text-sm text-black font-semibold">
              <span className="flex items-center space-x-1 bg-black/5 px-3 py-1 rounded-full">
                <FileText className="w-4 h-4" />
                <span>{extractedText.length.toLocaleString()} characters</span>
              </span>
              {imageUrl && (
                <span className="flex items-center space-x-1 bg-black/5 px-3 py-1 rounded-full">
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
