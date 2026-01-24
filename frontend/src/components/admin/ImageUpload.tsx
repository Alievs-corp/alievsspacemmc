import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, folder = 'images', label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const result = await api.admin.uploadFile(file, folder, true);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium mb-1 text-white">{label}</label>
      )}
      {value && (
        <div className="mb-2">
          <img 
            src={value} 
            alt="Preview" 
            className="max-w-xs max-h-48 object-contain rounded border border-[#546691]"
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#133FA6] file:text-white hover:file:bg-[#0f2f78] file:cursor-pointer disabled:opacity-50"
        />
        {value && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => onChange('')}
            disabled={uploading}
          >
            Remove
          </Button>
        )}
      </div>
      {uploading && (
        <p className="text-sm text-[#808087]">Uploading...</p>
      )}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
