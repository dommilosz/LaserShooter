#include <ButtonDebounce.h>
#include <Adafruit_NeoPixel.h>

#include "config.h"

#include "DFPlayer.h"
#include "NetworkStructs.h"

long lastKA = 0;
#include "WifiConnection.h"

bool inFireMode = false;
#include "UDPHandler.h"

ButtonDebounce button(FIRE_BUTTON_PIN, 100);


void setup() {
  Serial.begin(115200);
  InitPlayer();

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

  StartUDP();
}

void loop() {
  // put your main code here, to run repeatedly:
  button.update();

  CheckWifiConnection();
}

void buttonChanged(const int state) {
  Serial.println("Changed: " + String(state));
  if (state == FIRE_BUTTON_PIN_STATE) {
    fire();
  }
}

void fire() {
  Serial.println("FIRE!");

  inFireMode = true;
  SendShotPacket();

  playRandomFromFolder(2, 2);
  digitalWrite(LASER_PIN, LASER_ACTIVE_STATE);

  int start = millis();
  while ((millis() - start) < MAX_LASER_ACTIVE_TIME) {
    delay(10);
    if (!inFireMode) break;
  }

  digitalWrite(LASER_PIN, !LASER_ACTIVE_STATE);
  Serial.println("AFTER FIRE!");
}