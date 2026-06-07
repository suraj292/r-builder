/**
 * ResumeAI - Strongly Typed API Client Wrapper
 * Handles backend requests, token injects, response parsing, and error normalization.
 */

const BASE_URL = '/api'; // Proxied via Vite dev server to http://127.0.0.1:8000/api

interface RequestOptions extends RequestInit {
    body?: any;
}

class APIError extends Error {
    status: number;
    data: any;

    constructor(message: string, status: number, data: any = null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Retrieves the stored authentication token.
 */
export const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

/**
 * Stores the authentication token.
 */
export const setAuthToken = (token: string): void => {
    localStorage.setItem('auth_token', token);
};

/**
 * Clears the authentication token (Logout).
 */
export const clearAuthToken = (): void => {
    localStorage.removeItem('auth_token');
};

/**
 * Core Request Dispatcher
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const token = getAuthToken();
    
    // Set headers
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }
    
    // Inject Bearer token if active
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    // Serialize body if JSON
    if (options.body && !(options.body instanceof FormData)) {
        config.body = JSON.stringify(options.body);
    }

    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, config);
        
        // Handle no content / success redirects
        if (response.status === 204) {
            return {} as T;
        }

        let responseData: any;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        if (!response.ok) {
            // Normalize server-side error messages
            const errorMessage = 
                responseData?.detail || 
                responseData?.message || 
                `Request failed with status code ${response.status}`;
            
            // If token expired, clear auth details
            if (response.status === 401) {
                clearAuthToken();
            }

            throw new APIError(errorMessage, response.status, responseData);
        }

        return responseData as T;
    } catch (error: any) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError(error.message || 'Network error occurred', 500);
    }
}

/**
 * Export HTTP wrapper methods
 */
export const api = {
    get: <T>(endpoint: string, options?: RequestInit) => 
        request<T>(endpoint, { ...options, method: 'GET' }),
        
    post: <T>(endpoint: string, body?: any, options?: RequestInit) => 
        request<T>(endpoint, { ...options, method: 'POST', body }),
        
    put: <T>(endpoint: string, body?: any, options?: RequestInit) => 
        request<T>(endpoint, { ...options, method: 'PUT', body }),
        
    patch: <T>(endpoint: string, body?: any, options?: RequestInit) => 
        request<T>(endpoint, { ...options, method: 'PATCH', body }),
        
    delete: <T>(endpoint: string, options?: RequestInit) => 
        request<T>(endpoint, { ...options, method: 'DELETE' }),
};
