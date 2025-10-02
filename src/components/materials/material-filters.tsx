'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebouncedCallback } from 'use-debounce';
import type { Subject, FileType } from '@/lib/types';

const subjects: (Subject | 'All')[] = ['All', 'Statistics', 'Physics', 'English', 'Mathematics', 'Computer Science'];
const fileTypes: (FileType | 'All')[] = ['All', 'pdf', 'image', 'video'];

export function MaterialFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (value && value !== 'All') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    handleFilterChange('query', term);
  }, 300);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-card">
      <Input
        placeholder="Search by filename..."
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Select
        defaultValue={searchParams.get('subject')?.toString() || 'All'}
        onValueChange={(value) => handleFilterChange('subject', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by subject" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={searchParams.get('fileType')?.toString() || 'All'}
        onValueChange={(value) => handleFilterChange('fileType', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by file type" />
        </SelectTrigger>
        <SelectContent>
          {fileTypes.map((ft) => (
            <SelectItem key={ft} value={ft}>{ft.charAt(0).toUpperCase() + ft.slice(1)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
