#pragma once

#include "capture_flow.h"
#include "AsyncUDP.h"

struct IDPacket {
  int clientId;
  int shotId;
};

struct PointPacket {
  IDPacket idPacket;
  int w, h;
  int score;
  Point p;
};

AsyncUDP udp;
int lastIDpTime = 0;
IDPacket lastIDp;

void SetupUDPServer() {
  udp.connect(IPAddress(192, 168, 4, 255), 19700);
  if (udp.listen(19701)) {
    Serial.print("UDP Listening on IP: ");
    Serial.println(WiFi.localIP());
    udp.onPacket([](AsyncUDPPacket packet) {
      Serial.print("From: ");
      Serial.print(packet.remoteIP());
      Serial.print("Length: ");
      Serial.print(packet.length());

      uint8_t *data = packet.data();
      size_t len = packet.length();

      if (lastIDp.clientId == 0) {
        lastIDp = *(IDPacket *)data;
        lastIDpTime = millis();
        Serial.printf(", ClientID: %u, ShotID: %u\n", lastIDp.clientId, lastIDp.shotId);
      } else {
        Serial.print(", Ignored\n");
      }
    });
  }
}

void BroadcastPoint() {
  if (lastIDp.clientId != 0) {
    if((millis() - lastIDpTime) > 5000){
      lastIDp.clientId = 0;
    }

    Point p;
    int res = GetPoint(&p);

    if (p.found) {
      PointPacket pp;
      pp.idPacket = lastIDp;
      pp.p = p;

      udp.broadcastTo((uint8_t *)&pp, sizeof(PointPacket), 19700);
      delay(5);
      udp.broadcastTo((uint8_t *)&pp, sizeof(PointPacket), 19700);
      delay(5);
      udp.broadcastTo((uint8_t *)&pp, sizeof(PointPacket), 19700);
      delay(5);
      udp.broadcastTo((uint8_t *)&pp, sizeof(PointPacket), 19700);
      Serial.println("Point found");
      lastIDp.clientId = 0;
    }
  }
}