import InventorySearch from "./components/InventorySearch.jsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <h1 className="text-2xl font-semibold tracking-tight">Zeerostock</h1>
          <p className="mt-1 text-sm text-gray-600">Search surplus inventory across suppliers.</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <InventorySearch />
      </main>
    </div>
  );
}

