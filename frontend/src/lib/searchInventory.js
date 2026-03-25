export function searchInventory(data, { q, category, minPrice, maxPrice }) {
  const qTrim = (q ?? "").toString().trim();
  const qLower = qTrim.length > 0 ? qTrim.toLowerCase() : null;

  const categoryTrim = (category ?? "").toString().trim();
  const categoryLower = categoryTrim.length > 0 && categoryTrim.toLowerCase() !== "all" ? categoryTrim.toLowerCase() : null;

  const minRaw = minPrice === undefined || minPrice === null ? "" : minPrice;
  const maxRaw = maxPrice === undefined || maxPrice === null ? "" : maxPrice;

  const minTrim = minRaw.toString().trim();
  const maxTrim = maxRaw.toString().trim();

  const minNum = minTrim === "" ? null : Number(minTrim);
  const maxNum = maxTrim === "" ? null : Number(maxTrim);

  if (minNum !== null && Number.isNaN(minNum)) {
    return { results: [], error: "Invalid minPrice" };
  }
  if (maxNum !== null && Number.isNaN(maxNum)) {
    return { results: [], error: "Invalid maxPrice" };
  }
  if (minNum !== null && maxNum !== null && minNum > maxNum) {
    return { results: [], error: "Invalid price range: minPrice cannot be greater than maxPrice" };
  }

  const hasQFilter = qLower !== null;
  const hasCategoryFilter = categoryLower !== null;
  const hasMinFilter = minNum !== null;
  const hasMaxFilter = maxNum !== null;

  
  if (!hasQFilter && !hasCategoryFilter && !hasMinFilter && !hasMaxFilter) {
    return { results: data, error: null };
  }

  const results = data.filter((item) => {
    if (hasQFilter) {
      const name = String(item.name ?? "").toLowerCase();
      if (!name.includes(qLower)) return false;
    }

    if (hasCategoryFilter) {
      const cat = String(item.category ?? "").toLowerCase();
      if (cat !== categoryLower) return false;
    }

    if (hasMinFilter) {
      if (Number(item.price) < minNum) return false;
    }
    if (hasMaxFilter) {
      if (Number(item.price) > maxNum) return false;
    }

    return true;
  });

  return { results, error: null };
}

