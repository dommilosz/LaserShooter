#include "esp_camera.h"
#include <WiFi.h>

#include "app_httpd.h"

#define CAMERA_MODEL_AI_THINKER  // Has PSRAM

#include "camera_pins.h"
#include "dfplayer.h"
#include "data_server.h"

const char* ssid = "ESP32";
const char* password = "123456789";

void startCameraServer();

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  Serial.println();

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  // if PSRAM IC present, init with UXGA resolution and higher JPEG quality
  //                      for larger pre-allocated frame buffer.
  if (psramFound()) {
    config.frame_size = FRAMESIZE_UXGA;
    config.jpeg_quality = 10;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }

  // camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  sensor_t* s = esp_camera_sensor_get();
  s->set_framesize(s, (framesize_t)1);
  s->set_special_effect(s, 2);
  s->set_brightness(s, -2);
  s->set_saturation(s, -2);
  s->set_agc_gain(s, 0);
  s->set_lenc(s, 1);
  s->set_contrast(s, 2);
  s->set_gain_ctrl(s, 0);
  s->set_exposure_ctrl(s, 0);
  s->set_whitebal(s, 0);
  s->set_awb_gain(s, 0);
  s->set_wpc(s, 0);
  s->set_bpc(s, 0);
  s->set_aec_value(s, 450);
  s->set_hmirror(s, 1);

  WiFi.softAP(ssid, password);

  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(IP);

  startCameraServer();
  StabiliseCamera();
  
  setupPlayer();

  Serial.print("Camera Ready! Use 'http://");
  Serial.print(WiFi.localIP());
  Serial.println("' to connect");
  SetupUDPServer();
}

long nextKA = 5000;
void loop() {
  // put your main code here, to run repeatedly:
  BroadcastPoint();
  if (nextKA < millis()) {
    SendKA();
    nextKA = millis() + 5000;
  }
  delay(5);
}