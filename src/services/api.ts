import axios from 'axios';
import { NetworkStats, Block, BlockListResponse, HealthStatus, ApiResponse } from '../types/api';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const networkApi = {
  async getStats(): Promise<NetworkStats> {
    const response = await apiClient.get<ApiResponse<any>>('/network/stats');
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch network stats');
    }
  },

  async getInfo() {
    const response = await apiClient.get<ApiResponse<any>>('/network/info');
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch network info');
    }
  },

  async getPeers() {
    const response = await apiClient.get<ApiResponse<any>>('/network/peers');
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch peers');
    }
  },

  async getMetrics() {
    const response = await apiClient.get<ApiResponse<any>>('/network/metrics');
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch metrics');
    }
  },
};

export const blockApi = {
  async getBlocks(page: number = 1, perPage: number = 10): Promise<BlockListResponse> {
    const response = await apiClient.get<ApiResponse<Block[]>>(`/blocks?page=${page}&per_page=${perPage}`);
    
    if (response.data.success && response.data.data) {
      return {
        blocks: response.data.data,
        total: response.data.data.length,
        page: page,
        per_page: perPage
      };
    } else {
      throw new Error(response.data.message || 'Failed to fetch blocks');
    }
  },

  async getBlock(hash: string): Promise<Block> {
    const response = await apiClient.get<ApiResponse<Block>>(`/blocks/${hash}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch block');
    }
  },

  async createBlock(sensorData: any): Promise<ApiResponse<Block>> {
    const response = await apiClient.post<ApiResponse<Block>>('/blocks', sensorData);
    return response.data;
  },

  async sendBlock(hash: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(`/blocks/${hash}/send`);
    return response.data;
  },
};

export const healthApi = {
  async getHealth(): Promise<HealthStatus> {
    const response = await apiClient.get<ApiResponse<string>>('/health');
    if (response.data.success) {
      return {
        status: 'healthy',
        version: '0.1.0',
        uptime: 0,
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error(response.data.message || 'Health check failed');
    }
  },
};

export default apiClient;
