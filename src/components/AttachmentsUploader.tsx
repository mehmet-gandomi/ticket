import { useRef, useState } from 'react';
import { Button } from './Button';
import { Plus, Close } from '../icons';

interface AttachedFile {
  id: string;
  file: File;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getExt(name: string): string {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
}

export function AttachmentsUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<AttachedFile[]>([]);

  function handleAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const next: AttachedFile[] = selected.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
    }));
    setFiles((prev) => [...prev, ...next]);
    e.target.value = '';
  }

  function handleRemove(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[13px] font-bold text-ink-900 text-right">ضمیمه فایل</span>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-3 h-12">
        <Button
          variant="gray"
          size="sm"
          leadingIcon={<Plus size={14} />}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          افزودن فایل
        </Button>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-ink-500">پسوند های مجاز</span>
          <span className="text-brand">SVG, PNG, JPG or GIF</span>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".svg,.png,.jpg,.jpeg,.gif"
        multiple
        className="hidden"
        onChange={handleAdd}
      />

      {files.map(({ id, file }) => (
        <div key={id} className="flex items-center gap-4 rounded-xl border border-line bg-white p-3">
          <div className="size-10 rounded-lg bg-brand-tint text-brand grid place-items-center text-[10px] font-bold shrink-0">
            {getExt(file.name)}
          </div>
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <div className="flex items-center justify-between text-[13px] gap-2">
              <span className="text-ink-500 tabular shrink-0">{formatSize(file.size)}</span>
              <span className="text-ink-900 truncate text-right">{file.name}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
              <div className="h-full w-full bg-brand" />
            </div>
          </div>
          <button
            type="button"
            className="size-8 grid place-items-center text-ink-700 hover:text-danger transition shrink-0"
            onClick={() => handleRemove(id)}
          >
            <Close size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
