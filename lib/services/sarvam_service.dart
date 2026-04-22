import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:audioplayers/audioplayers.dart';

class SarvamService {
  final AudioPlayer _audioPlayer = AudioPlayer();
  final String apiKey = "YOUR_SARVAM_API_KEY"; // Replace with your actual key

  Future<void> speak(String text, String langCode) async {
    // Correct mapping for South Indian Languages
    String sarvamLang;
    switch (langCode) {
      case 'kn': sarvamLang = 'kn-IN'; break;
      case 'ta': sarvamLang = 'ta-IN'; break;
      case 'te': sarvamLang = 'te-IN'; break;
      case 'ml': sarvamLang = 'ml-IN'; break;
      default: sarvamLang = 'en-IN';
    }

    final response = await http.post(
      Uri.parse('https://api.sarvam.ai/text-to-speech'),
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey, // Critical fix for header
      },
      body: jsonEncode({
        "inputs": [text],
        "target_language_code": sarvamLang,
        "speaker": "meera",
        "speech_rate": 0.7, // Slowed for Aphasia recovery
        "pitch": 0,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      String audioUrl = data['audios'][0]; // Assumes API returns a URL
      await _audioPlayer.play(UrlSource(audioUrl));
    }
  }
}
