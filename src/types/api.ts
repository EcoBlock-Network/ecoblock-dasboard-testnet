export interface NetworkInfo {
  node_id: string;
  peer_count: number;
  block_count: number;
  uptime: number;
  status: string;
  version: string;
  network_type: string;
}

export interface Peer {
  id: string;
  address: string;
  connected_at: string;
  last_seen: string;
  status: string;
}

export interface NetworkMetrics {
  total_blocks: number;
  blocks_per_minute: number;
  average_latency: number;
  network_health: number;
  active_peers: number;
  total_peers: number;
  active_connections: number;
  messages_sent: number;
  messages_received: number;
  bytes_sent: number;
  bytes_received: number;
}

export interface NetworkStats {
  info: NetworkInfo;
  peers: Peer[];
  metrics: NetworkMetrics;
}

export interface SensorData {
  pm25: number;
  co2: number;
  temperature: number;
  humidity: number;
  timestamp: number;
}

export interface Block {
  hash: string;
  timestamp: number;
  sensor_data: SensorData;
  signature: string;
  parent_hashes: string[];
}

export interface BlockListResponse {
  blocks: Block[];
  total: number;
  page: number;
  per_page: number;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
