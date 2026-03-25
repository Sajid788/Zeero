# Zeerostock - Inventory Search (Frontend Only)

## Search behavior
This UI runs the same logic as `GET /search`, but entirely in the browser using a dummy in-memory dataset.

Filters (all can be combined):
- `q`: case-insensitive partial match on `product name` (`includes`)
- `category`: case-insensitive exact match
- `minPrice`: item `price >= minPrice`
- `maxPrice`: item `price <= maxPrice`

Rules:
- If no filters are provided, the UI shows **all** results.
- Empty/whitespace `q` means "no `q` filter".
- Invalid prices (non-numeric) and `minPrice > maxPrice` show an error state.
- If filters yield 0 matches, it shows **“No results found”**.

## Performance improvement (for large datasets)
Precompute and index data once: store `nameLower` and `categoryLower` fields on each record and build a `category -> records[]` map. Then each search avoids repeated `toLowerCase()` and reduces scanning to only relevant categories.

