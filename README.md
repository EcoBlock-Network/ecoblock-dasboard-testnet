# ecoblock-dashboard-testnet

**Modern Web Dashboard for EcoBlock Network Testnet**

Real-time monitoring dashboard for EcoBlock decentralized sensor network, optimized for testing environment.

## Features

- **Modern Eco Design** : Clean pale interface with glassmorphism effects
- **Real-time Monitoring** : Live tracking of nodes, connected peers and network metrics  
- **Integrated Demo Mode** : Works with sample data when API is unavailable
- **Modern Technologies** : React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Responsive Design** : Compatible with desktop, tablet and mobile devices

## Quick Installation

```bash
# Clone the repository
git clone https://github.com/EcoBlock-Network/ecoblock-dasboard-testnet.git
cd ecoblock-dasboard-testnet

# Install dependencies
npm install

# Start development server
npm run dev
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Launch Dashboard
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Connect to EcoBlock Testnet
The dashboard automatically connects to EcoBlock API on `http://localhost:9000/api`.

To start a test node:
```bash
# In a separate terminal
cd /path/to/ecoblock-demo
cargo run -- node --tcp-port 9001 --udp-port 9002 --api-port 9000
```

## Interface

### Ecological Color Palette
- **Mint** : Mint green tones (#22c55e → #14532d)
- **Sage** : Sage green tones (#5a9b5a → #1f3f1f)  
- **Forest** : Forest tones (#4f6b4f → #262e26)
- **Stone** : Stone tones (#78716c → #1c1917)

### Modern & Clean Design
- Translucent cards with `backdrop-blur`
- Soft and subtle shadows  
- Lucide React icons (no emojis)
- Static design without animations

## Features

### Status Cards
- Network health
- Active connected peers
- Total peers
- Messages sent

### Network Information  
- Unique node ID
- Uptime
- Software version
- Network type (testnet/mainnet)

### Real-time Metrics
- Messages received/sent
- Data transmitted (bytes)
- Detailed peer list
- Connection statuses

### Demo Mode
Automatically activates when backend API is unavailable, allowing interface testing with simulated data.

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx       # Main dashboard component
│   └── BlocksView.tsx     # Block explorer view
├── services/
│   └── api.ts             # REST API services
├── types/
│   └── api.ts             # TypeScript types
├── index.css              # Global styles + Tailwind
└── main.tsx               # React entry point
```

## Available Scripts

```bash
npm run dev        # Development with hot reload
npm run build      # Production build
npm run preview    # Preview build
npm run lint       # ESLint linting
```

## Environment Variables

Create a `.env` file (optional):
```env
VITE_API_BASE_URL=http://localhost:9000/api
VITE_NETWORK_TYPE=testnet
```

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)  
5. Create a Pull Request

## License

This project is part of the **EcoBlock Network** ecosystem.

---

**Built with care for a sustainable future**
