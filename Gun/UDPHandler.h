#include "AsyncUDP.h"

AsyncUDP udp;
int clientID = 0;

int SendIDPacket() {
  IDPacket p;
  p.clientId = clientID;

  return udp.broadcastTo((uint8_t *)&p, sizeof(IDPacket), 19700);
}

int SendShotPacket() {
  IDShotPacket p;
  p.clientId = clientID;
  p.shotId = esp_random();
  return udp.broadcastTo((uint8_t *)&p, sizeof(IDShotPacket), 19700);
}

void OnPacket(AsyncUDPPacket packet) {
  uint8_t *data = packet.data();
  int packetId = *((int *)data);
  Serial.printf("Packet: %u\n", packetId);

  size_t len = packet.length();

  if (packetId == PointPacket_ID) {
    PointPacket p = *(PointPacket *)data;
    inFireMode = false;
  }
  if (packetId == KeepAlivePacket_ID) {
    KeepAlivePacket p = *(KeepAlivePacket *)data;
    lastKA = millis();
    SendIDPacket();
  }
}

void StartUDP() {
  byte mac[6];
  WiFi.macAddress(mac);

  clientID = (mac[2] << 24) | (mac[3] << 16) | (mac[4] << 8) | mac[5];

  Serial.println("Starting udp...");
  delay(200);

  if (udp.listen(19700)) {
    Serial.print("UDP Listening on IP: ");
    Serial.println(WiFi.localIP());
    udp.onPacket(OnPacket);
  } else {
    Serial.println("UDP Listening error!");
  }
}
