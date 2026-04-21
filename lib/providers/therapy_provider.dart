import 'package:flutter/material.dart';

class TherapyProvider with ChangeNotifier {
  bool isTraining = false;
  int dailyStreak = 3;
  
  void startSession() {
    isTraining = true;
    notifyListeners();
  }

  void endSession() {
    isTraining = false;
    notifyListeners();
  }
}
