'use client';
import { PaginationControls } from '@/components/shared/pagination';
import { MaterialFilters } from '@/components/materials/material-filters';
import { MaterialCard } from '@/components/materials/material-card';
import type { Subject, FileType, CourseMaterial } from '@/lib/types';
import { getAllCourseMaterials } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MaterialCardSkeleton } from '@/components/shared/loading-skeletons';

const PAGE_SIZE = 6;

export default function MaterialsPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const subjectFilter = searchParams.get('subject');
  const fileTypeFilter = searchParams.get('fileType') as FileType | 'All' | null;
  const query = searchParams.get('query');
  const levelFilter = searchParams.get('level');

  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMaterials() {
      setIsLoading(true);
      const courseMaterials = await getAllCourseMaterials();
      let filtered = courseMaterials;

      if (levelFilter) {
        filtered = filtered.filter(m => m.level === levelFilter);
      }
      if (subjectFilter && subjectFilter !== 'All') {
        filtered = filtered.filter(m => m.subject === subjectFilter);
      }
      if (fileTypeFilter && fileTypeFilter !== 'All') {
        filtered = filtered.filter(m => m.fileType === fileTypeFilter);
      }
      if (query) {
        filtered = filtered.filter(m => m.filename.toLowerCase().includes(query.toLowerCase()));
      }

      const sorted = filtered.sort((a,b) => b.uploadDate.getTime() - a.uploadDate.getTime());

      const pages = Math.ceil(sorted.length / PAGE_SIZE);
      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      setMaterials(sorted.slice(start, end));
      setTotalPages(pages);
      setIsLoading(false);
    }
    loadMaterials();
  }, [currentPage, subjectFilter, fileTypeFilter, query, levelFilter]);

  return (
    <div className="space-y-6">
      <div className="animate-in">
        <h1 className="font-headline text-3xl font-bold">Course Materials</h1>
        <p className="text-muted-foreground mt-1">Find lecture notes, videos, and other resources.</p>
      </div>
      
      <MaterialFilters />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MaterialCardSkeleton key={i} />
          ))}
        </div>
      ) : materials && materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((material) => (
              <div key={material.id} className="animate-in">
                <MaterialCard material={material} />
              </div>
          ))}
          </div>
      ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg animate-in">
              <h3 className="font-semibold text-xl">No Materials Found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria.</p>
          </div>
      )}

      {totalPages > 1 && <PaginationControls totalPages={totalPages} className="mt-8" />}
    </div>
  );
}
