#pragma once

struct Point {
  int x;
  int y;
  byte R, G, B;
  bool found;
};

const int AVG_TRESHOLD = 150;
const int MAX_ABOVE_AVG_POINTS = 50;

bool checkPointValid(fb_data_t *image_matrix, int avg) {
  int w = image_matrix->width;
  int h = image_matrix->height;
  int len = w * h * 3;
  uint8_t *buf = image_matrix->data;

  int aboveAvgPoints = 0;

  uint8_t *data = buf;
  for (int i = 0; i < h; i++) {
    for (int j = 0; j < w; j++) {
      byte R = data[0];
      byte G = data[1];
      byte B = data[2];

      if ((R + G + B) >= (avg + AVG_TRESHOLD)) {
        aboveAvgPoints++;
      }
      data += 3;
    }
  }

  Serial.printf("Above avg points: %u\n",aboveAvgPoints);
  return aboveAvgPoints <= MAX_ABOVE_AVG_POINTS;
}

Point DetectBrightPoint(fb_data_t *image_matrix) {
  int w = image_matrix->width;
  int h = image_matrix->height;
  int len = w * h * 3;
  uint8_t *buf = image_matrix->data;

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
  p.found = false;
  
  Serial.printf("Point average: %u. Current value: %u\n",avg,(p.R+p.G+p.B));
  if ((p.R + p.G + p.B) < (avg + AVG_TRESHOLD)) {
    return p;
  }

  if (!checkPointValid(image_matrix, avg)) {
    return p;
  }

  p.found = true;
  return p;
}