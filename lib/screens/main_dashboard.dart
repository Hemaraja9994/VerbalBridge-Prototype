import 'package:flutter/material.dart';
import 'assessment_screen.dart';
import 'cilt_module_screen.dart';
import 'adaptive_cueing_screen.dart';
import 'aphasia_profile_screen.dart';

class MainDashboard extends StatelessWidget {
  const MainDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF1A237E);

    return Scaffold(
      appBar: AppBar(
        title: const Text('VERBALBRIDGE'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Patient Dashboard',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: primaryColor),
            ),
            const SizedBox(height: 8),
            const Text('AI-Based Adaptive Speech Regeneration', 
              style: TextStyle(color: Colors.grey, fontSize: 16)),
            const SizedBox(height: 30),
            
            Expanded(
              child: GridView.count(
                crossAxisCount: 1,
                childAspectRatio: 3.5,
                mainAxisSpacing: 16,
                children: [
                  _buildModuleCard(
                    context, 
                    'Aphasia Profile', 
                    'WAB-R Assessment & Scoring', 
                    Icons.assignment_ind,
                    () => Navigator.push(
                      context, 
                      MaterialPageRoute(builder: (context) => const AssessmentScreen())
                    )
                  ),
                  _buildModuleCard(
                    context, 
                    'CILT Module', 
                    'Constraint-Induced Therapy', 
                    Icons.record_voice_over,
                    () => Navigator.push(
                      context, 
                      MaterialPageRoute(builder: (context) => const CILTModuleScreen())
                    )
                  ),
                  _buildModuleCard(
                    context, 
                    'Adaptive Cueing', 
                    'Semantic-Phonological Hierarchy', 
                    Icons.psychology,
                    () => Navigator.push(
                      context, 
                      MaterialPageRoute(builder: (context) => const AdaptiveCueingScreen())
                    )
                  ),
                ],
              ),
            ),
            
            // AI Clinical Insight Placeholder
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: primaryColor.withOpacity(0.05),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: primaryColor.withOpacity(0.1)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.auto_awesome, color: primaryColor),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Text(
                      'AI Insight: Patient shows consistent progress in naming tasks. Recommended focus: Semantic Cueing.',
                      style: TextStyle(fontSize: 13, fontStyle: FontStyle.italic),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildModuleCard(BuildContext context, String title, String subtitle, IconData icon, VoidCallback onTap) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        leading: CircleAvatar(
          backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.1),
          child: Icon(icon, color: Theme.of(context).colorScheme.primary),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }
}
