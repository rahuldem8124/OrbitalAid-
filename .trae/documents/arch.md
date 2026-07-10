
# Technical Architecture Document for OrbitalAid

## 1. Tech Stack
| Category          | Technologies                                                                 |
|-------------------|------------------------------------------------------------------------------|
| Frontend Framework| React 18 with TypeScript                                                      |
| Build Tool        | Vite                                                                          |
| Styling           | Tailwind CSS                                                                 |
| 3D Visualization  | Three.js (with React Three Fiber)                                             |
| Data Viz          | Recharts                                                                      |
| Icons             | Lucide React                                                                  |
| State Management  | React Context API / Zustand                                                   |
| Routing           | React Router v6                                                               |
| Backend Integration | Fetch API / Axios for REST, WebSocket for real-time updates                  |

## 2. File Structure
```
orbital-ai/
├── backend/
│   └── (existing backend files)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── TopBar.tsx
│   │   │   ├── ui/
│   │   │   │   ├── GlassPanel.tsx
│   │   │   │   ├── RiskIndicator.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   └── CommandPalette.tsx
│   │   │   ├── CommandOverview/
│   │   │   ├── LiveTracking/
│   │   │   ├── ConjunctionRisk/
│   │   │   ├── Maneuvers/
│   │   │   ├── FleetRegistry/
│   │   │   ├── Alerts/
│   │   │   ├── Analytics/
│   │   │   ├── Simulation/
│   │   │   ├── DataSources/
│   │   │   └── Settings/
│   │   ├── pages/
│   │   │   ├── CommandOverviewPage.tsx
│   │   │   ├── LiveTrackingPage.tsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── ...
```

## 3. Data Model
```typescript
// Shared types
interface Satellite {
  id: string;
  name: string;
  type: 'active' | 'dead' | 'debris' | 'rocket_body';
  orbit: 'LEO' | 'MEO' | 'GEO' | 'HEO';
  rcs: number;
  owner: string;
  tle: string;
}

interface ConjunctionEvent {
  id: string;
  objectA: Satellite;
  objectB: Satellite;
  pc: number; // probability of collision
  missDistance: number;
  tca: Date;
  relativeVelocity: number;
  trend: 'up' | 'down' | 'stable';
  riskTier: 'critical' | 'high' | 'watch' | 'low';
}

interface Maneuver {
  id: string;
  conjunctionId: string;
  status: 'proposed' | 'review' | 'approved' | 'executed' | 'verified';
  deltaV: number;
  fuelCost: number;
  newMissDistance: number;
  newPc: number;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 4. API Endpoints
- GET /api/satellites: List all satellites
- GET /api/conjunctions: List conjunction events
- POST /api/maneuvers: Create maneuver
- PUT /api/maneuvers/:id: Update maneuver status
- GET /api/alerts: List alerts
- GET /api/health: Data source health status

## 5. Main Pages & Components
| Page                    | Key Components                                                                 |
|-------------------------|--------------------------------------------------------------------------------|
| Command Overview        | KPICard, MiniGlobe, RiskList, ActivityFeed                                    |
| Live Tracking           | FullGlobe, TimeScrubber, FilterPanel, ObjectDrawer                            |
| Conjunction & Risk      | ConjunctionTable, ConjunctionDetail, TrendChart, GeometryDiagram              |
| Maneuvers               | ManeuverQueue, ManeuverCard, ApprovalWorkflow, HistoryLog                     |

## 6. State Management
- React Context API for global state (user, alerts, data freshness)
- Local state for component-specific interactions

## 7. Key Technical Decisions
- **3D Globe**: Three.js with React Three Fiber for better React integration
- **Styling**: Tailwind CSS for rapid development and customizability
- **Accessibility**: Strictly follow WCAG guidelines, risk indicators have color + icon + label
- **Performance**: Lazy-loaded modules, code splitting

