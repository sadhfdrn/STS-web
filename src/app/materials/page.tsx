import { getMaterials } from '@/lib/mock-data';
import { PaginationControls } from '@/components/shared/pagination';
import { MaterialFilters } from '@/components/materials/material-filters';
import { MaterialCard } from '@/components/materials/material-card';
import type { Subject, FileType } from '@/lib/types';

export default function MaterialsPage({ searchParams }: { 
    searchParams?: { 
        page?: string;
        subject?: Subject | 'All';
        fileType?: FileType | 'All';
        query?: string;
    } 
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const { data: materials, totalPages } = getMaterials({ 
    page: currentPage, 
    limit: 6,
    subject: searchParams?.subject,
    fileType: searchParams?.fileType,
    query: searchParams?.query,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Course Materials</h1>
        <p className="text-muted-foreground mt-1">Find lecture notes, videos, and other resources.</p>
      </div>
      
      <MaterialFilters />

      {materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="font-semibold text-xl">No Materials Found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {totalPages > 1 && <PaginationControls totalPages={totalPages} className="mt-8" />}
    </div>
  );
}
