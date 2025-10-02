'use client';
import { PaginationControls } from '@/components/shared/pagination';
import { MaterialFilters } from '@/components/materials/material-filters';
import { MaterialCard } from '@/components/materials/material-card';
import type { Subject, FileType, CourseMaterial } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, startAfter, getDocs, getCountFromServer } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const PAGE_SIZE = 6;

export default function MaterialsPage({ searchParams }: { 
    searchParams?: { 
        page?: string;
        subject?: Subject | 'All';
        fileType?: FileType | 'All';
        query?: string;
    } 
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const firestore = useFirestore();
  const [lastVisible, setLastVisible] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const materialsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    
    const constraints = [];
    if(searchParams?.subject && searchParams.subject !== 'All') {
        constraints.push(where('subject', '==', searchParams.subject));
    }
    if(searchParams?.fileType && searchParams.fileType !== 'All') {
        constraints.push(where('fileType', '==', searchParams.fileType));
    }

    let q = query(
        collection(firestore, 'course_materials'),
        ...constraints,
        orderBy('uploadDate', 'desc'),
        limit(PAGE_SIZE)
    );

    if (currentPage > 1 && lastVisible) {
        q = query(
            collection(firestore, 'course_materials'),
            ...constraints,
            orderBy('uploadDate', 'desc'),
            startAfter(lastVisible),
            limit(PAGE_SIZE)
        );
    }
    // Cannot query by filename text search with firestore client SDK easily, so filtering client side.
    return q;
  }, [firestore, currentPage, lastVisible, searchParams?.subject, searchParams?.fileType]);

  const { data: materials, isLoading } = useCollection<CourseMaterial>(materialsQuery, true);

  const filteredMaterials = useMemoFirebase(() => {
    if(!materials) return [];
    if (searchParams?.query) {
      return materials.filter(m => m.filename.toLowerCase().includes(searchParams.query.toLowerCase()));
    }
    return materials;
  }, [materials, searchParams?.query])


  useEffect(() => {
    if(firestore) {
        const constraints = [];
        if(searchParams?.subject && searchParams.subject !== 'All') {
            constraints.push(where('subject', '==', search-Params.subject));
        }
        if(searchParams?.fileType && searchParams.fileType !== 'All') {
            constraints.push(where('fileType', '==', searchParams.fileType));
        }
        const countQuery = query(collection(firestore, 'course_materials'), ...constraints);
        getCountFromServer(countQuery).then(snapshot => {
            setTotalPages(Math.ceil(snapshot.data().count / PAGE_SIZE));
        });

        if (currentPage > 1) {
            const fetchLastVisible = async () => {
                const firstPageQuery = query(collection(firestore, 'course_materials'), ...constraints, orderBy('uploadDate', 'desc'), limit(PAGE_SIZE * (currentPage - 1)));
                const documentSnapshots = await getDocs(firstPageQuery);
                const last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
                setLastVisible(last);
            }
            fetchLastVisible();
        } else {
            setLastVisible(null);
        }
    }
  }, [firestore, currentPage, searchParams?.subject, searchParams?.fileType]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Course Materials</h1>
        <p className="text-muted-foreground mt-1">Find lecture notes, videos, and other resources.</p>
      </div>
      
      <MaterialFilters />
      
      {isLoading ? <p>Loading materials...</p> : (
        <>
            {filteredMaterials && filteredMaterials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMaterials.map((material) => (
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
        </>
      )}
    </div>
  );
}
