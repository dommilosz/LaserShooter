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