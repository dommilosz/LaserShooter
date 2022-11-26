#pragma once

#include "capture_flow.h"
#include "AsyncUDP.h"

struct IDPacket {
  int clientId;
  int shotId;
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

AsyncUDP udp;
int lastIDpTime = 0;
IDPacket lastIDp;
int KAn = 0;

void SetupUDPServer() {
  udp.connect(IPAddress(192, 168, 4, 255), 19700);
  if (udp.listen(19701)) {
    Serial.print("UDP Listening on IP: ");
    Serial.println(WiFi.localIP());
    udp.onPacket([](AsyncUDPPacket packet) {
      Serial.print("From: ");
      Serial.print(packet.remoteIP());
      Serial.print(" Length: ");
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
    if ((millis() - lastIDpTime) > 500) {
      lastIDp.clientId = 0;
    }

    Point p;
    int w,h;
    int res = GetPoint(&p,&w,&h);

    if (p.found) {
      PointPacket pp;
      pp.idPacket = lastIDp;
      pp.p = p;
      pp.w = w;
      pp.h = h;
      pp.score = -1;

      udp.broadcastTo((uint8_t *)&pp, sizeof(PointPacket), 19700);
      delay(5);
      udp.broadcastTo((uint8_t *)&pp, sizeof(PointPacket), 19700);
      delay(5);
      udp.broadcastTo((uint8_t *)&pp, sizeof(PointPacket), 19700);
      delay(5);
      udp.broadcastTo((uint8_t *)&pp, sizeof(PointPacket), 19700);
      Serial.println("Point found");
      lastIDp.clientId = 0;

      while(p.found){
        int res = GetPoint(&p);
      }
    }
  }
}

void SendKA() {
  KeepAlivePacket p;
  p.n = KAn;
  KAn++;
  udp.broadcastTo((uint8_t *)&p, sizeof(KeepAlivePacket), 19700);
}