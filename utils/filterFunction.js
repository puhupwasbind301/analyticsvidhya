export function fetchDataAndFilter(data, keyword) {
    if (!Array.isArray(data) || typeof keyword !== "string") return [];
  
    return data.filter((item) =>
      item.title?.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  