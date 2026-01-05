/**
 * FurnaceLog - Water Tank Level Sensor
 *
 * ESP32 firmware for monitoring fresh water tank level using JSN-SR04T ultrasonic sensor
 * Publishes readings to FurnaceLog via MQTT
 *
 * Hardware:
 * - ESP32 DevKit
 * - JSN-SR04T Waterproof Ultrasonic Sensor
 *
 * Connections:
 * - Sensor VCC -> ESP32 3.3V
 * - Sensor GND -> ESP32 GND
 * - Sensor TRIG -> GPIO 18
 * - Sensor ECHO -> GPIO 19
 *
 * Author: FurnaceLog Team
 * Version: 1.0
 * Last Updated: January 2026
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

// WiFi Credentials
const char* WIFI_SSID = "YOUR_WIFI_SSID";           // Change to your WiFi name
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";   // Change to your WiFi password

// MQTT Broker Settings
const char* MQTT_SERVER = "your-furnacelog-server.com";  // Your FurnaceLog server IP or domain
const int MQTT_PORT = 1883;
const char* MQTT_USERNAME = "";                     // Leave empty if no authentication
const char* MQTT_PASSWORD = "";                     // Leave empty if no authentication

// Sensor Configuration
const char* SENSOR_ID = "water-tank-001";           // Unique ID for this sensor
const char* SENSOR_NAME = "Fresh Water Tank";        // Friendly name
const char* SENSOR_LOCATION = "Under House";         // Location description

// Tank Dimensions (CALIBRATE THESE!)
const int TANK_HEIGHT_CM = 150;                     // Distance from sensor to tank bottom when EMPTY
const int SENSOR_OFFSET_CM = 30;                     // Distance from sensor to water surface when FULL
const int TANK_USABLE_HEIGHT_CM = TANK_HEIGHT_CM - SENSOR_OFFSET_CM;  // Calculated automatically

// Sensor Pins
const int TRIG_PIN = 18;                            // GPIO 18
const int ECHO_PIN = 19;                            // GPIO 19

// Measurement Settings
const int UPDATE_INTERVAL_MS = 300000;              // 5 minutes (300000 ms)
const int MEASUREMENTS_PER_READING = 5;             // Take 5 measurements and average them
const int MEASUREMENT_DELAY_MS = 100;               // Delay between measurements

// Alert Thresholds (optional, for local LED indicator)
const int LOW_WATER_THRESHOLD = 20;                 // Alert when below 20%
const int CRITICAL_WATER_THRESHOLD = 10;            // Critical when below 10%

// LED Pin (built-in LED on ESP32)
const int LED_PIN = 2;

// ============================================
// GLOBAL VARIABLES
// ============================================

WiFiClient espClient;
PubSubClient mqttClient(espClient);

unsigned long lastReadingTime = 0;
float currentWaterLevel = 0.0;
bool wifiConnected = false;
bool mqttConnected = false;

// ============================================
// SETUP
// ============================================

void setup() {
  // Initialize Serial for debugging
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n\n");
  Serial.println("====================================");
  Serial.println("FurnaceLog - Water Tank Sensor");
  Serial.println("====================================");
  Serial.print("Sensor ID: ");
  Serial.println(SENSOR_ID);
  Serial.print("Tank Height: ");
  Serial.print(TANK_HEIGHT_CM);
  Serial.println(" cm");
  Serial.print("Usable Range: ");
  Serial.print(TANK_USABLE_HEIGHT_CM);
  Serial.println(" cm");
  Serial.println("====================================\n");

  // Initialize pins
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);

  // Initialize with LED on (booting)
  digitalWrite(LED_PIN, HIGH);

  // Connect to WiFi
  connectWiFi();

  // Setup MQTT
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);

  // LED off after boot
  digitalWrite(LED_PIN, LOW);

  // Take initial reading
  lastReadingTime = millis() - UPDATE_INTERVAL_MS;  // Force immediate reading
}

// ============================================
// MAIN LOOP
// ============================================

void loop() {
  // Maintain WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    wifiConnected = false;
    Serial.println("WiFi disconnected. Reconnecting...");
    connectWiFi();
  } else {
    wifiConnected = true;
  }

  // Maintain MQTT connection
  if (!mqttClient.connected()) {
    mqttConnected = false;
    reconnectMQTT();
  } else {
    mqttConnected = true;
    mqttClient.loop();
  }

  // Check if it's time for a new reading
  unsigned long currentTime = millis();
  if (currentTime - lastReadingTime >= UPDATE_INTERVAL_MS) {
    lastReadingTime = currentTime;

    // Take reading
    currentWaterLevel = getWaterLevelPercentage();

    // Publish to MQTT
    publishReading(currentWaterLevel);

    // Update LED based on water level
    updateLED(currentWaterLevel);

    // Print to serial
    printStatus(currentWaterLevel);
  }

  // Small delay to prevent watchdog issues
  delay(100);
}

// ============================================
// WIFI FUNCTIONS
// ============================================

void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal Strength (RSSI): ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    wifiConnected = true;
  } else {
    Serial.println("\n✗ WiFi connection failed!");
    wifiConnected = false;
  }
}

// ============================================
// MQTT FUNCTIONS
// ============================================

void reconnectMQTT() {
  if (!wifiConnected) return;

  // Try to connect to MQTT broker
  if (!mqttClient.connected()) {
    Serial.print("Connecting to MQTT broker... ");

    String clientId = "ESP32-WaterTank-";
    clientId += String(random(0xffff), HEX);

    bool connected = false;
    if (strlen(MQTT_USERNAME) > 0) {
      connected = mqttClient.connect(clientId.c_str(), MQTT_USERNAME, MQTT_PASSWORD);
    } else {
      connected = mqttClient.connect(clientId.c_str());
    }

    if (connected) {
      Serial.println("✓ Connected to MQTT!");
      mqttConnected = true;

      // Subscribe to command topic (for remote calibration, etc.)
      String commandTopic = "furnacelog/sensors/" + String(SENSOR_ID) + "/command";
      mqttClient.subscribe(commandTopic.c_str());

      // Publish initial connection message
      publishStatus("online");

    } else {
      Serial.print("✗ Failed, rc=");
      Serial.println(mqttClient.state());
      mqttConnected = false;
      delay(5000);  // Wait before retry
    }
  }
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  // Handle incoming MQTT messages (for future commands)
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("]: ");

  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);

  // Parse commands (e.g., "calibrate", "read_now", etc.)
  if (message == "read_now") {
    currentWaterLevel = getWaterLevelPercentage();
    publishReading(currentWaterLevel);
  }
}

void publishReading(float percentage) {
  if (!mqttConnected) {
    Serial.println("Cannot publish - MQTT not connected");
    return;
  }

  // Create JSON payload
  StaticJsonDocument<256> doc;
  doc["sensorId"] = SENSOR_ID;
  doc["level"] = round(percentage * 10) / 10.0;  // Round to 1 decimal place
  doc["percentage"] = round(percentage * 10) / 10.0;  // Alias for compatibility
  doc["value"] = round(percentage * 10) / 10.0;  // Alias for compatibility
  doc["unit"] = "%";
  doc["timestamp"] = millis();
  doc["rssi"] = WiFi.RSSI();

  String jsonString;
  serializeJson(doc, jsonString);

  // Publish to MQTT topic
  String topic = "furnacelog/sensors/" + String(SENSOR_ID);

  if (mqttClient.publish(topic.c_str(), jsonString.c_str(), true)) {
    Serial.print("✓ Published to MQTT: ");
    Serial.println(jsonString);
  } else {
    Serial.println("✗ Failed to publish to MQTT");
  }
}

void publishStatus(const char* status) {
  if (!mqttConnected) return;

  StaticJsonDocument<128> doc;
  doc["sensorId"] = SENSOR_ID;
  doc["status"] = status;
  doc["timestamp"] = millis();

  String jsonString;
  serializeJson(doc, jsonString);

  String topic = "furnacelog/sensors/" + String(SENSOR_ID) + "/status";
  mqttClient.publish(topic.c_str(), jsonString.c_str(), true);
}

// ============================================
// ULTRASONIC SENSOR FUNCTIONS
// ============================================

float measureDistance() {
  // Send ultrasonic pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Read echo pulse
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);  // 30ms timeout

  if (duration == 0) {
    Serial.println("⚠ Warning: No echo received (sensor timeout)");
    return -1;  // Error
  }

  // Calculate distance in cm
  // Speed of sound = 343 m/s = 0.0343 cm/µs
  // Distance = (duration / 2) * 0.0343
  float distance = (duration / 2.0) * 0.0343;

  return distance;
}

float getWaterLevelPercentage() {
  float totalDistance = 0;
  int validMeasurements = 0;

  Serial.println("\n--- Taking Measurements ---");

  // Take multiple measurements and average them
  for (int i = 0; i < MEASUREMENTS_PER_READING; i++) {
    float distance = measureDistance();

    if (distance > 0 && distance <= TANK_HEIGHT_CM + 20) {  // Sanity check
      totalDistance += distance;
      validMeasurements++;

      Serial.print("  Measurement ");
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(distance);
      Serial.println(" cm");
    } else {
      Serial.print("  Measurement ");
      Serial.print(i + 1);
      Serial.println(": Invalid/Out of range");
    }

    delay(MEASUREMENT_DELAY_MS);
  }

  if (validMeasurements == 0) {
    Serial.println("✗ Error: No valid measurements");
    return -1;  // Error
  }

  // Calculate average distance
  float avgDistance = totalDistance / validMeasurements;

  // Calculate water depth
  // Water depth = Tank height - Distance to water surface
  float waterDepth = TANK_HEIGHT_CM - avgDistance;

  // Handle edge cases
  if (waterDepth < 0) waterDepth = 0;  // Empty tank
  if (waterDepth > TANK_USABLE_HEIGHT_CM) waterDepth = TANK_USABLE_HEIGHT_CM;  // Full tank

  // Calculate percentage
  float percentage = (waterDepth / (float)TANK_USABLE_HEIGHT_CM) * 100.0;

  // Clamp to 0-100%
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  Serial.println("---------------------------");
  Serial.print("Average Distance: ");
  Serial.print(avgDistance);
  Serial.println(" cm");
  Serial.print("Water Depth: ");
  Serial.print(waterDepth);
  Serial.println(" cm");
  Serial.print("Water Level: ");
  Serial.print(percentage);
  Serial.println(" %");
  Serial.println("---------------------------\n");

  return percentage;
}

// ============================================
// LED INDICATOR FUNCTIONS
// ============================================

void updateLED(float percentage) {
  if (percentage < CRITICAL_WATER_THRESHOLD) {
    // Critical - fast blink
    blinkLED(5, 100);
  } else if (percentage < LOW_WATER_THRESHOLD) {
    // Low - slow blink
    blinkLED(3, 300);
  } else {
    // Normal - LED off
    digitalWrite(LED_PIN, LOW);
  }
}

void blinkLED(int times, int delayMs) {
  for (int i = 0; i < times; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(delayMs);
    digitalWrite(LED_PIN, LOW);
    delay(delayMs);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

void printStatus(float percentage) {
  Serial.println("\n╔════════════════════════════════════════╗");
  Serial.println("║       WATER TANK LEVEL STATUS          ║");
  Serial.println("╠════════════════════════════════════════╣");

  Serial.print("║  Level: ");
  Serial.print(percentage);
  Serial.print(" %");
  if (percentage < 10) Serial.print(" ");
  if (percentage < 100) Serial.print(" ");
  Serial.println("                          ║");

  Serial.print("║  WiFi: ");
  Serial.print(wifiConnected ? "Connected    " : "Disconnected ");
  Serial.print("RSSI: ");
  if (wifiConnected) {
    Serial.print(WiFi.RSSI());
    Serial.print(" dBm");
  } else {
    Serial.print("N/A    ");
  }
  Serial.println("  ║");

  Serial.print("║  MQTT: ");
  Serial.print(mqttConnected ? "Connected    " : "Disconnected ");
  Serial.println("                 ║");

  // Visual bar graph
  Serial.print("║  [");
  int bars = percentage / 5;  // 20 bars total (5% per bar)
  for (int i = 0; i < 20; i++) {
    if (i < bars) {
      Serial.print("█");
    } else {
      Serial.print("░");
    }
  }
  Serial.println("]  ║");

  // Status message
  Serial.print("║  Status: ");
  if (percentage < CRITICAL_WATER_THRESHOLD) {
    Serial.print("CRITICAL - Order water now!   ");
  } else if (percentage < LOW_WATER_THRESHOLD) {
    Serial.print("LOW - Schedule delivery       ");
  } else if (percentage > 80) {
    Serial.print("FULL - Good supply            ");
  } else {
    Serial.print("NORMAL                        ");
  }
  Serial.println("║");

  Serial.println("╚════════════════════════════════════════╝\n");

  Serial.print("Next reading in: ");
  Serial.print(UPDATE_INTERVAL_MS / 60000);
  Serial.println(" minutes\n");
}
