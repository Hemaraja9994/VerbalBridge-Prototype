import 'package:flutter/material.dart';
import '../models/aphasia_engine.dart';

class AphasiaProfileProvider with ChangeNotifier {
  // WAB-R Sub-scores (0.0 - 10.0 scale)
  double fluency = 0.0;
  double comprehension = 0.0;
  double repetition = 0.0;
  double naming = 0.0;

  AphasiaResult get result => AphasiaEngine.calculateProfile(
    fluency: fluency,
    comprehension: comprehension,
    repetition: repetition,
    naming: naming,
  );

  double get aphasiaQuotient => result.aqScore;
  String get aphasiaTypeName => result.type.toString().split('.').last.toUpperCase();
  String get description => result.description;

  void updateScore(String category, double score) {
    if (score < 0) score = 0;
    if (score > 10) score = 10;
    
    switch (category) {
      case 'fluency': fluency = score; break;
      case 'comp': comprehension = score; break;
      case 'rep': repetition = score; break;
      case 'naming': naming = score; break;
    }
    notifyListeners();
  }
}
