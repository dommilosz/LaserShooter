#define IDPacket_ID 0
#define IDShotPacket_ID 1

#define PointPacket_ID (0 + 256)
#define KeepAlivePacket_ID (1 + 256)

struct IDPacket {
  int pktype = IDPacket_ID;
  int clientId;
};

struct IDShotPacket{
  int pktype = IDShotPacket_ID;
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
  int pktype = PointPacket_ID;
  IDPacket idPacket;
  int w, h;
  int score;
  Point p;
};

struct KeepAlivePacket {
  int pktype = KeepAlivePacket_ID;
  int n;
};