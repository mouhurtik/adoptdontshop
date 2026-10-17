import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getBrowsePageHref } from '@/lib/browse-pagination';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav aria-label="Browse pets pages" className="flex justify-center items-center gap-2 mt-12">
            {currentPage > 1 ? (
                <Link
                    href={getBrowsePageHref(currentPage - 1)}
                    rel="prev"
                    aria-label="Previous page of pets"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-playful-text transition-colors hover:bg-playful-cream"
                >
                    <ChevronLeft aria-hidden="true" className="w-6 h-6" />
                </Link>
            ) : (
                <span aria-disabled="true" className="flex h-11 w-11 items-center justify-center rounded-full text-playful-text opacity-50">
                    <ChevronLeft aria-hidden="true" className="w-6 h-6" />
                </span>
            )}

            {pageNumbers.map((number) => (
                <Link
                    key={number}
                    href={getBrowsePageHref(number)}
                    aria-current={currentPage === number ? 'page' : undefined}
                    className={`flex h-11 min-w-11 items-center justify-center rounded-full font-bold transition-[background-color,box-shadow,transform] duration-200 ${currentPage === number
                        ? 'bg-playful-coral text-white shadow-md scale-110'
                        : 'bg-white text-gray-600 hover:bg-playful-cream'
                        }`}
                >
                    {number}
                </Link>
            ))}

            {currentPage < totalPages ? (
                <Link
                    href={getBrowsePageHref(currentPage + 1)}
                    rel="next"
                    aria-label="Next page of pets"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-playful-text transition-colors hover:bg-playful-cream"
                >
                    <ChevronRight aria-hidden="true" className="w-6 h-6" />
                </Link>
            ) : (
                <span aria-disabled="true" className="flex h-11 w-11 items-center justify-center rounded-full text-playful-text opacity-50">
                    <ChevronRight aria-hidden="true" className="w-6 h-6" />
                </span>
            )}
        </nav>
    );
};

export default Pagination;



