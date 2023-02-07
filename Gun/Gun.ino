#include <ButtonDebounce.h>
#include <WiFi.h>
#include "AsyncUDP.h"
#include <Adafruit_NeoPixel.h>

#include "config.h"

#include "DFPlayer.h"
#include "NetworkStructs.h"
#include "WifiConnection.h"

ButtonDebounce button(FIRE_BUTTON_PIN, 100);

AsyncUDP udp;
long lastKA = 0;
bool inFireMode = false;
int clientID = 0;

void setup() {
  Serial.begin(115200);

  byte mac[6];
  WiFi.macAddress(mac);

  clientID = (mac[2] << 24) | (mac[3] << 16) | (mac[4] << 8) | mac[5];

  pinMode(FIRE_BUTTON_PIN, INPUT_PULLUP);
  pinMode(LASER_PIN, OUTPUT);

  digitalWrite(LASER_PIN, !LASER_ACTIVE_STATE);
  button.setCallback(buttonChanged);

  if (digitalRead(FIRE_BUTTON_PIN) == FIRE_BUTTON_PIN_STATE) {
    digitalWrite(LASER_PIN, LASER_ACTIVE_STATE);
    while (digitalRead(FIRE_BUTTON_PIN) == FIRE_BUTTON_PIN_STATE) {
      delay(100);
    }
    while (digitalRead(FIRE_BUTTON_PIN) == !FIRE_BUTTON_PIN_STATE) {
      delay(100);
    }
    digitalWrite(LASER_PIN, !LASER_ACTIVE_STATE);
  }

  delay(250);
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

  if ((millis() - lastKA) > KA_TIMEOUT || WiFi.status() != WL_CONNECTED) {
    PlayInfoSound(3);
    WiFi.disconnect();
    ConnectToWiFi();
  }
}

void buttonChanged(const int state) {
  Serial.println("Changed: " + String(state));
  if (state == FIRE_BUTTON_PIN_STATE) {
    fire();
  }
}

void fire() {
  Serial.println("FIRE!");
  IDPacket p;
  p.clientId = clientID;
  p.shotId = esp_random();
  udp.writeTo((uint8_t *)&p, sizeof(IDPacket), WiFi.gatewayIP(), 19701);
  inFireMode = true;
  playRandomFromFolder(2, 2);
  digitalWrite(LASER_PIN, LASER_ACTIVE_STATE);

  int start = millis();
  while((millis() - start) > MAX_LASER_ACTIVE_TIME){
    delay(10);
    if(!inFireMode)break;
  }

  digitalWrite(LASER_PIN, !LASER_ACTIVE_STATE);
  Serial.println("AFTER FIRE!");
}