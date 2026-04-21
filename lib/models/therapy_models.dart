class ClinicalItem {
  final String id;
  final String targetEn;
  final String targetKn;
  final String imageUrl;
  final Map<String, Map<String, String>> cues;

  const ClinicalItem({
    required this.id,
    required this.targetEn,
    required this.targetKn,
    required this.imageUrl,
    required this.cues,
  });

  String targetFor(String lang) => lang == 'kn' ? targetKn : targetEn;

  String cueFor({required String lang, required int level}) {
    final l = cues[lang] ?? cues['en']!;
    switch (level) {
      case 1:  return l['level_1_semantic'] ?? '';
      case 2:  return l['level_2_phonological'] ?? '';
      case 3:  return l['level_3_restoration'] ?? '';
      default: return '';
    }
  }

  factory ClinicalItem.fromJson(Map<String, dynamic> json) {
    return ClinicalItem(
      id: json['id'],
      targetEn: json['target_en'],
      targetKn: json['target_kn'],
      imageUrl: json['image_url'],
      cues: Map<String, Map<String, String>>.from(
        (json['cues'] as Map).map((lang, levels) => MapEntry(lang, Map<String, String>.from(levels))),
      ),
    );
  }
}

class ClinicalCategory {
  final String id;
  final String name;
  final List<ClinicalItem> items;

  const ClinicalCategory({required this.id, required this.name, required this.items});

  factory ClinicalCategory.fromJson(Map<String, dynamic> json) {
    return ClinicalCategory(
      id: json['id'],
      name: json['name'],
      items: (json['items'] as List).map((i) => ClinicalItem.fromJson(i)).toList(),
    );
  }
}
