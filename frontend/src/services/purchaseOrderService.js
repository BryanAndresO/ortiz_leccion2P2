import axios from 'axios';

// Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8083/api/v1';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error: No response from server');
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

const purchaseOrderService = {
    /**
     * Get all purchase orders with optional filters
     * @param {Object} filters - Filter parameters (q, status, currency, minTotal, maxTotal, from, to)
     * @returns {Promise} Array of purchase orders
     */
    getAllPurchaseOrders: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            // Add filters to query params if they exist
            if (filters.q) params.append('q', filters.q);
            if (filters.status) params.append('status', filters.status);
            if (filters.currency) params.append('currency', filters.currency);
            if (filters.minTotal) params.append('minTotal', filters.minTotal);
            if (filters.maxTotal) params.append('maxTotal', filters.maxTotal);
            if (filters.from) params.append('from', filters.from);
            if (filters.to) params.append('to', filters.to);

            const queryString = params.toString();
            const url = `/purchase-orders${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get a single purchase order by ID
     * @param {number} id - Purchase order ID
     * @returns {Promise} Purchase order object
     */
    getPurchaseOrderById: async (id) => {
        try {
            const response = await apiClient.get(`/purchase-orders/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create a new purchase order
     * @param {Object} data - Purchase order data
     * @returns {Promise} Created purchase order
     */
    createPurchaseOrder: async (data) => {
        try {
            const response = await apiClient.post('/purchase-orders', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update an existing purchase order
     * @param {number} id - Purchase order ID
     * @param {Object} data - Updated purchase order data
     * @returns {Promise} Updated purchase order
     */
    updatePurchaseOrder: async (id, data) => {
        try {
            const response = await apiClient.put(`/purchase-orders/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete a purchase order
     * @param {number} id - Purchase order ID
     * @returns {Promise} Deletion confirmation
     */
    deletePurchaseOrder: async (id) => {
        try {
            const response = await apiClient.delete(`/purchase-orders/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default purchaseOrderService;
