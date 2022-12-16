#pragma once

#include "camera_capture.h"
#include "bright_point_detector.h"

void Cleanup(jpg_buffer *jpg_buf, RGB888Resp *resp) {
  if (resp->fb) {
    esp_camera_fb_return(resp->fb);
    resp->fb = NULL;
    jpg_buf->buf = NULL;
  } else if (jpg_buf->buf) {
    free(jpg_buf->buf);
    jpg_buf->buf = NULL;
  }
}

int GetFrame(jpg_buffer *buf, RGB888Resp *resp) {
  *resp = GetRGB888();
  if (!resp->valid) {
    Cleanup(buf, resp);
    return ESP_FAIL;
  }
  bool converted = FmtoJPEG(resp->fb, buf);
  if (!converted) {
    Cleanup(buf, resp);
    return ESP_FAIL;
  }
  return ESP_OK;
}

int GetFrameNoConvert(RGB888Resp *resp) {
  *resp = GetRGB888();
  jpg_buffer buf;
  if (!resp->valid) {
    Cleanup(&buf, resp);
    return ESP_FAIL;
  }
  return ESP_OK;
}

int GetPoint(Point *p) {
  RGB888Resp resp;
  jpg_buffer jpg_buf;
  int res = GetFrameNoConvert(&resp);
  *p = DetectBrightPoint(&resp.image_matrix);
  Cleanup(&jpg_buf, &resp);
  return res;
}

int GetPoint(Point *p, int *w, int *h) {
  RGB888Resp resp;
  jpg_buffer jpg_buf;
  int res = GetFrameNoConvert(&resp);
  *p = DetectBrightPoint(&resp.image_matrix);
  *w = resp.fb->width;
  *h = resp.fb->height;
  Cleanup(&jpg_buf, &resp);
  return res;
}

int CountPoints(int *c){
  RGB888Resp resp;
  jpg_buffer jpg_buf;
  int res = GetFrameNoConvert(&resp);
  DetectBrightPoint(&resp.image_matrix,c);
  Cleanup(&jpg_buf, &resp);
  return res;
}

int NextFrame(){
  RGB888Resp resp;
  jpg_buffer jpg_buf;
  int res = GetFrameNoConvert(&resp);
  UpdateBackground(&resp.image_matrix);
  Cleanup(&jpg_buf, &resp);
  return res;
}