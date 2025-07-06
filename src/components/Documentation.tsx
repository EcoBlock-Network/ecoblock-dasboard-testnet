import React, { useState } from 'react';
import { Activity, Database, Network, Server, Shield, Zap, Globe, Users, Code, Settings, Book, ChevronRight } from 'lucide-react';

const Documentation: React.FC = () => {
    const [activeSection, setActiveSection] = useState('overview');

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'architecture', label: 'Architecture', icon: Network },
        { id: 'nodes', label: 'Nodes', icon: Server },
        { id: 'blocks', label: 'Blocks', icon: Database },
        { id: 'api', label: 'API Reference', icon: Code },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'deployment', label: 'Deployment', icon: Settings },
        { id: 'getting-started', label: 'Getting Started', icon: Book },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="doc-content">
                        <h1 className="doc-title">EcoBlock Network Overview</h1>
                        <div className="doc-intro">
                            <p>
                                EcoBlock is a decentralized sensor network that enables secure, transparent,
                                and efficient collection and sharing of environmental data. Built on blockchain
                                technology, it ensures data integrity while maintaining a lightweight,
                                eco-friendly approach.
                            </p>
                        </div>

                        <div className="doc-features">
                            <div className="feature-card">
                                <Zap className="feature-icon" />
                                <h3>High Performance</h3>
                                <p>Optimized for real-time sensor data processing with minimal latency.</p>
                            </div>
                            <div className="feature-card">
                                <Globe className="feature-icon" />
                                <h3>Decentralized</h3>
                                <p>No single point of failure with distributed node architecture.</p>
                            </div>
                            <div className="feature-card">
                                <Shield className="feature-icon" />
                                <h3>Secure</h3>
                                <p>Cryptographically secured data with Ed25519 digital signatures.</p>
                            </div>
                            <div className="feature-card">
                                <Users className="feature-icon" />
                                <h3>Collaborative</h3>
                                <p>Open network where participants can contribute and access data.</p>
                            </div>
                        </div>

                        <div className="doc-section">
                            <h2>Key Benefits</h2>
                            <ul className="doc-list">
                                <li>Real-time environmental monitoring</li>
                                <li>Tamper-proof data storage</li>
                                <li>Peer-to-peer network communication</li>
                                <li>Energy-efficient consensus mechanism</li>
                                <li>Open-source and transparent</li>
                            </ul>
                        </div>
                    </div>
                );

            case 'architecture':
                return (
                    <div className="doc-content">
                        <h1 className="doc-title">Network Architecture</h1>
                        <div className="doc-intro">
                            <p>
                                EcoBlock uses a distributed architecture with multiple interconnected
                                components working together to create a resilient sensor network.
                            </p>
                        </div>

                        <div className="architecture-grid">
                            <div className="arch-component">
                                <Server className="arch-icon" />
                                <h3>Network Nodes</h3>
                                <p>Distributed participants that validate and relay sensor data across the network.</p>
                            </div>
                            <div className="arch-component">
                                <Database className="arch-icon" />
                                <h3>Data Blocks</h3>
                                <p>Immutable containers holding verified sensor measurements and metadata.</p>
                            </div>
                            <div className="arch-component">
                                <Network className="arch-icon" />
                                <h3>P2P Network</h3>
                                <p>Peer-to-peer communication layer enabling direct node-to-node data exchange.</p>
                            </div>
                            <div className="arch-component">
                                <Shield className="arch-icon" />
                                <h3>Cryptographic Layer</h3>
                                <p>Ed25519 signatures and hash-based verification for data integrity.</p>
                            </div>
                        </div>

                        <div className="doc-section">
                            <h2>Component Stack</h2>
                            <div className="stack-diagram">
                                <div className="stack-layer">
                                    <strong>Application Layer</strong>
                                    <span>Dashboard, API clients, monitoring tools</span>
                                </div>
                                <div className="stack-layer">
                                    <strong>API Layer</strong>
                                    <span>REST endpoints, WebSocket connections</span>
                                </div>
                                <div className="stack-layer">
                                    <strong>Network Layer</strong>
                                    <span>P2P communication, gossip protocol</span>
                                </div>
                                <div className="stack-layer">
                                    <strong>Storage Layer</strong>
                                    <span>Block storage, state management</span>
                                </div>
                                <div className="stack-layer">
                                    <strong>Core Layer</strong>
                                    <span>Consensus, cryptography, validation</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'nodes':
                return (
                    <div className="doc-content">
                        <h1 className="doc-title">Network Nodes</h1>
                        <div className="doc-intro">
                            <p>
                                Nodes are the backbone of the EcoBlock network, responsible for data validation,
                                storage, and network communication.
                            </p>
                        </div>

                        <div className="doc-section">
                            <h2>Node Types</h2>
                            <div className="node-types">
                                <div className="node-type">
                                    <h3>Full Nodes</h3>
                                    <p>Store complete blockchain history and participate in consensus.</p>
                                    <ul className="node-features">
                                        <li>Complete block validation</li>
                                        <li>Full network participation</li>
                                        <li>API endpoint provision</li>
                                    </ul>
                                </div>
                                <div className="node-type">
                                    <h3>Light Nodes</h3>
                                    <p>Lightweight clients that connect to full nodes for data access.</p>
                                    <ul className="node-features">
                                        <li>Reduced storage requirements</li>
                                        <li>Fast synchronization</li>
                                        <li>Mobile-friendly</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="doc-section">
                            <h2>Node Configuration</h2>
                            <div className="code-block">
                                <pre><code>{`# Start a node with default settings
cargo run -- node

# Custom configuration
cargo run -- node --tcp-port 8080 --udp-port 8081 --api-port 3000`}</code></pre>
                            </div>
                        </div>
                    </div>
                );

            case 'blocks':
                return (
                    <div className="doc-content">
                        <h1 className="doc-title">Data Blocks</h1>
                        <div className="doc-intro">
                            <p>
                                Blocks are the fundamental data structures in EcoBlock, containing sensor
                                readings, timestamps, and cryptographic proofs.
                            </p>
                        </div>

                        <div className="doc-section">
                            <h2>Block Structure</h2>
                            <div className="block-structure">
                                <div className="block-field">
                                    <strong>Hash</strong>
                                    <span>Unique identifier computed from block contents</span>
                                </div>
                                <div className="block-field">
                                    <strong>Parent Hashes</strong>
                                    <span>References to previous blocks in the chain</span>
                                </div>
                                <div className="block-field">
                                    <strong>Timestamp</strong>
                                    <span>Unix timestamp of block creation</span>
                                </div>
                                <div className="block-field">
                                    <strong>Sensor Data</strong>
                                    <span>Environmental measurements (PM2.5, CO2, temperature, humidity)</span>
                                </div>
                                <div className="block-field">
                                    <strong>Signature</strong>
                                    <span>Ed25519 digital signature for verification</span>
                                </div>
                            </div>
                        </div>

                        <div className="doc-section">
                            <h2>Creating Blocks</h2>
                            <div className="code-block">
                                <pre><code>{`# Create a block with default sensor data
cargo run -- create-block

# Create with custom sensor readings
cargo run -- create-block --pm25 25.5 --co2 400.0 --temperature 22.0 --humidity 50.0`}</code></pre>
                            </div>
                        </div>
                    </div>
                );

            case 'api':
                return (
                    <div className="doc-content">
                        <h1 className="doc-title">API Reference</h1>
                        <div className="doc-intro">
                            <p>
                                EcoBlock provides a comprehensive REST API for interacting with the network,
                                querying data, and monitoring system health.
                            </p>
                        </div>

                        <div className="doc-section">
                            <h2>Network Endpoints</h2>
                            <div className="api-endpoints">
                                <div className="api-endpoint">
                                    <div className="endpoint-header">
                                        <span className="http-method get">GET</span>
                                        <span className="endpoint-path">/api/network/info</span>
                                    </div>
                                    <p>Retrieve basic network information including node ID and peer count.</p>
                                </div>
                                <div className="api-endpoint">
                                    <div className="endpoint-header">
                                        <span className="http-method get">GET</span>
                                        <span className="endpoint-path">/api/network/stats</span>
                                    </div>
                                    <p>Get detailed network statistics and performance metrics.</p>
                                </div>
                                <div className="api-endpoint">
                                    <div className="endpoint-header">
                                        <span className="http-method get">GET</span>
                                        <span className="endpoint-path">/api/health</span>
                                    </div>
                                    <p>Check node health status and system information.</p>
                                </div>
                            </div>
                        </div>

                        <div className="doc-section">
                            <h2>Block Endpoints</h2>
                            <div className="api-endpoints">
                                <div className="api-endpoint">
                                    <div className="endpoint-header">
                                        <span className="http-method get">GET</span>
                                        <span className="endpoint-path">/api/blocks</span>
                                    </div>
                                    <p>Retrieve a paginated list of blocks from the network.</p>
                                </div>
                                <div className="api-endpoint">
                                    <div className="endpoint-header">
                                        <span className="http-method post">POST</span>
                                        <span className="endpoint-path">/api/blocks</span>
                                    </div>
                                    <p>Submit a new block to the network for validation.</p>
                                </div>
                            </div>
                        </div>

                        <div className="doc-section">
                            <h2>Example Usage</h2>
                            <div className="code-block">
                                <pre><code>{`# Get network information
curl http://localhost:3000/api/network/info

# Get recent blocks
curl http://localhost:3000/api/blocks?page=1&limit=10

# Check node health
curl http://localhost:3000/api/health`}</code></pre>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="doc-content">
                        <h1 className="doc-title">Security</h1>
                        <div className="doc-intro">
                            <p>
                                EcoBlock employs multiple layers of security to ensure data integrity,
                                authenticity, and network resilience.
                            </p>
                        </div>

                        <div className="doc-section">
                            <h2>Cryptographic Security</h2>
                            <div className="security-features">
                                <div className="security-feature">
                                    <Shield className="security-icon" />
                                    <h3>Ed25519 Signatures</h3>
                                    <p>All blocks are digitally signed using Ed25519 elliptic curve cryptography.</p>
                                </div>
                                <div className="security-feature">
                                    <Database className="security-icon" />
                                    <h3>Hash-based Integrity</h3>
                                    <p>Block hashes ensure data immutability and enable tamper detection.</p>
                                </div>
                                <div className="security-feature">
                                    <Network className="security-icon" />
                                    <h3>Peer Verification</h3>
                                    <p>Network participants validate each other's data and signatures.</p>
                                </div>
                            </div>
                        </div>

                        <div className="doc-section">
                            <h2>Network Security</h2>
                            <ul className="doc-list">
                                <li>Distributed architecture prevents single points of failure</li>
                                <li>Gossip protocol ensures reliable data propagation</li>
                                <li>Peer authentication prevents malicious node participation</li>
                                <li>Rate limiting protects against spam and DoS attacks</li>
                            </ul>
                        </div>
                    </div>
                );

            case 'deployment':
                return (
                    <div className="doc-content">
                        <h1 className="doc-title">Deployment Guide</h1>
                        <div className="doc-intro">
                            <p>
                                Learn how to deploy EcoBlock nodes in production environments with
                                proper configuration and monitoring.
                            </p>
                        </div>

                        <div className="doc-section">
                            <h2>System Requirements</h2>
                            <div className="requirements">
                                <div className="requirement-category">
                                    <h3>Minimum Requirements</h3>
                                    <ul>
                                        <li>CPU: 2 cores</li>
                                        <li>RAM: 4GB</li>
                                        <li>Storage: 10GB SSD</li>
                                        <li>Network: 100 Mbps</li>
                                    </ul>
                                </div>
                                <div className="requirement-category">
                                    <h3>Recommended</h3>
                                    <ul>
                                        <li>CPU: 4+ cores</li>
                                        <li>RAM: 8GB+</li>
                                        <li>Storage: 50GB+ SSD</li>
                                        <li>Network: 1 Gbps</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="doc-section">
                            <h2>Production Deployment</h2>
                            <div className="code-block">
                                <pre><code>{`# Build for production
cargo build --release

# Run with production settings
./target/release/demo-server node \\
  --tcp-port 8080 \\
  --udp-port 8081 \\
  --api-port 3000

# Using systemd service
sudo systemctl enable ecoblock-node
sudo systemctl start ecoblock-node`}</code></pre>
                            </div>
                        </div>
                    </div>
                );

            case 'getting-started':
                return (
                    <div className="doc-content">
                        <h1 className="doc-title">Getting Started</h1>
                        <div className="doc-intro">
                            <p>
                                Quick start guide to get your first EcoBlock node up and running in minutes.
                            </p>
                        </div>

                        <div className="doc-section">
                            <h2>Prerequisites</h2>
                            <ul className="doc-list">
                                <li>Rust 1.70 or higher</li>
                                <li>Cargo package manager</li>
                                <li>Git for cloning repositories</li>
                            </ul>
                        </div>

                        <div className="doc-section">
                            <h2>Installation</h2>
                            <div className="step-by-step">
                                <div className="step">
                                    <div className="step-number">1</div>
                                    <div className="step-content">
                                        <h3>Clone the Repository</h3>
                                        <div className="code-block">
                                            <pre><code>git clone https://github.com/EcoBlock-Network/demo-testnet.git
                                                cd demo-testnet</code></pre>
                                        </div>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                        <h3>Build the Application</h3>
                                        <div className="code-block">
                                            <pre><code>cargo build --release</code></pre>
                                        </div>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                        <h3>Start Your Node</h3>
                                        <div className="code-block">
                                            <pre><code>cargo run -- node</code></pre>
                                        </div>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">4</div>
                                    <div className="step-content">
                                        <h3>Create Your First Block</h3>
                                        <div className="code-block">
                                            <pre><code>cargo run -- create-block</code></pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="doc-section">
                            <h2>Next Steps</h2>
                            <div className="next-steps">
                                <div className="next-step">
                                    <ChevronRight className="step-icon" />
                                    <span>Explore the dashboard at http://localhost:3000</span>
                                </div>
                                <div className="next-step">
                                    <ChevronRight className="step-icon" />
                                    <span>Connect additional nodes to build your network</span>
                                </div>
                                <div className="next-step">
                                    <ChevronRight className="step-icon" />
                                    <span>Integrate with real sensor hardware</span>
                                </div>
                                <div className="next-step">
                                    <ChevronRight className="step-icon" />
                                    <span>Deploy to production environments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div>Section not found</div>;
        }
    };

    return (
        <div className="documentation-layout">
            <aside className="doc-sidebar">
                <div className="doc-sidebar-header">
                    <Activity className="doc-sidebar-logo" />
                    <h2>Documentation</h2>
                </div>
                <nav className="doc-sidebar-nav">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`doc-sidebar-item ${activeSection === item.id ? 'doc-sidebar-item-active' : ''}`}
                            >
                                <IconComponent className="doc-sidebar-icon" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>
            <main className="doc-main">
                {renderContent()}
            </main>
        </div>
    );
};

export default Documentation;
