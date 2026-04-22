class Stimulus {
  final String id;
  final String category;
  final String en; // English
  final String kn; // Kannada
  final String ta; // Tamil
  final String te; // Telugu
  final String ml; // Malayalam
  final String imagePath;
  
  // Semantic Cues for each language
  final Map<String, String> semanticCues; 

  Stimulus({
    required this.id, 
    required this.category, 
    required this.en, 
    required this.kn, 
    required this.ta, 
    required this.te, 
    required this.ml,
    required this.imagePath, 
    required this.semanticCues,
  });
}
