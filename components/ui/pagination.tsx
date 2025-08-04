

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (

        // <div>
        //     <Button variant="outline" onClick={onPageChange}>Click</Button>
        // </div>
        <div className="pagination flex justify-end items-center gap-4 w-full text-white">
            <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
            </span>

            <div className="flex space-x-2">
<button
    className={`w-8 h-8 flex items-center justify-center ${
        currentPage > 1 ? 'bg-brand hover:brand-hover' : 'bg-gray-300'
    } disabled:opacity-50`}
    disabled={currentPage === 1}
    onClick={handlePrevious}
>
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
</button>

<button
    className={`w-8 h-8 flex items-center justify-center ${
        currentPage < totalPages ? 'bg-brand hover:brand-hover' : 'bg-gray-300'
    } disabled:opacity-50`}
    disabled={currentPage === totalPages}
    onClick={handleNext}
>
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
</button>
            </div>
        </div>
    )
}