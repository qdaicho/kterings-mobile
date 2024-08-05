import React from 'react';
import { ReactNode, useState } from 'react';
import { SearchContext } from "@/hooks/SearchContext";

export const SearchProvider = ({ children }: {
    children: ReactNode
}) => {
    const [searchInput, setSearchInput] = useState('');

    return (
        <SearchContext.Provider value={{ searchInput, setSearchInput }}>
            {children}
        </SearchContext.Provider>
    );
}