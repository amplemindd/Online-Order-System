
const API_BASE_URL = 'https://online-order-system-1.onrender.com/api';

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

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const responseText = await response.text();

    let data: any = {};

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      throw new Error(
        `Invalid server response. HTTP ${response.status}`,
      );
    }

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong.');
    }

    return data;
  } catch (error: any) {
    console.error('API REQUEST ERROR:', error);

    if (error.message === 'Network request failed') {
      throw new Error(
        'Unable to connect to server. Please check your internet connection or server URL.',
      );
    }

    throw error;
  }
};

export default API_BASE_URL;
