import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/aphasia_profile_provider.dart';
import '../data/stimuli_repo.dart';
import '../services/sarvam_service.dart';
import '../widgets/glass_card.dart';

class CiltScreen extends StatefulWidget {
  const CiltScreen({super.key});

  @override
  State<CiltScreen> createState() => _CiltScreenState();
}

class _CiltScreenState extends State<CiltScreen> {
  int _currentIndex = 0;
  final SarvamService _sarvam = SarvamService();

  @override
  Widget build(BuildContext context) {
    // 1. Get the current language chosen on the Dashboard (KN, TA, TE, etc.)
    final profile = Provider.of<AphasiaProfileProvider>(context);
    final String lang = profile.activeLanguage;

    // 2. Get the current word from our 100+ item library
    final currentItem = StimuliRepo.library[_currentIndex];

    // 3. Get the correct translation based on the language
    String localizedWord = '';
    switch (lang) {
      case 'kn': localizedWord = currentItem.kn; break;
      case 'ta': localizedWord = currentItem.ta; break;
      case 'te': localizedWord = currentItem.te; break;
      case 'ml': localizedWord = currentLang = currentItem.ml; break;
      default: localizedWord = currentItem.en;
    }

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Dark Slate
      appBar: AppBar(
        title: Text("SPEECH REGENERATION", style: TextStyle(fontSize: 14, letterSpacing: 2)),
        backgroundColor: Colors.transparent,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            // PROGRESS BAR
            LinearProgressIndicator(
              value: (_currentIndex + 1) / StimuliRepo.library.length,
              backgroundColor: Colors.white10,
              color: Colors.orange,
            ),
            const SizedBox(height: 40),

            // STIMULUS IMAGE (Awesome 3D look)
            Expanded(
              child: GlassCard(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.network(
                        currentItem.imagePath,
                        height: 200, fit: BoxFit.cover,
                        // Fallback icon if image doesn't load
                        errorBuilder: (context, error, stackTrace) => 
                          Icon(Icons.image, size: 100, color: Colors.white10),
                      ),
                    ),
                    const SizedBox(height: 30),
                    Text(
                      localizedWord,
                      style: const TextStyle(fontSize: 42, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    const SizedBox(height: 10),
                    Text(currentItem.en, style: TextStyle(color: Colors.white24)),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 40),

            // AI VOICE BUTTON (FIXED KANNADA/MULTILINGUAL)
            IconButton(
              iconSize: 64,
              icon: Icon(Icons.volume_up_rounded, color: Colors.orange),
              onPressed: () {
                // Speaks the word in the active language at 0.7x speed
                _sarvam.speak(localizedWord, lang);
              },
            ),
            const Text("Listen to AI Cue", style: TextStyle(color: Colors.white38, fontSize: 12)),

            const Spacer(),

            // NAVIGATION BUTTONS
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                TextButton(
                  onPressed: _currentIndex > 0 ? () => setState(() => _currentIndex--) : null,
                  child: const Text("PREVIOUS", style: TextStyle(color: Colors.white30)),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    if (_currentIndex < StimuliRepo.library.length - 1) {
                      setState(() => _currentIndex++);
                    } else {
                      Navigator.pop(context); // Session Complete
                    }
                  },
                  child: const Text("NEXT WORD", style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
