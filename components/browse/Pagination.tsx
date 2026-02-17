import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-playful-cream disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-playful-text"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`w-10 h-10 rounded-full font-bold transition-all duration-300 ${currentPage === number
                        ? 'bg-playful-coral text-white shadow-md scale-110'
                        : 'bg-white text-gray-600 hover:bg-playful-cream'
                        }`}
                >
                    {number}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full hover:bg-playful-cream disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-playful-text"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
};

export default Pagination;



