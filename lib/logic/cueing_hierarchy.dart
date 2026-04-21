import '../services/sarvam_ai.dart';

enum CueLevel { semantic, phonological, restoration, completed }

class CueingController {
  final SarvamAIService _sarvam = SarvamAIService();
  
  CueLevel currentLevel = CueLevel.semantic;
  final String targetWord;
  final String langCode;

  CueingController({required this.targetWord, required this.langCode});

  /// Executes the logic for the current failure level
  /// Based on Regeneration vs. Compensation philosophy
  Future<void> triggerNextCue() async {
    switch (currentLevel) {
      case CueLevel.semantic:
        // Level 1: Semantic - Descriptive clue via Bhashini placeholder
        await _provideSemanticClue();
        currentLevel = CueLevel.phonological;
        break;
      
      case CueLevel.phonological:
        // Level 2: Phonological - Play only first phoneme (e.g. 'W...')
        final phoneme = targetWord.substring(0, 1);
        await _sarvam.textToSpeech(text: "$phoneme...", langCode: langCode, speechRate: 0.5);
        currentLevel = CueLevel.restoration;
        break;
      
      case CueLevel.restoration:
        // Level 3: Restoration - Full restoration of the phonemic pathway
        await _sarvam.textToSpeech(text: targetWord, langCode: langCode, speechRate: 0.7);
        currentLevel = CueLevel.completed;
        break;
      
      case CueLevel.completed:
        break;
    }
  }

  Future<void> _provideSemanticClue() async {
    // Logic to fetch descriptive clue from Bhashini or local mapping
    // e.g. "You use this to drink" for "Water"
    print("Providing semantic description for $targetWord");
  }
}
