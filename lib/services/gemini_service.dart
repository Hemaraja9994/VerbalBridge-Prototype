import 'dart:convert';
import 'package:http/http.dart' as http;

class GeminiLiveService {
  final String apiKey = "YOUR_GEMINI_KEY_HERE";
  final String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  /// Simulates the AI Conversation Partner for CILT sessions
  /// Maintains a constraint-induced environment (no gestures, only verbal)
  Future<String> getClinicalResponse({
    required String patientSpeech,
    required String currentTask,
  }) async {
    final systemPrompt = """
      You are a clinical AI partner for a patient with Aphasia in a CILT (Constraint-Induced Language Therapy) session.
      Environment: No gestures, no writing, only verbal communication allowed.
      Target Task: $currentTask.
      Patient Input: $patientSpeech.
      Your Goal: Encourage verbal output. If the patient struggles, provide subtle cues. 
      Keep your responses simple, clear, and clinically supportive.
    """;

    final response = await http.post(
      Uri.parse('$endpoint?key=$apiKey'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        "contents": [{
          "parts": [{"text": "$systemPrompt\nPatient said: $patientSpeech"}]
        }]
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['candidates'][0]['content']['parts'][0]['text'];
    } else {
      throw Exception("Gemini Service Error: ${response.body}");
    }
  }
}
