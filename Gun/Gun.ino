#include <ButtonDebounce.h>
#include <WiFi.h>
#include "AsyncUDP.h"
#include <Adafruit_NeoPixel.h>
#include "DFRobotDFPlayerMini.h"

DFRobotDFPlayerMini myDFPlayer;

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

AsyncUDP udp;
long lastKA = 0;
bool inFireMode = false;
int SDFileCount;
int clientID = 0;

void PlayInfoSound(int i) {
  myDFPlayer.volume(8);
  myDFPlayer.playFolder(1, i);
  delay(2000);
  myDFPlayer.volume(30);
}

void ConnectToWiFi() {
  WiFi.begin("ESP32", "123456789");
  delay(200);
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.begin("ESP32", "123456789");
  }

  for (int i = 0; WiFi.status() != WL_CONNECTED; i++) {
    if (i == 1) {
      WiFi.begin("ESP32", "123456789");
    }
    if (i == 4) {
      WiFi.begin("ESP32", "123456789");
    }
    if (i > 30) {
      digitalWrite(LASER_PIN, HIGH);
      PlayInfoSound(3);
      esp_deep_sleep_start();
    }
    delay(1000);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  PlayInfoSound(1);
}

void setup() {
  Serial.begin(115200);
  Serial1.begin(9600, SERIAL_8N1, 4, 12);

  byte mac[6];
  WiFi.macAddress(mac);

  clientID = (mac[2] << 24) | (mac[3] << 16) | (mac[4] << 8) | mac[5];

  pinMode(FIRE_BUTTON_PIN, INPUT_PULLUP);
  pinMode(LASER_PIN, OUTPUT);
  digitalWrite(LASER_PIN, !LASER_ACTIVE_STATE);
  button.setCallback(buttonChanged);

  if (!myDFPlayer.begin(Serial1)) {
    Serial.println(F("Unable to begin:"));
    Serial.println(F("1.Please recheck the connection!"));
    Serial.println(F("2.Please insert the SD card!"));
    Serial.println(F("Audio may not work properly"));
  } else {
    SDFileCount = 2;
    Serial.printf("Found %u files\n", SDFileCount);
  }

  if(!digitalRead(FIRE_BUTTON_PIN)){
    digitalWrite(LASER_PIN, LASER_ACTIVE_STATE);
    while(!digitalRead(FIRE_BUTTON_PIN)){
      delay(100);
    }
    while(digitalRead(FIRE_BUTTON_PIN)){
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

  if ((millis() - lastKA) > 15000 || WiFi.status() != WL_CONNECTED) {
    PlayInfoSound(3);
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

void playRandomShot() {
  if (SDFileCount <= 0) {
    Serial.println("No shot files to play (should be in 02 directory)");
    return;
  }
  int selected = random(1, SDFileCount + 1);
  myDFPlayer.playFolder(2, selected);
}

void fire() {
  Serial.println("FIRE!");
  IDPacket p;
  p.clientId = clientID;
  p.shotId = esp_random();
  udp.writeTo((uint8_t *)&p, sizeof(IDPacket), WiFi.gatewayIP(), 19701);
  inFireMode = true;
  playRandomShot();
  digitalWrite(LASER_PIN, LASER_ACTIVE_STATE);
  delay(150);
  digitalWrite(LASER_PIN, !LASER_ACTIVE_STATE);
  Serial.println("AFTER FIRE!");
}