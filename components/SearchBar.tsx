'use client';

import { useState } from 'react';

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (query: string) => void;
};

export default function SearchBar({
  placeholder = 'Search...',
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 m-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}