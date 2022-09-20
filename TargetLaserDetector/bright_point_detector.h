#pragma once

struct Point {
  int x;
  int y;
  byte R, G, B;
  bool found;
};

Point DetectBrightPoint(dl_matrix3du_t *image_matrix) {
  int w = image_matrix->w;
  int h = image_matrix->h;
  int len = w * h * 3;
  uint8_t *buf = image_matrix->item;

  int maxSum = -1;
  uint32_t maxSumIndex = -1;

  Point p;

  long totalSum = 0;
  uint8_t *data = buf;
  for (int i = 0; i < h; i++) {
    for (int j = 0; j < w; j++) {
      byte R = data[0];
      byte G = data[1];
      byte B = data[2];

      int sum = R + G + B;
      totalSum += sum;
      if (sum > maxSum) {
        maxSumIndex = data - buf;
        maxSum = sum;
        p.R = R;
        p.G = G;
        p.B = B;
        p.x = j;
        p.y = i;
      }
      data += 3;
    }
  }

  int avg = totalSum / (w * h);
  p.found = (p.R + p.G + p.B) > (avg + 150);
  return p;
}