
## 1. Product Overview
OrbitalAid is a mission-control-style web dashboard for satellite debris collision risk analysis. It transforms raw space situational awareness data into actionable insights, allowing operators to detect, assess, and respond to potential collision events in near real-time.


## 2. Core Features
The platform includes these primary modules:
- Command Overview: Landing page with KPIs, mini-globe, top risks, and activity feed
- Live Tracking: Full 3D globe with orbital propagation, time scrubber, and filters
- Conjunction & Risk Analysis: Sortable table of collision events with detailed views
- Maneuver & Preventive Actions: Workflow for planning, reviewing, and approving avoidance maneuvers
- Fleet & Asset Registry: Management of owned satellites and tracked objects
- Alerts & Notifications Center: Central inbox for severity-tagged alerts
- Analytics & Reporting: Trend analysis, heatmaps, and exportable reports
- Simulation / What-If Sandbox: Hypothetical scenario modeling
- Data Sources & System Health: Feed status and catalog freshness
- Settings & Access Control: Role-based views and permissions


## 3. User Stories
| Role       | Story                                                                 |
|------------|-----------------------------------------------------------------------|
| Analyst    | I want to view and filter conjunction events so I can prioritize high-risk ones. |
| Operator   | I want to plan and review avoidance maneuvers so I can prevent collisions. |
| Approver   | I want to approve/reject maneuvers with reasons so we have accountability. |
| Admin      | I want to manage user roles and data sources so the system stays secure and reliable. |


## 4. User Interface Design
### Design Language
- **Theme**: Deep-space dark UI with near-black base (#05070D), not pure black
- **Panels**: Glassmorphism style (translucent surfaces, subtle borders, backdrop blur)
- **Risk Colors**:
  - Critical: Red + ⛔
  - High: Amber/orange + ⚠️
  - Watch: Yellow + ◐
  - Low: Cyan-green + ✓
- **Accents**: Electric cyan (#00E5FF) for primary actions, violet (#7C5CFF) for AI features
- **Typography**:
  - UI text: Inter or Space Grotesk
  - Data readouts: JetBrains Mono (monospace)
- **Motion**: Purposeful only (orbit animations, risk pulses, confirmation animations)

### Layout Structure
- Persistent left icon-rail navigation
- Top bar with search, data freshness indicator, alerts, and user/role
- Main canvas with module-specific content

### Key Pages
- Command Overview: KPI strip, mini 3D globe, top 5 risks, live activity feed
- Live Tracking: Full 3D globe with orbit bands, time scrubber, filters, object details
- Conjunction & Risk Analysis: Sortable table, detail views with diagrams and graphs
- Maneuver & Preventive Actions: Queue of recommended actions, approval workflow, history log


## 5. Technical Requirements
### Frontend Stack
- React 18+ with TypeScript
- Vite as build tool
- Tailwind CSS for styling
- Three.js or Cesium.js for 3D globe
- Recharts for data visualizations
- Lucide React for icons

### Backend Integration
- Connect to existing Python backend API
- RESTful API endpoints for data fetching
- WebSocket for real-time updates

### Performance & Accessibility
- Accessibility-safe (risk indicators use color + icon + label)
- Responsive design
- Global command palette (Cmd/Ctrl+K)


## 6. Success Metrics
- Time from alert to decision under 1 minute
- 100% of maneuvers logged with approval trail
- Accessibility compliance (WCAG 2.1 AA)
- All modules load in under 2 seconds

