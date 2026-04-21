import 'package:flutter/material.dart';

class AdaptiveCueingScreen extends StatefulWidget {
  const AdaptiveCueingScreen({super.key});

  @override
  State<AdaptiveCueingScreen> createState() => _AdaptiveCueingScreenState();
}

class _AdaptiveCueingScreenState extends State<AdaptiveCueingScreen> {
  int _currentLevel = 0;
  final List<String> _cues = [
    'Semantic Cue: "It is a fruit that is red and round."',
    'Lead-in Cue: "Please take a bite of this..."',
    'Phonemic Cue: "Starts with /a/..."',
    'Direct Imitation: "Say Apple."'
  ];

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF1A237E);

    return Scaffold(
      appBar: AppBar(
        title: const Text('ADAPTIVE CUEING'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            const Text(
              'Hierarchical Cueing Logic',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            
            // Progress tracker
            Row(
              children: List.generate(4, (index) => Expanded(
                child: Container(
                  height: 8,
                  margin: const EdgeInsets.symmetric(horizontal: 2),
                  decoration: BoxDecoration(
                    color: index <= _currentLevel ? Colors.orange : Colors.grey[300],
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              )),
            ),
            const SizedBox(height: 40),
            
            Expanded(
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(30),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    )
                  ],
                  border: Border.all(color: primaryColor.withOpacity(0.1)),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.lightbulb_outline, size: 60, color: Colors.orange),
                    const SizedBox(height: 24),
                    Text(
                      _cues[_currentLevel],
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w500),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 40),
            
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _currentLevel > 0 ? () => setState(() => _currentLevel--) : null,
                    style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                    child: const Text('Back'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _currentLevel < 3 ? () => setState(() => _currentLevel++) : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: const Text('Next Cue'),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 20),
            TextButton(
              onPressed: () {}, 
              child: const Text('Success - Mark as Correct', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold))
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
