// src/api/services.js
export async function fetchServices(token = null) {
  try {
    const headers = token
      ? { Authorization: `Token ${token}` }
      : {};
    
    const response = await fetch("http://127.0.0.1:8000/api/services/", { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Failed to fetch services:", err);
    throw err;
  }
}
