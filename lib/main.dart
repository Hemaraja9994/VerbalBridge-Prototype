import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'screens/dashboard.dart';
import 'providers/aphasia_profile_provider.dart'; // Keep providers for state

void main() => runApp(
  MultiProvider(
    providers: [
      ChangeNotifierProvider(create: (_) => AphasiaProfileProvider()),
    ],
    child: const VerbalBridge(),
  ),
);

class VerbalBridge extends StatelessWidget {
  const VerbalBridge({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'VerbalBridge',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1A237E),
          primary: const Color(0xFF1A237E),   // Navy
          secondary: const Color(0xFFFF6D00), // Orange
        ),
        textTheme: GoogleFonts.interTextTheme(),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1A237E),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),
      home: const Dashboard(),
    );
  }
}
