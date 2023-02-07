struct IDPacket {
  int clientId;
  int shotId;
};

struct Point {
  int x;
  int y;
  byte R, G, B;
  bool found;
};

struct PointPacket {
  int pktype = 0;
  IDPacket idPacket;
  int w, h;
  int score;
  Point p;
};

struct KeepAlivePacket {
  int pktype = 1;
  int n;
};

struct NullPacket {
  int pktype;
};