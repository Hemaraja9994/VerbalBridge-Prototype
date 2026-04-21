import 'package:flutter/material.dart';
import '../models/aphasia_engine.dart';

class AssessmentScreen extends StatefulWidget {
  const AssessmentScreen({super.key});

  @override
  State<AssessmentScreen> createState() => _AssessmentScreenState();
}

class _AssessmentScreenState extends State<AssessmentScreen> {
  double f = 5, c = 5, r = 5, n = 5;

  @override
  Widget build(BuildContext context) {
    var result = AphasiaEngine.calculateAQ(f, c, r, n);
    const primaryColor = Color(0xFF1A237E);

    return Scaffold(
      appBar: AppBar(
        title: const Text("WAB-R Assessment", style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Expanded(
              child: ListView(
                children: [
                  _buildSlider("Fluency", f, (v) => setState(() => f = v)),
                  const SizedBox(height: 20),
                  _buildSlider("Comprehension", c, (v) => setState(() => c = v)),
                  const SizedBox(height: 20),
                  _buildSlider("Repetition", r, (v) => setState(() => r = v)),
                  const SizedBox(height: 20),
                  _buildSlider("Naming", n, (v) => setState(() => n = v)),
                ],
              ),
            ),
            const SizedBox(height: 30),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: primaryColor,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(color: primaryColor.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 5))
                ],
              ),
              child: Column(
                children: [
                  const Text("Calculated Clinical Result", style: TextStyle(color: Colors.white70, fontSize: 13)),
                  const SizedBox(height: 10),
                  Text(
                    "AQ Score: ${result['aq']}", 
                    style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)
                  ),
                  const SizedBox(height: 5),
                  Text(
                    result['type'].toString().toUpperCase(), 
                    style: const TextStyle(color: Colors.orange, fontSize: 18, fontWeight: FontWeight.bold, letterSpacing: 1.1)
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildSlider(String label, double val, Function(double) onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Text(val.toStringAsFixed(1), style: const TextStyle(color: Color(0xFF1A237E), fontWeight: FontWeight.bold)),
          ],
        ),
        Slider(
          value: val, 
          min: 0, 
          max: 10, 
          divisions: 100, 
          activeColor: const Color(0xFF1A237E),
          onChanged: onChanged
        ),
      ],
    );
  }
}
