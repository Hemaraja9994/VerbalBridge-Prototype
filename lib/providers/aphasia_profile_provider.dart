import 'package:flutter/material.dart';

class AphasiaProfileProvider with ChangeNotifier {
  double _aqScore = 0.0;
  String _activeLanguage = 'kn'; // Default to Kannada

  double get aqScore => _aqScore;
  String get activeLanguage => _activeLanguage;

  // Update the AQ Score from assessment
  void updateScore(double score) {
    _aqScore = score;
    notifyListeners();
  }

  // Change the app language (KN, TA, TE, ML, EN)
  void setLanguage(String langCode) {
    _activeLanguage = langCode;
    notifyListeners(); // This refreshes the UI instantly
  }
}
