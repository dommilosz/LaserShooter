#pragma once

#include "capture_flow.h"
#include "AsyncUDP.h"
#include "NetworkStructs.h"

AsyncUDP udp;
int lastShotPacketTime = 0;
IDShotPacket lastShotPacket;
int KAn = 0;

void OnPacket(AsyncUDPPacket packet) {
  uint8_t *data = packet.data();
  int packetId = *((int *)data);

  size_t len = packet.length();

  Serial.print("From: ");
  Serial.print(packet.remoteIP());
  Serial.print(" Length: ");
  Serial.print(packet.length());
  Serial.print(" ID: ");
  Serial.print(packetId);


  if (packetId == IDShotPacket_ID) {
    IDShotPacket p = *(IDShotPacket *)data;

    if (lastShotPacket.clientId == 0) {
      lastShotPacket = p;
      lastShotPacketTime = millis();
      Serial.printf(", ClientID: %u, ShotID: %u\n", lastShotPacket.clientId, lastShotPacket.shotId);
    } else {
      Serial.print(", Ignored\n");
    }
  }

  Serial.println();
}

void SetupUDPServer() {
  udp.connect(IPAddress(192, 168, 4, 255), 19700);
  if (udp.listen(19700)) {
    Serial.print("UDP Listening on IP: ");
    Serial.println(WiFi.localIP());
    udp.onPacket(OnPacket);
  }
}

void BroadcastPoint() {
  if (lastShotPacket.clientId != 0) {
    if ((millis() - lastShotPacketTime) > 500) {
      lastShotPacket.clientId = 0;
    }

    Point p;
    int w, h;
    int res = GetPoint(&p, &w, &h);

    if (p.found) {
      PointPacket pp;
      pp.idPacket = lastShotPacket;
      pp.p = p;
      pp.w = w;
      pp.h = h;
      pp.score = -1;

      udp.broadcastTo((uint8_t *)&pp, sizeof(PointPacket), 19700);
      myDFPlayer.playFolder(3, 1);

      delay(5);
      udp.broadcastTo((uint8_t *)&pp, sizeof(PointPacket), 19700);
      delay(5);
      udp.broadcastTo((uint8_t *)&pp, sizeof(PointPacket), 19700);
      delay(5);
      udp.broadcastTo((uint8_t *)&pp, sizeof(PointPacket), 19700);
      Serial.printf("Point found, shotId: %u, clientId: %u\n", pp.idPacket.shotId, pp.idPacket.clientId);
      lastShotPacket.clientId = 0;

      while (p.found) {
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

void StabiliseCamera() {
  int pointCount;
  int res = CountPoints(&pointCount);
  while (pointCount > 0) {
    int res = CountPoints(&pointCount);
  }
}