import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/aphasia_profile_provider.dart';
import '../widgets/glass_card.dart';
import 'assessment_screen.dart';
import 'cilt_screen.dart';

class Dashboard extends StatelessWidget {
  const Dashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final profile = Provider.of<AphasiaProfileProvider>(context);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeader(),
                const SizedBox(height: 24),
                
                // LANGUAGE TOGGLE
                const Text("SELECT MOTHER TONGUE", 
                  style: TextStyle(color: Colors.white30, fontSize: 10, letterSpacing: 2)),
                const SizedBox(height: 12),
                _buildLanguageToggle(profile),
                
                const SizedBox(height: 32),
                
                // RECENT PROGRESS
                _buildAQSummary(profile),
                
                const SizedBox(height: 40),
                const Text("THERAPY CATEGORIES", 
                  style: TextStyle(color: Colors.white30, fontSize: 10, letterSpacing: 2)),
                const SizedBox(height: 16),

                // CATEGORY CARDS
                _categoryCard(context, "Daily Needs", "Water, Food, Medicine", Icons.medical_services_rounded),
                _categoryCard(context, "Home Items", "Fan, Bed, Phone", Icons.home_rounded),
                _categoryCard(context, "Action Verbs", "Eat, Drink, Walk", Icons.directions_run_rounded),
                _categoryCard(context, "Family", "Son, Daughter, Doctor", Icons.people_rounded),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("VERBALBRIDGE", 
          style: GoogleFonts.outfit(fontSize: 26, fontWeight: FontWeight.w900, color: Colors.white)),
        Text("Adaptive Neuro-Regeneration", 
          style: TextStyle(color: Colors.white.withOpacity(0.5))),
      ],
    );
  }

  Widget _buildLanguageToggle(AphasiaProfileProvider profile) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _langBtn(profile, "KN", "kn"),
        _langBtn(profile, "TA", "ta"),
        _langBtn(profile, "TE", "te"),
        _langBtn(profile, "ML", "ml"),
        _langBtn(profile, "EN", "en"),
      ],
    );
  }

  Widget _langBtn(AphasiaProfileProvider profile, String label, String code) {
    bool isActive = profile.activeLanguage == code;
    return GestureDetector(
      onTap: () => profile.setLanguage(code),
      child: Container(
        width: 50, height: 50,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: isActive ? const Color(0xFFF59E0B) : Colors.white.withOpacity(0.05),
          shape: BoxShape.circle,
          border: Border.all(color: isActive ? Colors.white : Colors.white10),
        ),
        child: Text(label, style: TextStyle(
          color: isActive ? Colors.black : Colors.white, 
          fontWeight: FontWeight.bold, fontSize: 12)),
      ),
    );
  }

  Widget _buildAQSummary(AphasiaProfileProvider profile) {
    return GlassCard(
      title: "Latest AQ Score",
      subtitle: profile.aqScore > 0 ? "Level: Broca's" : "Assessment Required",
      icon: Icons.speed_rounded,
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AssessmentScreen())),
    );
  }

  Widget _categoryCard(BuildContext context, String title, String sub, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GlassCard(
        title: title,
        subtitle: sub,
        icon: icon,
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CiltScreen())),
      ),
    );
  }
}
