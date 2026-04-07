'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type SearchBarProps = {
  placeholder?: string;
};

export default function SearchBar({ placeholder = 'Search...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
      />

      <button
        type="submit"
        className="rounded bg-black px-4 py-2 text-white hover:opacity-90"
      >
        Search
      </button>
    </form>
  );
}
``