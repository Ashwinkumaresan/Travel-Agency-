// Fetch interceptor to automatically add JWT access token and handle transparent token refreshing
const originalFetch = window.fetch;

window.fetch = async function (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://api.backend.sasalemsuperservice.com/api/staff/';
  
  // Resolve URL string
  let url = '';
  if (typeof input === 'string') {
    url = input;
  } else if (input instanceof URL) {
    url = input.toString();
  } else {
    url = input.url;
  }
  
  const isApiRequest = 
    url.includes('/staff/') || 
    url.includes('/api/staff/') || 
    (apiUrl && url.startsWith(apiUrl));

  // Clone headers
  let headers = new Headers(init?.headers || {});
  
  if (isApiRequest && !headers.has('Authorization')) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const newInit = {
    ...init,
    headers
  };

  let response = await originalFetch(input, newInit);

  // If 401 Unauthorized and we have a refresh token, try to refresh
  if (response.status === 401 && isApiRequest && !url.includes('/token/refresh/')) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshResponse = await originalFetch(`${apiUrl}token/refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          const newAccessToken = data.access;
          
          localStorage.setItem('accessToken', newAccessToken);

          // Retry the original request with the new access token
          headers.set('Authorization', `Bearer ${newAccessToken}`);
          response = await originalFetch(input, {
            ...init,
            headers
          });
        } else {
          // Refresh token expired or invalid, log out the user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error('Error refreshing token via interceptor:', error);
      }
    }
  }

  return response;
};
