"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ApiMessage() {
  const { data, isLoading } = useSWR("/api/hello", fetcher);
  return (
    <div className="rounded-2xl border p-4">
      <h3 className="text-sm mb-3 opacity-70">/api/hello</h3>
      <p className="text-lg">{isLoading ? "…" : data?.message}</p>
    </div>
  );
}
