# Water Tank Level Sensor for FurnaceLog

## Overview

This guide details how to build and install a WiFi-enabled water tank level sensor for monitoring your fresh water tank in real-time via FurnaceLog. Perfect for homes on trucked water services in Canada's North.

## Problem Statement

- **Current limitation**: Only a binary red light (>50% or <50%) indicates tank level
- **Goal**: Accurate percentage reading (0-100%) displayed in FurnaceLog
- **Challenge**: Fiberglass tank under house, no visual inspection possible
- **Solution**: WiFi sensor using ESP32 microcontroller + ultrasonic distance sensor

---

## Hardware Options

### Option 1: Ultrasonic Distance Sensor (RECOMMENDED)

**Best for**: Non-invasive installation, high accuracy, cold-resistant

**Components:**
- **ESP32 Development Board** (~$8-12 CAD)
  - Built-in WiFi
  - Low power consumption
  - Wide temperature range

- **JSN-SR04T Waterproof Ultrasonic Sensor** (~$10-15 CAD)
  - Waterproof & temperature-resistant (-40°C to +85°C)
  - 2-4m measurement range
  - ±1% accuracy
  - Non-contact measurement

- **5V Power Supply** (~$5-10 CAD)
  - USB power adapter or DC power supply
  - Can use existing power outlet near tank

**Total Cost**: ~$25-40 CAD

**How it works:**
1. Sensor mounts on **top** of tank lid
2. Sends ultrasonic pulse downward
3. Measures time for echo to return from water surface
4. Calculates distance to water
5. Converts to percentage based on tank height

**Advantages:**
- No contact with water (no contamination)
- Easy to install through small hole in tank lid
- Very accurate
- Works in freezing temperatures
- No moving parts

**Disadvantages:**
- Requires hole in tank top (can seal with waterproof grommet)
- Foam/bubbles on water surface can affect accuracy (rare issue)

---

### Option 2: Submersible Pressure Sensor

**Best for**: Maximum accuracy, permanent installation

**Components:**
- **ESP32 Development Board** (~$8-12 CAD)
- **0-5m Submersible Pressure Sensor** (~$30-50 CAD)
  - Measures water column pressure
  - Stainless steel, food-safe
  - 0-5V or 4-20mA output

**Total Cost**: ~$40-65 CAD

**How it works:**
1. Sensor sits at bottom of tank
2. Measures pressure from water column above
3. Converts pressure to depth/level
4. ESP32 reads analog voltage and calculates percentage

**Advantages:**
- Extremely accurate (±0.5%)
- No maintenance
- Not affected by surface conditions

**Disadvantages:**
- More expensive
- Requires waterproof cable entry
- Sensor sits in potable water (must be food-safe)

---

### Option 3: Float Switch Array (Budget Option)

**Best for**: Simple installation, step-level monitoring

**Components:**
- **ESP32 Development Board** (~$8-12 CAD)
- **4x Float Switches** (~$15-20 CAD total)
  - Mounted at 25%, 50%, 75%, 100% levels

**Total Cost**: ~$25-35 CAD

**How it works:**
1. Float switches at different heights
2. Each switch triggers when water level rises/falls past it
3. ESP32 reads which switches are active

**Advantages:**
- Very simple
- Extremely reliable
- No calibration needed

**Disadvantages:**
- Only step-level accuracy (25% increments)
- Requires multiple holes in tank
- Less precise than other methods

---

## Recommended Solution: ESP32 + JSN-SR04T Ultrasonic

### Parts List

| Item | Quantity | Est. Price (CAD) | Source |
|------|----------|------------------|--------|
| ESP32 DevKit V1 | 1 | $8-12 | Amazon, AliExpress |
| JSN-SR04T Ultrasonic Sensor | 1 | $10-15 | Amazon, AliExpress |
| 5V USB Power Adapter | 1 | $5-10 | Local hardware store |
| Micro-USB Cable | 1 | $3-5 | Local hardware store |
| Waterproof Cable Gland (M20) | 1 | $2-5 | Hardware store |
| Enclosure Box (IP65) | 1 | $10-15 | Hardware store |
| Jumper Wires (Dupont) | 4 | $2 | Amazon |
| Silicone Sealant | 1 | $5 | Hardware store |

**Total**: ~$45-70 CAD

### Tools Required

- Drill with step bit or 20mm hole saw
- Screwdriver
- Wire strippers
- Soldering iron (optional, for permanent connections)
- Multimeter (for testing)
- Tape measure

---

## Physical Installation

### Tank Measurements

**Before ordering parts, measure your tank:**

1. **Tank Height** (inside measurement from bottom to top): ______ cm
2. **Tank Diameter**: ______ cm
3. **Access to top of tank**: Yes / No
4. **Material**: Fiberglass
5. **Nearby power outlet**: Yes / No

### Sensor Placement

**Ultrasonic Sensor Mounting:**

```
┌─────────────────────────────────┐
│     TANK LID (Top View)         │
│                                 │
│         [SENSOR HOLE]           │ <- Center or offset
│              ↓                  │
│         Ultrasonic              │
│          Sensor                 │
└─────────────────────────────────┘

Side View:
        Enclosure
            │
      ┌─────┴─────┐
      │   ESP32   │
      │  ╔═══╗    │
      │  ║USB║    │ <- Power
      │  ╚═══╝    │
      └─────┬─────┘
            │ Cable
     ┌──────┴──────┐
     │             │
═════╧═════════════╧══════  <- Tank lid
     ║ Ultrasonic  ║
     ║   Sensor    ║
     ╚═════════════╝
           ↓
    ▼▼▼ Ultrasonic waves ▼▼▼
           ↓
~~~~~~~~~~~~~~~~~~~~~~~~~  <- Water surface (measured)
│                        │
│      Fresh Water       │
│                        │
└────────────────────────┘
```

### Installation Steps

1. **Drill Hole in Tank Lid**
   - Use 20mm hole saw or step bit
   - Location: Center or near edge where you can route cable
   - Clean burrs and edges

2. **Install Cable Gland**
   - Insert waterproof cable gland through hole
   - Tighten from both sides
   - Apply silicone sealant around edges for extra waterproofing

3. **Mount Ultrasonic Sensor**
   - Thread sensor cable through gland
   - Position sensor pointing straight down
   - Secure with mounting bracket or hot glue
   - Ensure sensor face is 2-5cm below lid (not flush)

4. **Mount ESP32 Enclosure**
   - Place weatherproof enclosure near tank
   - Can mount on tank side, wall, or shelf
   - Keep within 1-2m of sensor for cable length

5. **Connect Power**
   - Run USB cable to nearest outlet
   - If no outlet nearby, consider:
     - Extension cord to existing outlet
     - Battery bank (requires recharging/replacing)
     - Solar panel + battery (advanced)

---

## Calibration Process

### Initial Calibration

1. **Empty Tank Measurement**
   - When tank is empty (or as low as possible)
   - Note the distance reading (this is your MAX distance)
   - Example: 150 cm from sensor to tank bottom

2. **Full Tank Measurement**
   - Fill tank completely
   - Note the distance reading (this is your MIN distance)
   - Example: 30 cm from sensor to water surface

3. **Calculate Usable Range**
   ```
   Usable Range = MAX distance - MIN distance
   Example: 150 cm - 30 cm = 120 cm usable range
   ```

4. **Update Firmware**
   - Enter these values in the ESP32 code (see firmware section)
   ```cpp
   const int TANK_HEIGHT_CM = 150;     // Distance when empty
   const int SENSOR_OFFSET_CM = 30;    // Distance when full
   ```

### Testing Calibration

- Compare sensor reading to visual inspection (if possible)
- Test at 25%, 50%, 75% levels
- Adjust offset values if needed

---

## Power Considerations

### Option A: Continuous Power (Recommended)
- 5V USB power adapter
- Always-on monitoring
- Sensor updates every 5 minutes

**Power consumption**: ~100-150 mA @ 5V = 0.5-0.75W

**Annual cost**: ~$1-2 CAD/year (at $0.15/kWh)

### Option B: Battery Power
- 18650 Li-ion batteries (2x 3.7V in series or with boost converter)
- Deep sleep mode between readings
- Wake every 30-60 minutes to read and transmit

**Battery life**: 1-3 months depending on update frequency

**Requires**: Solar panel or manual battery replacement

---

## Sensor Configuration

### Wiring Diagram

```
ESP32 DevKit          JSN-SR04T Sensor
─────────────         ────────────────

3V3  ────────────────  VCC (Red)
GND  ────────────────  GND (Black)
GPIO 18 ─────────────  TRIG (Yellow)
GPIO 19 ─────────────  ECHO (Green)

Power:
5V USB Adapter ──────  VIN or USB port on ESP32
```

### Pin Connections

| ESP32 Pin | Sensor Pin | Wire Color (typical) |
|-----------|------------|----------------------|
| 3V3 (3.3V) | VCC | Red |
| GND | GND | Black |
| GPIO 18 | TRIG | Yellow |
| GPIO 19 | ECHO | Green |

**Note**: JSN-SR04T can use 3.3V or 5V. Using 3.3V is safer for ESP32 GPIO pins.

---

## Next Steps

1. **Order Components** (see parts list above)
2. **Measure Your Tank** (record dimensions)
3. **Flash Firmware** (see [water-tank-sensor-firmware.ino](./water-tank-sensor-firmware.ino))
4. **Install Hardware** (follow installation steps)
5. **Configure in FurnaceLog** (see configuration guide)

---

## Troubleshooting

### Sensor Reads 0% or 100% Constantly
- Check wiring connections
- Verify sensor is not touching water
- Ensure sensor is pointed straight down
- Check for obstructions

### Erratic Readings
- Foam on water surface (wait for foam to settle)
- Temperature fluctuations (sensor warming up)
- Electrical interference (move away from motors/pumps)
- Poor WiFi signal (add WiFi extender)

### No WiFi Connection
- Check WiFi credentials in firmware
- Verify WiFi network is 2.4 GHz (ESP32 doesn't support 5 GHz)
- Check signal strength in tank location
- Consider WiFi extender

### Sensor Offline in FurnaceLog
- Check power supply
- Verify MQTT broker is running
- Check ESP32 serial output for errors
- Restart ESP32

---

## Maintenance

### Monthly
- Check power connection
- Verify reading accuracy (compare to red light if working)

### Quarterly
- Clean sensor face with soft cloth
- Check cable connections
- Inspect enclosure for moisture

### Annually
- Full calibration check
- Replace any corroded connections

---

## Safety & Code Compliance

- **Potable Water**: Ensure all materials touching water are food-safe
- **Electrical**: Use proper waterproof enclosures and GFCI outlets
- **Structural**: Don't compromise tank integrity with excessive holes
- **Local Codes**: Check with local building inspector if required

---

## Advanced Features (Future Enhancements)

- **Low Water Alerts**: Push notifications when below 20%
- **Usage Tracking**: Calculate daily/weekly water consumption
- **Delivery Scheduling**: Automatic alerts to water truck company
- **Multiple Tanks**: Monitor holding tank + grey water tank
- **Temperature Sensing**: Add DS18B20 to monitor for freezing
- **Leak Detection**: Alert if level drops rapidly

---

## Support

If you encounter issues:
1. Check troubleshooting section above
2. Review serial monitor output from ESP32
3. Post in FurnaceLog community forums
4. Open GitHub issue with sensor logs

---

**Document Version**: 1.0
**Last Updated**: January 2026
**Author**: FurnaceLog Team
