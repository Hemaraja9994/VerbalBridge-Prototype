import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';

class CILTModuleScreen extends StatefulWidget {
  const CILTModuleScreen({super.key});

  @override
  State<CILTModuleScreen> createState() => _CILTModuleScreenState();
}

class _CILTModuleScreenState extends State<CILTModuleScreen> {
  bool _isRecording = false;

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF1A237E);

    return Scaffold(
      appBar: AppBar(
        title: const Text('CILT MODULE'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            const Text(
              'Constraint-Induced Language Therapy',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 10),
            const Text(
              'Forced verbal use only. No gestures or writing allowed.',
              style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold),
            ),
            const Spacer(),
            
            // Visual Stimulus Placeholder
            Container(
              height: 250,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: primaryColor.withOpacity(0.2)),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.image, size: 80, color: primaryColor.withOpacity(0.3)),
                  const SizedBox(height: 16),
                  const Text('Visual Stimulus: "Apple"', 
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500)),
                ],
              ),
            ),
            
            const Spacer(),
            
            if (_isRecording)
              const SpinKitWave(
                color: Colors.orange,
                size: 50.0,
              ),
            
            const SizedBox(height: 40),
            
            GestureDetector(
              onLongPressStart: (_) => setState(() => _isRecording = true),
              onLongPressEnd: (_) => setState(() => _isRecording = false),
              child: CircleAvatar(
                radius: 40,
                backgroundColor: _isRecording ? Colors.red : primaryColor,
                child: const Icon(Icons.mic, color: Colors.white, size: 40),
              ),
            ),
            const SizedBox(height: 16),
            const Text('Hold to Record Your Response', 
              style: TextStyle(color: Colors.grey)),
            
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
