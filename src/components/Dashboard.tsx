import React, { useState, useEffect } from 'react';
import { Activity, Wifi, Server, Database, AlertTriangle, Play, Pause, Network, BarChart3 } from 'lucide-react';
import { NetworkStats, HealthStatus } from '../types/api';
import { networkApi, healthApi } from '../services/api';

const Dashboard: React.FC = () => {
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  const loadDemoData = () => {
    setNetworkStats({
      info: {
        node_id: "demo-node-12345",
        peer_count: 3,
        block_count: 42,
        uptime: 3665,
        status: "active",
        version: "0.1.0",
        network_type: "testnet"
      },
      peers: [
        {
          id: "peer-001",
          address: "192.168.1.100:8080",
          connected_at: new Date().toISOString(),
          last_seen: new Date().toISOString(),
          status: "connected"
        },
        {
          id: "peer-002", 
          address: "192.168.1.101:8080",
          connected_at: new Date(Date.now() - 60000).toISOString(),
          last_seen: new Date().toISOString(),
          status: "connected"
        }
      ],
      metrics: {
        total_blocks: 42,
        blocks_per_minute: 2.5,
        average_latency: 45.2,
        network_health: 0.95,
        active_peers: 3,
        total_peers: 3,
        active_connections: 3,
        messages_sent: 156,
        messages_received: 143,
        bytes_sent: 12480,
        bytes_received: 11520
      }
    });
    
    setHealth({
      status: "healthy",
      version: "0.1.0",
      uptime: 3665,
      timestamp: new Date().toISOString()
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (demoMode) {
        return;
      }
      
      try {
        setLoading(true);
        const [statsData, healthData] = await Promise.all([
          networkApi.getStats(),
          healthApi.getHealth(),
        ]);
        setNetworkStats(statsData);
        setHealth(healthData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        
        if (err instanceof Error && err.message.includes('ECONNREFUSED')) {
          setDemoMode(true);
          loadDemoData();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const interval = setInterval(() => {
      if (!demoMode) {
        fetchData();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [demoMode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="eco-card-glass p-8 rounded-3xl text-center">
          <div className="rounded-full h-12 w-12 border-4 border-mint-300 border-t-mint-600 mx-auto mb-4"></div>
          <div className="flex items-center justify-center mb-2">
            <Activity className="h-5 w-5 text-mint-600 mr-2" />
            <span className="text-eco-primary text-lg font-medium">Chargement des données réseau...</span>
          </div>
          <div className="mt-3 text-eco-secondary text-sm">Connexion au réseau EcoBlock</div>
        </div>
      </div>
    );
  }

  if (error && !demoMode) {
    return (
      <div className="space-y-6 p-6">
        <div className="eco-card-glass rounded-2xl p-6 border border-red-200/50">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <span className="text-red-700 font-semibold">Erreur de Connexion: {error}</span>
          </div>
        </div>
        
        {error.includes('ECONNREFUSED') && (
          <div className="eco-card floating-card">
            <div className="eco-card-header">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-xl font-semibold text-eco-primary">
                  Serveur API Non Démarré
                </h3>
              </div>
            </div>
            <div className="eco-card-body space-y-4">
              <p className="text-eco-secondary">
                Le serveur API EcoBlock n'est pas en cours d'exécution. Pour le démarrer, exécutez la commande suivante dans un terminal :
              </p>
              <div className="bg-forest-900 text-mint-400 p-4 rounded-xl font-mono text-sm border border-forest-700">
                cd /Users/malohenry/Projects/EcoBlock/libs/ecoblock-demo<br/>
                cargo run -- node --tcp-port 9001 --udp-port 9002 --api-port 9000
              </div>
              <p className="text-eco-secondary text-sm">
                Le serveur devrait démarrer sur le port 9000 et ce tableau de bord se connectera automatiquement une fois qu'il sera en cours d'exécution.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setDemoMode(true);
                    setError(null);
                    loadDemoData();
                  }}
                  className="btn-eco-primary flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Essayer le Mode Démo</span>
                </button>
                <button
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    setDemoMode(false);
                  }}
                  className="btn-eco-secondary flex items-center space-x-2"
                >
                  <Activity className="h-4 w-4" />
                  <span>Réessayer la Connexion</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="gradient-eco-header text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-mint-400/20 to-sage-400/20"></div>
        <div className="relative flex justify-between items-start">
          <div className="flex items-center">
            <Activity className="h-10 w-10 text-white mr-4" />
            <div>
              <h1 className="text-4xl font-bold mb-3 drop-shadow-lg">EcoBlock Network</h1>
              <p className="text-mint-100 text-lg">Surveillance temps réel du réseau de capteurs décentralisé</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                if (demoMode) {
                  setDemoMode(false);
                  setError(null);
                  setLoading(true);
                } else {
                  setDemoMode(true);
                  setError(null);
                  loadDemoData();
                }
              }}
              className="btn-eco-secondary backdrop-blur-sm flex items-center space-x-2"
            >
              {demoMode ? (
                <>
                  <Play className="h-5 w-5" />
                  <span>Données Live</span>
                </>
              ) : (
                <>
                  <Pause className="h-5 w-5" />
                  <span>Mode Démo</span>
                </>
              )}
            </button>
          </div>
        </div>
        {demoMode && (
          <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="flex items-center">
              <Play className="h-5 w-5 text-white/90 mr-2" />
              <p className="text-sm text-white/90">
                <strong>Mode Démo</strong> - Affichage de données d'exemple. Démarrez le serveur API pour voir les données en temps réel.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EcoStatusCard
          title="Santé du Réseau"
          value={health?.status || 'inconnue'}
          icon={<Activity className="h-7 w-7" />}
          color={health?.status === 'healthy' ? 'mint' : 'red'}
        />
        <EcoStatusCard
          title="Pairs Connectés"
          value={networkStats?.metrics?.active_connections || 0}
          icon={<Wifi className="h-7 w-7" />}
          color="sage"
        />
        <EcoStatusCard
          title="Total des Pairs"
          value={networkStats?.metrics?.total_peers || 0}
          icon={<Server className="h-7 w-7" />}
          color="forest"
        />
        <EcoStatusCard
          title="Messages Envoyés"
          value={networkStats?.metrics?.messages_sent || 0}
          icon={<Database className="h-7 w-7" />}
          color="stone"
        />
      </div>

      {/* Network Info */}
      {networkStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="eco-card floating-card">
            <div className="eco-card-header">
              <div className="flex items-center">
                <Network className="h-6 w-6 text-mint-600 mr-3" />
                <h3 className="text-xl font-semibold text-eco-primary">
                  Informations Réseau
                </h3>
              </div>
            </div>
            <div className="eco-card-body">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gradient-eco-soft rounded-xl">
                  <span className="text-eco-secondary font-medium">ID du Nœud:</span>
                  <span className="font-mono text-sm text-eco-primary bg-white/60 px-3 py-1 rounded-lg">
                    {networkStats?.info?.node_id || 'Inconnu'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-eco-soft rounded-xl">
                  <span className="text-eco-secondary font-medium">Temps de fonctionnement:</span>
                  <span className="metric-positive bg-white/60 px-3 py-1 rounded-lg">
                    {formatDuration(networkStats?.info?.uptime || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-eco-soft rounded-xl">
                  <span className="text-eco-secondary font-medium">Version:</span>
                  <span className="text-eco-primary font-semibold bg-white/60 px-3 py-1 rounded-lg">
                    {networkStats?.info?.version || 'Inconnue'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-eco-soft rounded-xl">
                  <span className="text-eco-secondary font-medium">Type de Réseau:</span>
                  <span className="capitalize text-eco-primary font-semibold bg-white/60 px-3 py-1 rounded-lg">
                    {networkStats?.info?.network_type || 'Inconnu'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="eco-card floating-card">
            <div className="eco-card-header">
              <div className="flex items-center">
                <BarChart3 className="h-6 w-6 text-mint-600 mr-3" />
                <h3 className="text-xl font-semibold text-eco-primary">
                  Métriques Réseau
                </h3>
              </div>
            </div>
            <div className="eco-card-body">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gradient-eco-soft rounded-xl">
                  <span className="text-eco-secondary font-medium">Messages Reçus:</span>
                  <span className="metric-positive bg-white/60 px-3 py-1 rounded-lg">
                    {networkStats?.metrics?.messages_received || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-eco-soft rounded-xl">
                  <span className="text-eco-secondary font-medium">Données Envoyées:</span>
                  <span className="metric-neutral bg-white/60 px-3 py-1 rounded-lg">
                    {formatBytes(networkStats?.metrics?.bytes_sent || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-eco-soft rounded-xl">
                  <span className="text-eco-secondary font-medium">Données Reçues:</span>
                  <span className="metric-neutral bg-white/60 px-3 py-1 rounded-lg">
                    {formatBytes(networkStats?.metrics?.bytes_received || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Peers List */}
      {networkStats && networkStats.peers && networkStats.peers.length > 0 && (
        <div className="eco-card floating-card">
          <div className="eco-card-header">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Wifi className="h-6 w-6 text-mint-600 mr-3" />
                <h3 className="text-xl font-semibold text-eco-primary">
                  Pairs Connectés
                </h3>
              </div>
              {demoMode && (
                <span className="text-sm text-mint-600 bg-mint-100 px-3 py-1 rounded-full font-medium">
                  Données Démo
                </span>
              )}
            </div>
          </div>
          <div className="eco-card-body">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-sage-200/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-eco-primary">
                      ID du Pair
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-eco-primary">
                      Adresse
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-eco-primary">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-eco-primary">
                      Connecté Depuis
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-200/30">
                  {networkStats.peers.map((peer) => (
                    <tr key={peer.id} className="hover:bg-gradient-eco-soft transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-eco-primary bg-sage-50/50 rounded-lg m-1">
                        {peer.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-eco-secondary font-medium">
                        {peer.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          peer.status === 'connected' ? 'bg-mint-100 text-mint-700 border border-mint-200' :
                          peer.status === 'connecting' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                          'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {peer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-eco-secondary">
                        {new Date(peer.connected_at).toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface EcoStatusCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'mint' | 'sage' | 'forest' | 'stone' | 'red';
}

const EcoStatusCard: React.FC<EcoStatusCardProps> = ({ title, value, icon, color }) => {
  const getCardClasses = () => {
    switch(color) {
      case 'mint':
        return 'bg-gradient-mint text-mint-800 border-mint-200';
      case 'sage':
        return 'bg-gradient-sage text-sage-800 border-sage-200';
      case 'forest':
        return 'bg-gradient-forest text-forest-800 border-forest-200';
      case 'stone':
        return 'bg-gradient-stone text-stone-800 border-stone-200';
      case 'red':
        return 'bg-gradient-red text-red-800 border-red-200';
      default:
        return 'bg-gradient-mint text-mint-800 border-mint-200';
    }
  };

  const getIconClasses = () => {
    switch(color) {
      case 'mint':
        return 'text-mint-600';
      case 'sage':
        return 'text-sage-600';
      case 'forest':
        return 'text-forest-600';
      case 'stone':
        return 'text-stone-600';
      case 'red':
        return 'text-red-600';
      default:
        return 'text-mint-600';
    }
  };

  return (
    <div className={`stat-card-eco ${getCardClasses()}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80 mb-2">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={`opacity-80 ${getIconClasses()}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default Dashboard;
