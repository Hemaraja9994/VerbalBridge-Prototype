import 'package:flutter/material.dart';

class CiltScreen extends StatelessWidget {
  const CiltScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF1A237E);

    return Scaffold(
      appBar: AppBar(title: const Text("CILT Regeneration", style: TextStyle(fontWeight: FontWeight.bold))),
      body: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 30),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Clinical Stimulus Card
            Container(
              height: 240,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(25),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 10))
                ],
                border: Border.all(color: primaryColor.withOpacity(0.1)),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.waves_rounded, size: 100, color: primaryColor.withOpacity(0.2)),
                  const SizedBox(height: 10),
                  const Text("Visual Stimulus: WATER", style: TextStyle(color: Colors.grey, fontSize: 13, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            const SizedBox(height: 40),
            const Text(
              "Instruction: Say the word", 
              style: TextStyle(fontSize: 16, color: Colors.grey)
            ),
            const SizedBox(height: 5),
            const Text(
              "'WATER'", 
              style: TextStyle(fontSize: 42, fontWeight: FontWeight.bold, color: primaryColor)
            ),
            const SizedBox(height: 60),
            
            // Interaction Buttons
            ElevatedButton.icon(
              onPressed: () {}, // Trigger Sarvam STT Verbatim Mode
              icon: const Icon(Icons.mic_rounded, size: 32),
              label: const Text("TAP TO RECORD", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 22),
                backgroundColor: Colors.orange,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                elevation: 5,
              ),
            ),
            const SizedBox(height: 20),
            TextButton.icon(
              onPressed: () {}, // Trigger 0.7x Bulbul TTS
              icon: const Icon(Icons.volume_up_rounded, size: 20),
              label: const Text("Need help? (Slow Audio Cue)", style: TextStyle(fontWeight: FontWeight.bold)),
              style: TextButton.styleFrom(foregroundColor: primaryColor),
            )
          ],
        ),
      ),
    );
  }
}
