#pragma once

struct jpg_buffer {
  size_t len = 0;
  uint8_t *buf = NULL;
};

struct RGB888Resp {
  camera_fb_t *fb;
  fb_data_t image_matrix;
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

uint8_t *out_buf = NULL;
size_t out_buf_len = 0;

RGB888Resp GetRGB888() {
  camera_fb_t *fb = NULL;
  RGB888Resp resp;
  fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    resp.valid = false;
    return resp;
  }
  size_t out_len = fb->width * fb->height * 3;
  size_t out_width = fb->width;
  size_t out_height = fb->height;
  if (out_len != out_buf_len || !out_buf) {
    if (out_buf) {
      free(out_buf);
    }
    out_buf = (uint8_t *)malloc(out_len);
    out_buf_len = out_len;
  }
  if (!out_buf) {
    Serial.println("malloc failed");
    resp.valid = false;
    return resp;
  }
  if (!fmt2rgb888(fb->buf, fb->len, fb->format, out_buf)) {
    Serial.println("fmt2rgb888 failed");
    resp.valid = false;
    return resp;
  }
  resp.valid = true;
  resp.fb = fb;
  fb_data_t rfb;
  rfb.width = out_width;
  rfb.height = out_height;
  rfb.data = out_buf;
  rfb.bytes_per_pixel = 3;
  rfb.format = FB_BGR888;
  resp.image_matrix = rfb;
  return resp;
}

bool FmtoJPEG(camera_fb_t *fb, jpg_buffer *buf) {
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