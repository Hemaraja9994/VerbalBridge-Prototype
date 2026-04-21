import 'package:flutter/material.dart';
import '../widgets/clinical_card.dart';
import 'assessment_screen.dart';
import 'cilt_screen.dart';
import 'cueing_screen.dart';

class Dashboard extends StatelessWidget {
  const Dashboard({super.key});

  @override
  Widget build(BuildContext context) {
    const navy = Color(0xFF1A237E);
    const orange = Color(0xFFFF6D00);

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: SafeArea(
        child: Column(
          children: [
            // Clinical Header
            Container(
              padding: const EdgeInsets.all(32),
              decoration: const BoxDecoration(
                color: navy,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(40),
                  bottomRight: Radius.circular(40),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "VerbalBridge",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -1,
                            ),
                          ),
                          Text(
                            "Neural Regeneration Pilot",
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        onPressed: () {
                          // TODO: Implement Sarvam TTS Audio Introduction
                        },
                        icon: const Icon(Icons.help_outline, color: orange, size: 32),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Modules
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(24),
                children: [
                  const Text(
                    "CLINICAL MODULES",
                    style: TextStyle(
                      color: navy,
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 20),
                  ClinicalCard(
                    title: "Phase 1: Diagnosis",
                    subtitle: "WAB-R Assessment & AQ Profiling",
                    icon: Icons.analytics_rounded,
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AssessmentScreen())),
                  ),
                  const SizedBox(height: 16),
                  ClinicalCard(
                    title: "Phase 2: Regen",
                    subtitle: "CILT Intensive Visual Trials",
                    icon: Icons.record_voice_over,
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CiltScreen())),
                  ),
                  const SizedBox(height: 16),
                  ClinicalCard(
                    title: "Phase 3: Adaptive",
                    subtitle: "Semantic Hierarchy Cueing",
                    icon: Icons.psychology,
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CueingScreen())),
                  ),
                  const SizedBox(height: 32),
                  
                  // Diagnostic Insights
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: orange.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: orange.withOpacity(0.2)),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.auto_awesome, color: orange),
                        SizedBox(width: 16),
                        Expanded(
                          child: Text(
                            "System ready for baseline assessment. Select Phase 1 to begin.",
                            style: TextStyle(
                              color: navy,
                              fontWeight: FontWeight.w600,
                              height: 1.4,
                            ),
                          ),
                        ),
                      ],
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
}
