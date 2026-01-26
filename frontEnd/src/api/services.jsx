// src/api/services.js
export async function fetchServices(token = null) {
  try {
    const headers = token
      ? { Authorization: `Token ${token}` }
      : {};
    
    const response = await fetch("https://buildmywebsites-production.up.railway.app/api/services/", { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Failed to fetch services:", err);
    throw err;
  }
}
