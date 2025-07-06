import React, { useState, useEffect, useRef } from 'react';
import { Block } from '../types/api';
import { blockApi } from '../services/api';
import '../styles/TangleVisualization.css';

interface TangleNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  block: Block;
  connections: string[];
  timestamp: number;
  isNew: boolean;
  pulsePhase: number;
}

interface TangleConnection {
  from: string;
  to: string;
  strength: number;
  animated: boolean;
}

const TangleVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [nodes, setNodes] = useState<Map<string, TangleNode>>(new Map());
  const [connections, setConnections] = useState<TangleConnection[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<TangleNode | null>(null);
  const [draggedNode, setDraggedNode] = useState<TangleNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [stats, setStats] = useState({
    totalBlocks: 0,
    totalConnections: 0,
    networkHealth: 0,
    propagationSpeed: 0
  });

  // Canvas dimensions
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const CENTER_X = CANVAS_WIDTH / 2;
  const CENTER_Y = CANVAS_HEIGHT / 2;

  // Physics constants (beaucoup plus stable)
  const REPULSION_FORCE = 10; // Drastiquement réduit
  const ATTRACTION_FORCE = 0.005; // Très réduit
  const DAMPING = 0.98; // Très fort amortissement
  const MIN_RADIUS = 12;
  const MAX_RADIUS = 25;
  const BOUNDARY_PADDING = 50;
  const CENTER_ATTRACTION = 0.0001; // Très légère attraction vers le centre
  const VELOCITY_LIMIT = 0.5; // Limite de vitesse

  // Color palette for different sensor values
  const getNodeColor = (block: Block): string => {
    if (!block.sensor_data) return '#64748b'; // Default gray
    
    const { pm25, co2, temperature } = block.sensor_data;
    
    // Color based on air quality
    if (pm25 > 35) return '#ef4444'; // Red - unhealthy
    if (pm25 > 25) return '#f59e0b'; // Orange - moderate
    if (pm25 > 15) return '#eab308'; // Yellow - good
    return '#10b981'; // Green - excellent
  };

  const getNodeRadius = (block: Block): number => {
    if (!block.sensor_data) return MIN_RADIUS;
    
    // Size based on data richness
    const dataPoints = Object.keys(block.sensor_data).length;
    return Math.min(MIN_RADIUS + dataPoints * 2, MAX_RADIUS);
  };

  const createNode = (block: Block, isNew: boolean = false): TangleNode => {
    // Position initiale plus contrôlée
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 150; // Distance plus réduite
    
    return {
      id: block.hash,
      x: CENTER_X + Math.cos(angle) * distance,
      y: CENTER_Y + Math.sin(angle) * distance,
      vx: (Math.random() - 0.5) * 2, // Vitesse initiale réduite
      vy: (Math.random() - 0.5) * 2,
      radius: getNodeRadius(block),
      color: getNodeColor(block),
      block,
      connections: block.parent_hashes || [],
      timestamp: block.timestamp,
      isNew,
      pulsePhase: 0
    };
  };

  const updatePhysics = () => {
    if (!isSimulationRunning) return; // Arrêter la physique si la simulation est en pause
    
    const nodeArray = Array.from(nodes.values());
    
    // Appliquer les forces avec des limites
    nodeArray.forEach(node => {
      let fx = 0;
      let fy = 0;
      
      // Attraction vers le centre (pour éviter la dispersion)
      const dxCenter = CENTER_X - node.x;
      const dyCenter = CENTER_Y - node.y;
      const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
      
      if (distanceCenter > 200) { // Seulement si trop loin du centre
        fx += dxCenter * CENTER_ATTRACTION;
        fy += dyCenter * CENTER_ATTRACTION;
      }
      
      // Répulsion des autres nœuds
      nodeArray.forEach(other => {
        if (other.id !== node.id) {
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0 && distance < 200) { // Limiter la portée
            const force = Math.min(REPULSION_FORCE / (distance * distance), 5); // Limiter la force max
            fx += (dx / distance) * force;
            fy += (dy / distance) * force;
          }
        }
      });
      
      // Attraction vers les nœuds connectés
      node.connections.forEach(connectionId => {
        const connectedNode = nodes.get(connectionId);
        if (connectedNode) {
          const dx = connectedNode.x - node.x;
          const dy = connectedNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {
            const idealDistance = 80; // Distance idéale entre nœuds connectés
            const force = Math.min(ATTRACTION_FORCE * (distance - idealDistance), 2);
            fx += (dx / distance) * force;
            fy += (dy / distance) * force;
          }
        }
      });
      
      // Limiter les forces totales
      const maxForce = 3;
      const totalForce = Math.sqrt(fx * fx + fy * fy);
      if (totalForce > maxForce) {
        fx = (fx / totalForce) * maxForce;
        fy = (fy / totalForce) * maxForce;
      }
      
      // Appliquer les forces
      node.vx += fx;
      node.vy += fy;
      
      // Limiter la vitesse
      const maxSpeed = 5;
      const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
      if (speed > maxSpeed) {
        node.vx = (node.vx / speed) * maxSpeed;
        node.vy = (node.vy / speed) * maxSpeed;
      }
      
      // Appliquer l'amortissement
      node.vx *= DAMPING;
      node.vy *= DAMPING;
      
      // Mettre à jour la position
      node.x += node.vx;
      node.y += node.vy;
      
      // Contraintes de limites avec rebond doux
      const margin = node.radius + BOUNDARY_PADDING;
      if (node.x < margin) {
        node.x = margin;
        node.vx = Math.abs(node.vx) * 0.5;
      }
      if (node.x > CANVAS_WIDTH - margin) {
        node.x = CANVAS_WIDTH - margin;
        node.vx = -Math.abs(node.vx) * 0.5;
      }
      if (node.y < margin) {
        node.y = margin;
        node.vy = Math.abs(node.vy) * 0.5;
      }
      if (node.y > CANVAS_HEIGHT - margin) {
        node.y = CANVAS_HEIGHT - margin;
        node.vy = -Math.abs(node.vy) * 0.5;
      }
      
      // Mettre à jour les états d'animation
      node.pulsePhase += 0.1;
      if (node.isNew && node.pulsePhase > Math.PI * 4) {
        node.isNew = false;
      }
    });
  };

  const drawConnections = (ctx: CanvasRenderingContext2D) => {
    connections.forEach(connection => {
      const fromNode = nodes.get(connection.from);
      const toNode = nodes.get(connection.to);
      
      if (fromNode && toNode) {
        ctx.strokeStyle = connection.animated ? 
          `rgba(59, 130, 246, ${0.3 + 0.3 * Math.sin(Date.now() * 0.005)})` : 
          'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
        
        // Draw connection direction arrow
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const arrowX = fromNode.x + (dx / distance) * (distance * 0.7);
          const arrowY = fromNode.y + (dy / distance) * (distance * 0.7);
          
          ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
          ctx.beginPath();
          ctx.arc(arrowX, arrowY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  };

  const drawNodes = (ctx: CanvasRenderingContext2D) => {
    const nodeArray = Array.from(nodes.values());
    
    nodeArray.forEach(node => {
      // Draw node shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Draw main node
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw pulse animation for new nodes
      if (node.isNew) {
        const pulseRadius = node.radius + 10 * Math.sin(node.pulsePhase);
        ctx.strokeStyle = `rgba(34, 197, 94, ${0.5 * Math.sin(node.pulsePhase)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw node border
      ctx.strokeStyle = selectedNode?.id === node.id ? '#3b82f6' : 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = selectedNode?.id === node.id ? 3 : 1;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw node ID (shortened)
      ctx.fillStyle = 'white';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(node.id.slice(0, 6), node.x, node.y + 3);
    });
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    // Gradient background
    const gradient = ctx.createRadialGradient(
      CENTER_X, CENTER_Y, 0,
      CENTER_X, CENTER_Y, Math.max(CANVAS_WIDTH, CANVAS_HEIGHT)
    );
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Grid pattern
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= CANVAS_WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    
    for (let y = 0; y <= CANVAS_HEIGHT; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
  };

  const drawUI = (ctx: CanvasRenderingContext2D) => {
    // Afficher le niveau de zoom
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.fillRect(10, 10, 120, 60);
    
    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';
    ctx.fillText(`Zoom: ${(zoom * 100).toFixed(0)}%`, 20, 30);
    ctx.fillText(`Pan: ${panX.toFixed(0)}, ${panY.toFixed(0)}`, 20, 50);
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Save context and apply transformations
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);
    
    // Draw background
    drawBackground(ctx);
    
    // Update physics only if simulation is running
    if (isSimulationRunning) {
      updatePhysics();
    }
    
    // Draw connections
    drawConnections(ctx);
    
    // Draw nodes
    drawNodes(ctx);
    
    // Restore context
    ctx.restore();
    
    // Draw UI overlays (zoom level, etc.)
    drawUI(ctx);
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Fonction utilitaire pour convertir les coordonnées souris en coordonnées canvas
  const getCanvasCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - panX) / zoom;
    const y = (event.clientY - rect.top - panY) / zoom;
    return { x, y };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(event);
    
    // Trouve le nœud cliqué
    const nodeArray = Array.from(nodes.values());
    const clickedNode = nodeArray.find(node => {
      const distance = Math.sqrt((coords.x - node.x) ** 2 + (coords.y - node.y) ** 2);
      return distance <= node.radius;
    });
    
    if (clickedNode) {
      setDraggedNode(clickedNode);
      setIsDragging(true);
      setSelectedNode(clickedNode);
    } else {
      setSelectedNode(null);
    }
    
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && draggedNode) {
      // Drag du nœud
      const coords = getCanvasCoordinates(event);
      setNodes(prevNodes => {
        const newNodes = new Map(prevNodes);
        const node = newNodes.get(draggedNode.id);
        if (node) {
          node.x = coords.x;
          node.y = coords.y;
          node.vx = 0; // Arrêter la physique sur ce nœud
          node.vy = 0;
        }
        return newNodes;
      });
    } else if (event.buttons === 1 && !draggedNode) {
      // Pan de la vue
      const deltaX = event.clientX - lastMousePos.x;
      const deltaY = event.clientY - lastMousePos.y;
      setPanX(prev => prev + deltaX);
      setPanY(prev => prev + deltaY);
      setLastMousePos({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, zoom * zoomFactor));
    setZoom(newZoom);
  };

  const resetView = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const response = await blockApi.getBlocks();
      const newBlocks = response.blocks;
      
      // Create new nodes map
      const newNodes = new Map<string, TangleNode>();
      const newConnections: TangleConnection[] = [];
      
      newBlocks.forEach(block => {
        const existingNode = nodes.get(block.hash);
        const isNew = !existingNode;
        
        newNodes.set(block.hash, existingNode || createNode(block, isNew));
        
        // Create connections
        block.parent_hashes?.forEach(parentHash => {
          if (newNodes.has(parentHash)) {
            newConnections.push({
              from: parentHash,
              to: block.hash,
              strength: 1,
              animated: isNew
            });
          }
        });
      });
      
      setNodes(newNodes);
      setConnections(newConnections);
      setBlocks(newBlocks);
      
      // Update stats
      setStats({
        totalBlocks: newBlocks.length,
        totalConnections: newConnections.length,
        networkHealth: Math.min(newBlocks.length / 50, 1),
        propagationSpeed: newConnections.filter(c => c.animated).length
      });
      
    } catch (error) {
      console.error('Failed to fetch blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour alterner la simulation
  const toggleSimulation = () => {
    setIsSimulationRunning(!isSimulationRunning);
  };

  const stabilizeSimulation = () => {
    // Arrêter toutes les vitesses pour stabiliser immédiatement
    const nodeArray = Array.from(nodes.values());
    nodeArray.forEach(node => {
      node.vx *= 0.1; // Réduire drastiquement la vitesse
      node.vy *= 0.1;
    });
    setNodes(new Map(nodes)); // Forcer un re-render
  };

  const resetPositions = () => {
    // Remettre tous les nœuds en position circulaire autour du centre
    const nodeArray = Array.from(nodes.values());
    const totalNodes = nodeArray.length;
    
    nodeArray.forEach((node, index) => {
      const angle = (index / totalNodes) * Math.PI * 2;
      const radius = 150 + (Math.random() - 0.5) * 50; // Rayon avec variation
      
      node.x = CENTER_X + Math.cos(angle) * radius;
      node.y = CENTER_Y + Math.sin(angle) * radius;
      node.vx = 0; // Arrêter le mouvement
      node.vy = 0;
    });
    
    setNodes(new Map(nodes)); // Forcer un re-render
  };

  useEffect(() => {
    fetchBlocks();
    const interval = setInterval(fetchBlocks, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (nodes.size > 0) {
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes]);

  return (
    <div className="tangle-visualization">
      <div className="tangle-header">
        <h2>Tangle Network Visualization</h2>
        <div className="tangle-controls">
          <button 
            onClick={toggleSimulation} 
            className={`control-btn ${isSimulationRunning ? 'active' : ''}`}
          >
            {isSimulationRunning ? 'Pause' : 'Play'}
          </button>
          <button onClick={stabilizeSimulation} className="control-btn">
            Stabilize
          </button>
          <button onClick={resetPositions} className="control-btn">
            Reset Nodes
          </button>
          <button onClick={() => setZoom(prev => Math.min(3, prev * 1.2))} className="control-btn">
            Zoom +
          </button>
          <button onClick={() => setZoom(prev => Math.max(0.1, prev / 1.2))} className="control-btn">
            Zoom -
          </button>
          <button onClick={resetView} className="control-btn">
            Reset View
          </button>
        </div>
        <div className="tangle-stats">
          <div className="stat-item">
            <div className="stat-value">{stats.totalBlocks}</div>
            <div className="stat-label">Blocks</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.totalConnections}</div>
            <div className="stat-label">Connections</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{(stats.networkHealth * 100).toFixed(0)}%</div>
            <div className="stat-label">Health</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.propagationSpeed}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
      </div>
      
      <div className="tangle-content">
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className="tangle-canvas"
          />
          
          <div className="canvas-instructions">
            <strong>Controls:</strong>
            <ul>
              <li>Drag nodes to move</li>
              <li>Mouse wheel to zoom</li>
              <li>Drag canvas to pan</li>
              <li>Click node for details</li>
            </ul>
          </div>
          
          {loading && (
            <div className="canvas-overlay">
              <div className="loading-spinner"></div>
              <span>Loading Tangle...</span>
            </div>
          )}
        </div>
        
        {selectedNode && (
          <div className="node-details">
            <h3>Block Details</h3>
            <div className="detail-item">
              <span className="label">Hash:</span>
              <span className="value">{selectedNode.id}</span>
            </div>
            <div className="detail-item">
              <span className="label">Timestamp:</span>
              <span className="value">{new Date(selectedNode.timestamp * 1000).toLocaleString()}</span>
            </div>
            {selectedNode.block.sensor_data && (
              <>
                <div className="detail-item">
                  <span className="label">PM2.5:</span>
                  <span className="value">{selectedNode.block.sensor_data.pm25} µg/m³</span>
                </div>
                <div className="detail-item">
                  <span className="label">CO2:</span>
                  <span className="value">{selectedNode.block.sensor_data.co2} ppm</span>
                </div>
                <div className="detail-item">
                  <span className="label">Temperature:</span>
                  <span className="value">{selectedNode.block.sensor_data.temperature}°C</span>
                </div>
                <div className="detail-item">
                  <span className="label">Humidity:</span>
                  <span className="value">{selectedNode.block.sensor_data.humidity}%</span>
                </div>
              </>
            )}
            <div className="detail-item">
              <span className="label">Parents:</span>
              <span className="value">{selectedNode.connections.length}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="tangle-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
          <span>Excellent Air Quality</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#eab308' }}></div>
          <span>Good Air Quality</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
          <span>Moderate Air Quality</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
          <span>Poor Air Quality</span>
        </div>
      </div>
    </div>
  );
};

export default TangleVisualization;
