import 'dart:convert';
import 'package:http/http.dart' as http;

class SarvamAIService {
  final String apiKey = "YOUR_SARVAM_KEY_HERE";
  final String baseUrl = "https://api.sarvam.ai";

  /// Bulbul v3 TTS with therapeutic rate control
  /// Defaults to 0.7x for Broca's patients (Regeneration philosophy)
  Future<Map<String, dynamic>> textToSpeech({
    required String text,
    required String langCode,
    double speechRate = 0.7,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/text-to-speech'),
      headers: {
        'api-subscription-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: jsonEncode({
        "inputs": [text],
        "target_language_code": langCode,
        "speaker": "meera", // Sarvam premium female voice
        "speech_rate": speechRate,
        "pitch": 0,
        "enable_preprocessing": true
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Sarvam TTS Error: ${response.body}");
    }
  }

  /// Saaras v3 STT in 'verbatim' mode
  /// Captures specific phonological errors crucial for aphasia diagnostics
  Future<String> speechToText({
    required String audioBase64,
    required String langCode,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/speech-to-text'),
      headers: {
        'api-subscription-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: jsonEncode({
        "audio": audioBase64,
        "language_code": langCode,
        "model": "saaras_v3",
        "task": "transcribe",
        "verbatim": true // Vital for error detection
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['transcript'] ?? "";
    } else {
      throw Exception("Sarvam STT Error: ${response.body}");
    }
  }
}
