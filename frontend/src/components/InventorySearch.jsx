import { useMemo, useState } from "react";
import { inventory } from "../data/inventory.js";
import { searchInventory } from "../lib/searchInventory.js";

export default function InventorySearch() {
  const categories = useMemo(() => {
    const set = new Set(inventory.map((x) => x.category));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, []);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [results, setResults] = useState(inventory);
  const [error, setError] = useState(null);

  const hasAnyFilter = useMemo(() => {
    const qTrim = q.trim();
    return (
      qTrim.length > 0 ||
      (category && category !== "All") ||
      minPrice.trim().length > 0 ||
      maxPrice.trim().length > 0
    );
  }, [q, category, minPrice, maxPrice]);

  function onSearch(e) {
    e.preventDefault();
    setError(null);

    const res = searchInventory(inventory, { q, category, minPrice, maxPrice });
    if (res.error) {
      setResults([]);
      setError(res.error);
      return;
    }
    setResults(res.results);
  }

  function onClear() {
    setQ("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setError(null);
    setResults(inventory);
  }

  return (
    <section>
      <form onSubmit={onSearch} className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="q">
              Product name
            </label>
            <input
              id="q"
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. keyboard, SSD..."
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div className="md:col-span-3">
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="minPrice">
              Min price
            </label>
            <input
              id="minPrice"
              inputMode="decimal"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="maxPrice">
              Max price
            </label>
            <input
              id="maxPrice"
              inputMode="decimal"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="1000"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-gray-500">
            {hasAnyFilter ? "Applying combined filters." : "No filters: showing all results."}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-200"
            >
              Search
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200"
            >
              Clear
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </form>

      <div className="mt-5">
        {results.length === 0 && !error ? (
          <div className="rounded-xl border bg-white p-6 text-center text-sm text-gray-600">
            No results found
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-white">
            <div className="px-4 py-3 text-sm text-gray-600">
              Showing {results.length} result{results.length === 1 ? "" : "s"}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Supplier</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((item) => (
                    <tr key={item.id} className="border-t last:border-b">
                      <td className="px-4 py-3 text-gray-900">{item.name}</td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3">{item.supplier}</td>
                      <td className="px-4 py-3 tabular-nums">${Number(item.price).toFixed(2)}</td>
                      <td className="px-4 py-3 tabular-nums">{item.stockQty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

