#include "DFRobotDFPlayerMini.h" //https://github.com/DFRobot/DFRobotDFPlayerMini

DFRobotDFPlayerMini myDFPlayer;

void InitPlayer(){
  Serial1.begin(9600, SERIAL_8N1, -1, DRPLAYER_TX);
  myDFPlayer.begin(Serial1);
  Serial.printf("Audio began\n");
}

void PlayInfoSound(int i) {
  myDFPlayer.volume(8);
  myDFPlayer.playFolder(1, i);
  delay(2000);
  myDFPlayer.volume(30);
}

void playRandomFromFolder(int f, int count) {
  if (count <= 0) {
    Serial.printf("No files to play in %u directory\n", f);
    return;
  }
  int selected = random(1, count + 1);
  myDFPlayer.playFolder(f, selected);
}