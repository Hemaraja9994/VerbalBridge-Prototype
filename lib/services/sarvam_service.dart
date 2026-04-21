import 'dart:convert';
import 'package:http/http.dart' as http;

class SarvamService {
  final String apiKey = "YOUR_API_KEY"; // Placeholder for Clinical Deployment

  /// Bulbul TTS with therapeutic speed control (0.7x recommended for Broca's)
  Future<void> playSlowTTS(String text, String lang) async {
    try {
      final response = await http.post(
        Uri.parse('https://api.sarvam.ai/text-to-speech'),
        headers: {
          'api-subscription-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: jsonEncode({
          "inputs": [text],
          "target_language_code": lang,
          "speaker": "meera",
          "speech_rate": 0.7, 
        }),
      );
      
      if (response.statusCode == 200) {
        // Logic for audio playback via audioplayers would go here
      }
    } catch (e) {
      print("Sarvam Service Error: $e");
    }
  }
}
