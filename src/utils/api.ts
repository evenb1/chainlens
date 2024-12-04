export async function fetchData(url: string, options: RequestInit = {}) {
    const response = await fetch(url, options);
  
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
  
    return await response.json();
  }
  