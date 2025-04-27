import { useEffect, useState } from 'react';

export const usePagination = (container: Array<unknown>, pageSize: number = 10) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setTotalPages(Math.ceil(container.length / pageSize));
    }, [container]);

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    return {
        currentPage,
        totalPages,
        prevPage,
        nextPage,
    };
};
