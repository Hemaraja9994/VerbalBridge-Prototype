import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/aphasia_profile_provider.dart';

class AphasiaProfileScreen extends StatelessWidget {
  const AphasiaProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('APHASIA PROFILE'),
      ),
      body: Consumer<AphasiaProfileProvider>(
        builder: (context, provider, child) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildSummaryCard(provider),
                const SizedBox(height: 24),
                const Text('Assessment Categories', 
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                
                _buildAssessmentTile('Fluency', 'Score: ${provider.fluency}/10', Icons.forum, provider.fluency > 0),
                _buildAssessmentTile('Auditory Comprehension', 'Score: ${provider.comprehension}/10', Icons.hearing, provider.comprehension > 0),
                _buildAssessmentTile('Repetition', 'Score: ${provider.repetition}/10', Icons.repeat, provider.repetition > 0),
                _buildAssessmentTile('Naming & Word Finding', 'Score: ${provider.naming}/10', Icons.category, provider.naming > 0),
                
                const SizedBox(height: 30),
                Center(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      // Demo: Update some scores to see engine in action
                      provider.updateScore('fluency', 3.0);
                      provider.updateScore('comp', 7.5);
                      provider.updateScore('rep', 4.0);
                      provider.updateScore('naming', 5.0);
                    }, 
                    icon: const Icon(Icons.play_circle_fill),
                    label: const Text('RUN CLINICAL ANALYSIS'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF6D00),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ),
              ],
            ),
          );
        }
      ),
    );
  }

  Widget _buildSummaryCard(AphasiaProfileProvider provider) {
    return Card(
      color: const Color(0xFF1A237E),
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'WAB-R Analysis',
                      style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      'Clinical Taxonomy Engine',
                      style: TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    provider.severity.toUpperCase(),
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 10),
                  ),
                )
              ],
            ),
            const Divider(color: Colors.white24, height: 30),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatItem('AQ Score', provider.aphasiaQuotient.toStringAsFixed(1)),
                _buildStatItem('Classification', provider.aphasiaType),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 12)),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildAssessmentTile(String title, String subtitle, IconData icon, bool isComplete) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Icon(icon, color: const Color(0xFF1A237E)),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle),
        trailing: isComplete 
          ? const Icon(Icons.check_circle, color: Colors.green)
          : const Text('Pending', style: TextStyle(color: Colors.orange, fontWeight: FontWeight.bold)),
      ),
    );
  }
}
