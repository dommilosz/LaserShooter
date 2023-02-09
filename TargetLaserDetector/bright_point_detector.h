#pragma once
#include "NetworkStructs.h"

const int DIFF_TRESHOLD = 120;
const int MAX_DIFF_POINTS = 50;
const int DIFF_POINTS_TRESHOLD = 30;

uint8_t *background_buf = 0;
size_t background_buf_len = 0;


void UpdateBackground(fb_data_t *image_matrix) {
  int w = image_matrix->width;
  int h = image_matrix->height;
  int len = w * h * 3;
  uint8_t *buf = image_matrix->data;

  if (background_buf_len != len && background_buf) {
    free(background_buf);
    background_buf = 0;
  }

  if (!background_buf) {
    background_buf = new uint8_t[len];
    background_buf_len = len;
    memcpy(background_buf, buf, len);
  }
}

void UpdateBackgroundForce(fb_data_t *image_matrix){
  int w = image_matrix->width;
  int h = image_matrix->height;
  int len = w * h * 3;
  uint8_t *buf = image_matrix->data;

  UpdateBackground(image_matrix);
  for (int i = 0; i < len; i++) {
    background_buf[i] = (background_buf[i] * 4 + buf[i]) / 5;
  }
}

int pointsCountByDiff[1024];
Point DetectBrightPoint(fb_data_t *image_matrix, int *count = NULL) {
  int w = image_matrix->width;
  int h = image_matrix->height;
  int len = w * h * 3;
  uint8_t *buf = image_matrix->data;

  int maxDiff = -1;
  uint32_t maxDiffIndex = -1;

  for(int i=0;i<1024;i++){
    pointsCountByDiff[i] = 0;
  }

  Point p;
  p.found = false;
  UpdateBackground(image_matrix);

  uint8_t *data = buf;
  uint8_t *bgdata = background_buf;
  for (int i = 0; i < h; i+=2) {
    for (int j = 0; j < w; j+=2) {
      int idx = j*3 + i*3*w;
      data = buf+idx;
      bgdata = background_buf+idx;

      byte R = data[0];
      byte bR = bgdata[0];
      byte G = data[1];
      byte bG = bgdata[1];
      byte B = data[2];
      byte bB = bgdata[2];
      for (int b = 0; b < 3; b++) {
        bgdata[b] = (bgdata[b] * 4 + data[b]) / 5;
      }

      int sum = 2 * R + G + B;
      int bgsum = 2 * bR + bG + bB;
      int diff = sum - bgsum;
      if (diff > maxDiff) {
        maxDiffIndex = data - buf;
        maxDiff = diff;
        p.R = R;
        p.G = G;
        p.B = B;
        p.x = j;
        p.y = i;
      }
      pointsCountByDiff[diff/4]++;
    }
  }

  Serial.printf("Max diff: %u, Sum: %u\n", maxDiff, (p.R + p.G + p.B));
  if (maxDiff < DIFF_TRESHOLD) {
    return p;
  }

  int pointsSameRange = pointsCountByDiff[maxDiff/4];
  int points1BelowRange = pointsCountByDiff[(maxDiff/4)-1];
  int points1AboveRange = pointsCountByDiff[(maxDiff/4)+1];
  int sum = pointsSameRange+points1BelowRange+points1AboveRange;
  if (sum > MAX_DIFF_POINTS) {
    return p;
  }

  p.found = true;
  return p;
}