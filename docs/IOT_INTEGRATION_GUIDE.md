# FurnaceLog IoT Integration Guide

## Overview

This guide covers the complete IoT sensor integration for FurnaceLog, enabling real-time monitoring of temperature, water leaks, fuel levels, and other critical home systems in northern climates.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Quick Start](#quick-start)
3. [Installation & Setup](#installation--setup)
4. [Sensor Configuration](#sensor-configuration)
5. [API Reference](#api-reference)
6. [Frontend Integration](#frontend-integration)
7. [Testing & Debugging](#testing--debugging)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      IOT SENSORS                                 │
│  (Temperature, Leak, Fuel Level, Air Quality, etc.)            │
└─────────┬───────────────────────────────────────────────────────┘
          │
          ▼ MQTT / HTTP POST
┌─────────────────────────────────────────────────────────────────┐
│               MOSQUITTO MQTT BROKER                              │
│         (eclipse-mosquitto:2.0 container)                        │
└─────────┬───────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│           FURNACELOG BACKEND (Node.js/Express)                   │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  IoT Service (iotService.js)                         │       │
│  │  - MQTT client                                       │       │
│  │  - Sensor data ingestion                             │       │
│  │  - Alert rule processing                             │       │
│  └──────────────────────────────────────────────────────┘       │
│                          │                                       │
│  ┌──────────────────────▼──────────────────────────────┐       │
│  │  Alert Service (alertService.js)                     │       │
│  │  - Email notifications                               │       │
│  │  - Alert history                                     │       │
│  └──────────────────────┬──────────────────────────────┘       │
│                          │                                       │
│  ┌──────────────────────▼──────────────────────────────┐       │
│  │  WebSocket Service (websocketService.js)             │       │
│  │  - Real-time broadcasting to clients                 │       │
│  └──────────────────────┬──────────────────────────────┘       │
│                          │                                       │
│  ┌──────────────────────▼──────────────────────────────┐       │
│  │  MongoDB                                             │       │
│  │  - Sensor (sensor configs)                           │       │
│  │  - SensorReading (time-series data)                  │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────┬───────────────────────────────────────────────────────┘
          │
          ▼ WebSocket
┌─────────────────────────────────────────────────────────────────┐
│              FURNACELOG FRONTEND (React)                         │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  useWebSocket hook                                   │       │
│  │  - Real-time sensor updates                          │       │
│  │  - Alert notifications                               │       │
│  └──────────────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  SensorsWidget                                       │       │
│  │  - Display sensors                                   │       │
│  │  - Live readings                                     │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- MongoDB 7+
- Redis 7+

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install the required packages:
- `mqtt` - MQTT client library
- `ws` - WebSocket server

### 2. Configure Environment

Add to `backend/.env`:

```env
# MQTT Configuration
MQTT_HOST=localhost          # Or your MQTT broker hostname
MQTT_PORT=1883
MQTT_USERNAME=               # Optional: MQTT username
MQTT_PASSWORD=               # Optional: MQTT password
MQTT_DISABLED=false          # Set to 'true' to disable MQTT (dev only)

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173
```

### 3. Start MQTT Broker

Using Docker Compose:

```bash
docker-compose -f docker-compose.iot.yml up -d mosquitto
```

This starts:
- Mosquitto MQTT broker on port 1883
- WebSocket MQTT on port 9001

### 4. Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ IoT Service: Connected to MQTT broker
📡 Subscribed to: furnacelog/sensors/#
WebSocket service initialized on /ws/sensors
```

### 5. Test Sensor Connection

#### Option A: HTTP POST (No MQTT Required)

```bash
curl -X POST http://localhost:3000/api/v1/iot/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "sensorId": "test-temp-001",
    "value": 22.5,
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
    "battery": 95,
    "rssi": -65
  }'
```

#### Option B: MQTT Publish

```bash
# Install mosquitto clients
sudo apt-get install mosquitto-clients

# Publish test sensor data
mosquitto_pub -h localhost -t "furnacelog/sensors/test-temp-001" \
  -m '{"temperature":22.5,"battery":95,"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
```

---

## Installation & Setup

### Step 1: Deploy MQTT Broker via Dokploy

Since you're using Dokploy, you can deploy Mosquitto alongside your existing services:

1. **Add to your existing Docker Compose** or create a new service in Dokploy:

```yaml
services:
  mosquitto:
    image: eclipse-mosquitto:2.0
    container_name: furnacelog-mqtt
    restart: unless-stopped
    ports:
      - "1883:1883"
      - "9001:9001"
    volumes:
      - ./mosquitto/config:/mosquitto/config
      - mosquitto-data:/mosquitto/data
      - mosquitto-log:/mosquitto/log
    networks:
      - furnacelog-network

volumes:
  mosquitto-data:
  mosquitto-log:
```

2. **Create Mosquitto configuration** at `mosquitto/config/mosquitto.conf`:

```conf
listener 1883
protocol mqtt

listener 9001
protocol websockets

allow_anonymous true  # Set to false in production
persistence true
persistence_location /mosquitto/data/

log_dest file /mosquitto/log/mosquitto.log
log_dest stdout
```

3. **Deploy via Dokploy**:
   - Upload the docker-compose file
   - Ensure volumes are created
   - Start the service

### Step 2: Update Backend Environment

Add MQTT configuration to your `.env`:

```env
MQTT_HOST=mosquitto           # Use service name if in same Docker network
MQTT_PORT=1883
MQTT_USERNAME=                # Leave empty for anonymous
MQTT_PASSWORD=
MQTT_DISABLED=false
```

### Step 3: Install NPM Dependencies

```bash
cd backend
npm install mqtt ws
```

### Step 4: Restart Backend

The backend will automatically:
- Connect to MQTT broker
- Subscribe to `furnacelog/sensors/#`
- Initialize WebSocket server
- Listen for sensor data

---

## Sensor Configuration

### Registering a Sensor

**Via API:**

```bash
POST /api/v1/homes/:homeId/sensors
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
X-CSRF-Token: YOUR_CSRF_TOKEN

{
  "sensorId": "govee-temp-livingroom-001",
  "name": "Living Room Temperature",
  "type": "temperature",
  "location": "Living Room",
  "specs": {
    "manufacturer": "Govee",
    "model": "H5075",
    "unit": "°C",
    "minValue": -20,
    "maxValue": 60,
    "protocol": "mqtt",
    "batteryPowered": true,
    "updateInterval": 300
  },
  "alerts": {
    "enabled": true,
    "rules": [
      {
        "name": "Freeze Risk",
        "condition": "below",
        "threshold": 5,
        "severity": "critical",
        "message": "Temperature below 5°C - Freeze risk!",
        "enabled": true,
        "cooldownMinutes": 30
      }
    ]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "sensor": {
      "_id": "65abc123...",
      "sensorId": "govee-temp-livingroom-001",
      "name": "Living Room Temperature",
      "mqttTopic": "furnacelog/sensors/govee-temp-livingroom-001",
      ...
    }
  }
}
```

### Sensor Data Format

#### Temperature Sensor

```json
{
  "temperature": 22.5,
  "humidity": 45,
  "battery": 95,
  "rssi": -65,
  "timestamp": "2025-01-04T14:30:00Z"
}
```

#### Water Leak Detector

```json
{
  "leak": 1,  // 0 = dry, 1 = wet
  "battery": 80,
  "timestamp": "2025-01-04T14:30:00Z"
}
```

#### Fuel Level Monitor

```json
{
  "level": 45.5,  // Percentage
  "temperature": 18.5,
  "battery": 88,
  "timestamp": "2025-01-04T14:30:00Z"
}
```

---

## API Reference

### Sensor Endpoints

#### Get All Sensors for Home
```
GET /api/v1/homes/:homeId/sensors
```

**Query Parameters:**
- `type` (optional): Filter by sensor type
- `status` (optional): Filter by status
- `systemId` (optional): Filter by system

**Response:**
```json
{
  "success": true,
  "data": {
    "sensors": [...],
    "total": 5
  }
}
```

#### Create Sensor
```
POST /api/v1/homes/:homeId/sensors
```

#### Update Sensor
```
PATCH /api/v1/homes/:homeId/sensors/:sensorId
```

#### Delete Sensor
```
DELETE /api/v1/homes/:homeId/sensors/:sensorId
```

#### Get Sensor Readings
```
GET /api/v1/homes/:homeId/sensors/:sensorId/readings?hours=24&downsample=true
```

**Query Parameters:**
- `hours`: Number of hours to fetch (default: 24)
- `downsample`: Return aggregated data (default: false)
- `buckets`: Number of data points if downsampled (default: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "readings": [...],
    "stats": {
      "min": 18.5,
      "max": 24.3,
      "avg": 21.2,
      "count": 288
    },
    "period": {
      "start": "2025-01-03T14:30:00Z",
      "end": "2025-01-04T14:30:00Z",
      "hours": 24
    }
  }
}
```

### Alert Endpoints

#### Get Active Alerts
```
GET /api/v1/homes/:homeId/alerts?limit=50
```

#### Acknowledge Alert
```
POST /api/v1/homes/:homeId/alerts/acknowledge
{
  "sensorId": "65abc123...",
  "ruleId": "65def456..."
}
```

---

## Frontend Integration

### Using the WebSocket Hook

```typescript
import { useWebSocket } from '../hooks/useWebSocket';

function MyComponent() {
  const { isConnected, onReading, onAlert } = useWebSocket();

  useEffect(() => {
    // Listen for sensor readings
    const cleanup = onReading((reading) => {
      console.log('New reading:', reading);
      // Update UI with new data
    });

    return cleanup;
  }, [onReading]);

  useEffect(() => {
    // Listen for alerts
    const cleanup = onAlert((alert) => {
      console.log('Alert:', alert);
      // Show notification to user
    });

    return cleanup;
  }, [onAlert]);

  return (
    <div>
      <span>WebSocket: {isConnected ? 'Connected' : 'Disconnected'}</span>
    </div>
  );
}
```

### Using the Sensors Widget

```typescript
import { SensorsWidget } from '../components/sensors/SensorsWidget';

function Dashboard() {
  const homeId = 'your-home-id';

  return (
    <SensorsWidget
      homeId={homeId}
      onAddSensor={() => {
        // Open add sensor modal
      }}
      onSensorClick={(sensorId) => {
        // Navigate to sensor details
      }}
    />
  );
}
```

---

## Testing & Debugging

### Test MQTT Connection

```bash
# Subscribe to all sensor topics
mosquitto_sub -h localhost -t "furnacelog/sensors/#" -v

# In another terminal, publish test data
mosquitto_pub -h localhost -t "furnacelog/sensors/test-001" \
  -m '{"temperature":22.5,"battery":95}'
```

### Monitor Backend Logs

```bash
# Backend will log all MQTT messages
npm run dev

# Look for:
📨 MQTT message received - Topic: furnacelog/sensors/test-001
```

### Test WebSocket Connection

```javascript
// In browser console
const ws = new WebSocket('ws://localhost:3000/ws/sensors?token=YOUR_JWT_TOKEN');

ws.onopen = () => console.log('Connected');
ws.onmessage = (event) => console.log('Message:', JSON.parse(event.data));
ws.onerror = (error) => console.error('Error:', error);
```

---

## Production Deployment

### Security Checklist

1. **Enable MQTT Authentication**

Edit `mosquitto.conf`:
```conf
allow_anonymous false
password_file /mosquitto/config/passwd
```

Create password file:
```bash
mosquitto_passwd -c /mosquitto/config/passwd furnacelog
```

2. **Enable TLS/SSL for MQTT**

```conf
listener 8883
protocol mqtt
cafile /mosquitto/certs/ca.crt
certfile /mosquitto/certs/server.crt
keyfile /mosquitto/certs/server.key
```

3. **Environment Variables**

```env
MQTT_HOST=mosquitto
MQTT_PORT=8883  # Use TLS port
MQTT_USERNAME=furnacelog
MQTT_PASSWORD=YOUR_SECURE_PASSWORD
```

4. **Network Security**

- Use private Docker network
- Don't expose MQTT port (1883) publicly
- Only expose WebSocket port if needed
- Use firewall rules

### Scaling Considerations

- **MongoDB Time-Series**: Readings auto-expire after 90 days
- **MQTT QoS**: Use QoS 1 for important data
- **WebSocket**: Supports multiple concurrent connections
- **Horizontal Scaling**: Use Redis pub/sub for multi-instance deployments

---

## Troubleshooting

### MQTT Connection Fails

**Symptom:** Backend logs `MQTT connection error`

**Solutions:**
1. Check Mosquitto is running: `docker ps | grep mosquitto`
2. Check Mosquitto logs: `docker logs furnacelog-mqtt`
3. Verify MQTT_HOST is correct (use container name if in same network)
4. Test connection: `mosquitto_sub -h localhost -t test`

### Sensors Not Receiving Data

**Symptom:** Sensor stays "offline" despite sending data

**Solutions:**
1. Check sensor is registered: `GET /api/v1/homes/:homeId/sensors`
2. Verify MQTT topic matches: `furnacelog/sensors/{sensorId}`
3. Check backend logs for incoming messages
4. Ensure sensorId is correct (case-sensitive)

### WebSocket Disconnects

**Symptom:** Frontend shows "Disconnected" status

**Solutions:**
1. Check JWT token is valid
2. Verify WebSocket path: `/ws/sensors`
3. Check CORS settings allow WebSocket upgrades
4. Behind proxy: Ensure WebSocket headers are forwarded

### Alerts Not Sending

**Symptom:** Alert rule triggered but no email received

**Solutions:**
1. Check email service configured: `SMTP_*` env vars
2. Verify alert cooldown hasn't blocked: Check `lastTriggered`
3. Check user email exists in database
4. Review backend logs for email errors

---

## Next Steps

1. **Add More Sensor Types**: Extend the system with new sensor types
2. **Mobile App**: Build React Native app with push notifications
3. **ML Integration**: Add anomaly detection and predictive analytics
4. **Automation Rules**: Trigger actions based on sensor readings
5. **Historical Analytics**: Build time-series charts and reports

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/your-repo/issues
- Documentation: https://docs.furnacelog.com
- Email: support@furnacelog.com

---

**Last Updated:** January 4, 2025
**Version:** 1.0.0
