
# Implementation Plan for OrbitalAid

## 1. Repo Research Conclusion
- Backend exists at `backend/` using FastAPI with SQLAlchemy
- Data model:
  - `SpaceObject`: tracked object with type (satellite|station|debris)
  - `ConjunctionEvent`: collision risk between two objects
  - `RiskAssessment`: probability score for conjunction
  - `Maneuver`: avoidance maneuver planning
  - `Alert`: notifications for risky events
- API endpoints available at http://localhost:8000/docs
- CORS configured for http://localhost:3000

## 2. Modules & Features Required
### Integrated Main Dashboard
- Single view combining Command Overview and Live Tracking
- Persistent left sidebar + top bar
- Realistic 3D globe:
  - Rotating on axis
  - Time zones + sunlight/shadow
  - Distinct colors/icons for satellite/station/debris
  - Orbital paths (using orbital elements from backend)
- KPI strip powered by `/stats/summary`
- Top risky conjunctions from `/conjunctions`
- Live activity feed (from alerts/maneuvers)
- Global time + data freshness indicator
- Filters for globe view (type, orbit regime, etc.)

### Other Modules
- Conjunction & Risk Analysis
- Maneuver & Preventive Actions
- Fleet & Asset Registry
- Alerts & Notifications
- (Analytics, Simulation, Data Sources, Settings later phases)

## 3. Tech Stack Adjustment
- Frontend: Next.js 14 (App Router) + TypeScript
- Styling: Tailwind CSS
- 3D Globe: Three.js + React Three Fiber + @react-three/drei + @react-three/postprocessing
- Data Viz: Recharts
- Icons: Lucide React
- Routing: Next.js App Router

## 4. Files & Modules to Create
```
orbital-ai/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx (global layout with Sidebar/TopBar)
│   │   ├── page.tsx (Integrated Dashboard)
│   │   ├── conjunctions/
│   │   ├── maneuvers/
│   │   ├── fleet/
│   │   └── alerts/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   ├── ui/
│   │   │   ├── GlassPanel.tsx
│   │   │   ├── RiskIndicator.tsx
│   │   │   ├── Button.tsx
│   │   │   └── CommandPalette.tsx
│   │   └── dashboard/
│   │       ├── Globe.tsx (with satellite/station/debris distinction)
│   │       ├── KPIStrip.tsx
│   │       ├── RiskList.tsx
│   │       └── ActivityFeed.tsx
│   ├── lib/
│   │   ├── api.ts (functions to call backend API)
│   │   └── types.ts (TypeScript types matching backend models)
│   ├── public/
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
└── backend/ (existing)
```

## 5. Steps for Implementation
1. Initialize Next.js 14 project in `frontend/`
2. Set up dependencies (Tailwind, Three.js, React Three Fiber, etc.)
3. Create types matching backend models
4. Build API client functions to fetch data from backend
5. Implement layout components (Sidebar, TopBar)
6. Build realistic 3D Globe component
7. Create integrated dashboard page that fetches and displays backend data
8. Implement remaining core pages (conjunctions, maneuvers, alerts)
9. Test and verify integration

## 6. Dependencies & Considerations
- Backend must be running on http://localhost:8000
- Need to handle orbital propagation to render orbits on globe
- Accessibility: risk indicators must have icon + label + color

## 7. Risk Handling
- If 3D globe is slow with many objects: implement culling and pagination
- If backend API changes: update API client accordingly
