#pragma once

struct jpg_buffer{
  size_t len = 0;
  uint8_t *buf = NULL;
};

struct RGB888Resp{
  camera_fb_t *fb;
  dl_matrix3du_t *image_matrix;
  bool valid;
};

camera_fb_t *GetJPEG() {
  camera_fb_t *fb = NULL;
  fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    return NULL;
  }
  return fb;
}

RGB888Resp GetRGB888() {
  camera_fb_t *fb = NULL;
  dl_matrix3du_t *image_matrix = NULL;
  RGB888Resp resp;
  fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    resp.valid = false;
    return resp;
  }
  image_matrix = dl_matrix3du_alloc(1, fb->width, fb->height, 3);
  if (!image_matrix) {
    Serial.println("dl_matrix3du_alloc failed");
    resp.valid = false;
    return resp;
  }
  if (!fmt2rgb888(fb->buf, fb->len, fb->format, image_matrix->item)) {
    Serial.println("fmt2rgb888 failed");
    resp.valid = false;
    return resp;
  }
  resp.valid = true;
  resp.fb = fb;
  resp.image_matrix = image_matrix;
  return resp;
}

bool fmtoJPEG(camera_fb_t *fb, jpg_buffer *buf) {
  if (fb->format != PIXFORMAT_JPEG) {
    bool jpeg_converted = frame2jpg(fb, 80, &buf->buf, &buf->len);
    if (!jpeg_converted) {
      Serial.println("JPEG compression failed");
      return false;
    }
    return true;
  } else {
    buf->len = fb->len;
    buf->buf = fb->buf;
    return true;
  }
}