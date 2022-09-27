#include <ButtonDebounce.h>
#include <WiFi.h>
#include "AsyncUDP.h"
#include <Adafruit_NeoPixel.h>

#define FIRE_BUTTON_PIN 27
#define LASER_PIN 13
#define LASER_ACTIVE_STATE HIGH

ButtonDebounce button(FIRE_BUTTON_PIN, 100);

struct IDPacket {
  int clientId;
  int shotId;
};

struct Point {
  int x;
  int y;
  byte R, G, B;
  bool found;
};

struct PointPacket {
  int pktype = 0;
  IDPacket idPacket;
  int w, h;
  int score;
  Point p;
};

struct KeepAlivePacket {
  int pktype = 1;
  int n;
};

struct NullPacket {
  int pktype;
};

constexpr int GetUUID() {
  return ((__TIME__[3] - '0') * 10 + (__TIME__[4] - '0')) * 3600 + ((__TIME__[3] - '0') * 10 + (__TIME__[4] - '0')) * 60 + ((__TIME__[6] - '0') * 10 + (__TIME__[7] - '0'));
}

AsyncUDP udp;
long lastKA = 0;
bool inFireMode = false;

void ConnectToWiFi() {
  WiFi.begin("ESP32", "123456789");

  for (int i = 0; WiFi.status() != WL_CONNECTED; i++) {
    if (i > 20) {
      digitalWrite(LASER_PIN, HIGH);
      esp_deep_sleep_start();
    }
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(FIRE_BUTTON_PIN, INPUT_PULLUP);
  pinMode(LASER_PIN, OUTPUT);
  digitalWrite(LASER_PIN, !LASER_ACTIVE_STATE);
  button.setCallback(buttonChanged);
  randomSeed(GetUUID());

  ConnectToWiFi();

  if (udp.listen(19700)) {
    Serial.print("UDP Listening on IP: ");
    Serial.println(WiFi.localIP());
    udp.onPacket([](AsyncUDPPacket packet) {
      uint8_t *data = packet.data();
      size_t len = packet.length();

      NullPacket _p = *(NullPacket *)data;
      if (_p.pktype == 0) {
        PointPacket p = *(PointPacket *)data;
        if (inFireMode) {
          inFireMode = false;
        }
      }
      if (_p.pktype == 1) {
        KeepAlivePacket p = *(KeepAlivePacket *)data;
        lastKA = millis();
      }
    });
  }
}

void loop() {
  // put your main code here, to run repeatedly:
  button.update();

  if ((millis() - lastKA) > 15000 || WiFi.status() != WL_CONNECTED) {
    WiFi.disconnect();
    ConnectToWiFi();
  }
}

void buttonChanged(const int state) {
  Serial.println("Changed: " + String(state));
  if (!state) {
    fire();
  }
}


void fire() {
  Serial.println("FIRE!");
  IDPacket p;
  p.clientId = GetUUID();
  p.shotId = random(60000) + 5000;
  udp.writeTo((uint8_t *)&p, sizeof(IDPacket), WiFi.gatewayIP(), 19701);
  inFireMode = true;
  digitalWrite(LASER_PIN, LASER_ACTIVE_STATE);
  for (int i = 0; i < 6; i++) {
    if (!inFireMode) {
      break;
    }
    delay(25);
  }
  digitalWrite(LASER_PIN, !LASER_ACTIVE_STATE);
  Serial.println("AFTER FIRE!");
}