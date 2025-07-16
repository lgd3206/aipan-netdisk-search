// app/search/page.tsx
'use client';
import React, { useState } from 'react';

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`);
    const data = await res.json();
    setResults(data.results);
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">网盘资源聚合搜索</h1>
      <div className="flex mb-4">
        <input
          className="border p-2 flex-1"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="请输入关键词"
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? '搜索中...' : '搜索'}
        </button>
      </div>
      <div>
        {results.map((r, idx) => (
          <div key={idx} className="mb-4 border-b pb-2">
            <div className="font-semibold">{r.channel}</div>
            {r.error ? (
              <div className="text-red-500">该频道搜索失败</div>
            ) : (
              <ul className="list-disc pl-5">
                {r.data && r.data.length > 0 ? r.data.map((item: any, i: number) => (
                  <li key={i}>{item.title || JSON.stringify(item)}</li>
                )) : <li>无结果</li>}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
