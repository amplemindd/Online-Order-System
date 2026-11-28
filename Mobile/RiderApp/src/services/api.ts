const API_BASE_URL = 'http://localhost:5000/api';

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string,
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

const responseText = await response.text();

let data: any;

try {
  data = responseText ? JSON.parse(responseText) : {};
} catch (error) {
  console.error('NON-JSON API RESPONSE:', {
    endpoint,
    status: response.status,
    contentType: response.headers.get('content-type'),
    body: responseText.substring(0, 300),
  });

  throw new Error(
    `Non-JSON response from ${endpoint} (HTTP ${response.status})`,
  );
}


  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }

  return data;
};

export default API_BASE_URL;