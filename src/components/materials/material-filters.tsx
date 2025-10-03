'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebouncedCallback } from 'use-debounce';
import type { Subject, FileType } from '@/lib/types';
import { useState, useEffect } from 'react';
import { getSubjects } from '@/lib/actions';

const fileTypes: (FileType | 'All')[] = ['All', 'pdf', 'image', 'video'];

export function MaterialFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [subjects, setSubjects] = useState<(Subject | {id: 'All', name: 'All'})[]>([]);

  useEffect(() => {
    async function fetchSubjects() {
      const fetchedSubjects = await getSubjects();
      setSubjects([{id: 'All', name: 'All'}, ...fetchedSubjects]);
    }
    fetchSubjects();
  }, []);

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-card">
      <div className="sm:col-span-2 lg:col-span-1">
        <Input
          placeholder="Search by filename..."
          defaultValue={searchParams.get('query')?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <Select
        defaultValue={searchParams.get('subject')?.toString() || 'All'}
        onValueChange={(value) => handleFilterChange('subject', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by subject" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((s) => (
            <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
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
