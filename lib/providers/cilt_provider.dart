import 'package:flutter/material.dart';

class CILTTask {
  final String targetWord;
  final String imageUrl;
  bool isCompleted = false;

  CILTTask({required this.targetWord, required this.imageUrl});
}

class CILTProvider extends ChangeNotifier {
  final List<CILTTask> _tasks = [
    CILTTask(targetWord: 'Water', imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400'),
    CILTTask(targetWord: 'Medicine', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'),
    // These would be localized in KN, HI, EN as per Page 2
  ];

  int _currentIndex = 0;
  bool _isListening = false;
  
  CILTTask get currentTask => _tasks[_currentIndex];
  bool get isListening => _isListening;
  int get currentIndex => _currentIndex;
  int get totalTasks => _tasks.length;

  void startListening() {
    _isListening = true;
    notifyListeners();
  }

  void stopAndCheck(String recognizedText) {
    _isListening = false;
    if (recognizedText.toLowerCase().contains(currentTask.targetWord.toLowerCase())) {
      currentTask.isCompleted = true;
      _nextTask();
    }
    notifyListeners();
  }

  void _nextTask() {
    if (_currentIndex < _tasks.length - 1) {
      _currentIndex++;
    }
  }

  void reset() {
    _currentIndex = 0;
    for (var task in _tasks) {
      task.isCompleted = false;
    }
    notifyListeners();
  }
}
