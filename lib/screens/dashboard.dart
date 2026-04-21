import 'package:flutter/material.dart';
import 'assessment_screen.dart';
import 'cilt_screen.dart';

class Dashboard extends StatelessWidget {
  const Dashboard({super.key});

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF1A237E);

    return Scaffold(
      appBar: AppBar(
        title: const Text("VERBALBRIDGE", style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.5)),
        centerTitle: true,
      ),
      body: Column(
        children: [
          _buildHeader(),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(20),
              children: [
                _navCard(
                  context, 
                  "Aphasia Profile", 
                  "Clinical Assessment & WAB-R Scoring", 
                  const AssessmentScreen(), 
                  Icons.analytics_rounded
                ),
                const SizedBox(height: 15),
                _navCard(
                  context, 
                  "Speech Regeneration", 
                  "CILT Verbatim Module", 
                  const CiltScreen(), 
                  Icons.record_voice_over_rounded
                ),
                const SizedBox(height: 15),
                _navCard(
                  context, 
                  "Adaptive Cueing", 
                  "Semantic Hierarchy Module", 
                  const CiltScreen(), // Placeholder for Cueing
                  Icons.psychology_rounded
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
      decoration: const BoxDecoration(
        color: Color(0xFF1A237E),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Welcome Back,", style: TextStyle(color: Colors.white70, fontSize: 16)),
          SizedBox(height: 5),
          Text("Clinician Portal", style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _navCard(BuildContext context, String title, String sub, Widget target, IconData icon) {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: const Color(0xFF1A237E).withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: const Color(0xFF1A237E)),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        subtitle: Text(sub, style: const TextStyle(fontSize: 14)),
        trailing: const Icon(Icons.chevron_right, color: Colors.orange),
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => target)),
      ),
    );
  }
}
