// Centralized API service module for backend calls
export async function fetchHotels(searchParams) {
    try {
      const response = await fetch('/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams)
      });
      if (!response.ok) {
        // Attempt to extract error message from response
        let message = `Error ${response.status}`;
        try {
          const errData = await response.json();
          message = errData.message || message;
        } catch {
          const errText = await response.text();
          if (errText) message = errText;
        }
        throw new Error(message);
      }
      // Parse JSON on success
      return await response.json();
    } catch (error) {
      console.error('fetchHotels error:', error);
      throw error;
    }
  }
  
  export async function generateItinerary(params) {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!response.ok) {
        let message = `Error ${response.status}`;
        try {
          const errData = await response.json();
          message = errData.message || message;
        } catch {
          const errText = await response.text();
          if (errText) message = errText;
        }
        throw new Error(message);
      }
      return await response.json();
    } catch (error) {
      console.error('generateItinerary error:', error);
      throw error;
    }
  }
  // ADD just below generateItinerary
export async function recommendDestinations(params) {
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('recommendDestinations error:', err);
      throw err;
    }
  }
// Add below existing exports
export async function searchHotels(params) {
    try {
      const res = await fetch('/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('searchHotels error:', err);
      throw err;
    }
  }
    
export async function searchFlights(params) {
  try {
    const res = await fetch('/api/flights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('searchFlights error:', err);
    throw err;
  }
}

export async function fetchAllDestinations() {
  try {
    const res = await fetch('/api/destinations');
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAllDestinations error:', err);
    throw err;
  }
}
export async function fetchAllTours() {
  try {
    const res = await fetch('/api/tours');
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAllTours error:', err);
    throw err;
  }
}


export async function fetchDestinationByName(name) {
  try {
    const res = await fetch(`/api/destinations/${encodeURIComponent(name)}`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchDestinationByName error:', err);
    throw err;
  }

  
}
