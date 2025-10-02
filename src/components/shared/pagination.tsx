'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface Props {
  totalPages: number;
  className?: string;
}

export function PaginationControls({ totalPages, className }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className={cn(className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            as={Link}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={createPageURL(page)} isActive={currentPage === page} as={Link}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={createPageURL(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
            as={Link}
            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
