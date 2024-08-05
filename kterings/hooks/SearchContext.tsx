import React, {createContext} from "react";

type SearchContextType = {
    searchInput: string;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
};

export const SearchContext = createContext<SearchContextType | undefined>(undefined);