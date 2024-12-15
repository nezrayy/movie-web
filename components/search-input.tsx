"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SearchInput = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Ganti spasi dengan "+"
      const formattedQuery = query.replace(/ /g, '+');
      router.push(`/search?search_query=${formattedQuery}`);
    }
  };

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder="Search..."
      className="border p-2 rounded text-white lg:hidden"
    />
  );
};

export default SearchInput;
