#pragma once

struct Point {
  int x;
  int y;
  byte R, G, B;
  bool found;
};

const int DIFF_TRESHOLD = 80;
const int MAX_DIFF_POINTS = 50;

uint8_t *background_buf = 0;
size_t background_buf_len = 0;

bool checkPointValid(fb_data_t *image_matrix, int maxDiff, int *count = NULL) {
  int w = image_matrix->width;
  int h = image_matrix->height;
  int len = w * h * 3;
  uint8_t *buf = image_matrix->data;

  int aboveDiffPoints = 0;

  uint8_t *data = buf;
  uint8_t *bgdata = background_buf;
  for (int i = 0; i < h; i++) {
    for (int j = 0; j < w; j++) {
      byte R = data[0];
      byte bR = bgdata[0];
      byte G = data[1];
      byte bG = bgdata[1];
      byte B = data[2];
      byte bB = bgdata[2];

      int sum = R + G + B;
      int bgsum = bR + bG + bB;
      int diff = sum - bgsum;

      if (maxDiff - diff < 20) {
        aboveDiffPoints++;
      }
      data += 3;
      bgdata += 3;
    }
  }

  if (count)
    *count = aboveDiffPoints;
  Serial.printf("Above avg points: %u\n", aboveDiffPoints);
  return aboveDiffPoints <= MAX_DIFF_POINTS;
}


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

  for (int i = 0; i < len; i++) {
    background_buf[i] = (background_buf[i] * 4 + buf[i]) / 5;
  }
}

Point DetectBrightPoint(fb_data_t *image_matrix, int *count = NULL) {
  int w = image_matrix->width;
  int h = image_matrix->height;
  int len = w * h * 3;
  uint8_t *buf = image_matrix->data;

  int maxDiff = -1;
  uint32_t maxDiffIndex = -1;

  Point p;
  p.found = false;
  UpdateBackground(image_matrix);

  uint8_t *data = buf;
  uint8_t *bgdata = background_buf;
  for (int i = 0; i < h; i++) {
    for (int j = 0; j < w; j++) {
      byte R = data[0];
      byte bR = bgdata[0];
      byte G = data[1];
      byte bG = bgdata[1];
      byte B = data[2];
      byte bB = bgdata[2];

      int sum = R + G + B;
      int bgsum = bR + bG + bB;
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
      data += 3;
      bgdata += 3;
    }
  }

  Serial.printf("Max diff: %u, Sum: %u\n", maxDiff, (p.R + p.G + p.B));
  if (maxDiff < DIFF_TRESHOLD) {
    return p;
  }

  if (!checkPointValid(image_matrix, maxDiff, count)) {
    return p;
  }

  p.found = true;
  return p;
}