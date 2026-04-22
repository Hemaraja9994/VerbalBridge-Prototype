import '../models/stimulus_model.dart';

class StimuliRepo {
  static List<Stimulus> library = [
    // --- CATEGORY: DAILY NEEDS ---
    _s('n1', 'Needs', 'Water', 'ನೀರು', 'தண்ணீர்', 'నీరు', 'വെള്ളം', 'Drink this when thirsty'),
    _s('n2', 'Needs', 'Medicine', 'ಮಾತ್ರೆ', 'மருந்து', 'మందు', 'മരുന്ന്', 'Take this to feel better'),
    _s('n3', 'Needs', 'Specs', 'ಕನ್ನಡಕ', 'கண்ணாடி', 'కళ్లద్దాలు', 'കണ്ണട', 'Wear this to see clearly'),
    _s('n4', 'Needs', 'Soap', 'ಸೋಪು', 'சோப்பு', 'సబ్బు', 'സോപ്പ്', 'Use this to wash'),
    _s('n5', 'Needs', 'Brush', 'ಬ್ರಷ್', 'பல் துலக்கி', 'బ్రష్', 'ബ്രഷ്', 'Clean your teeth with this'),

    // --- CATEGORY: FOOD & KITCHEN ---
    _s('f1', 'Food', 'Plate', 'ತಟ್ಟೆ', 'தட்டு', 'కంచం', 'പ്ലേറ്റ്', 'Put food on this'),
    _s('f2', 'Food', 'Spoon', 'ಚಮಚ', 'ஸ்பூன்', 'చెంచా', 'സ്പൂൺ', 'Eat with this'),
    _s('f3', 'Food', 'Milk', 'ಹಾಲು', 'பால்', 'పాలు', 'പാൽ', 'White drink for health'),
    _s('f4', 'Food', 'Rice', 'ಅನ್ನ', 'சாதம்', 'అన్నం', 'ചോറ്', 'Main south Indian meal'),
    _s('f5', 'Food', 'Fruit', 'ಹಣ್ಣು', 'பழம்', 'పండు', 'പഴം', 'Sweet healthy snack'),

    // --- CATEGORY: HOME ITEMS ---
    _s('h1', 'Home', 'Fan', 'ಫ್ಯಾನ್', 'மின்விசிறி', 'ఫ్యాన్', 'ഫാൻ', 'Gives cool air'),
    _s('h2', 'Home', 'Light', 'ದೀಪ', 'விளக்கு', 'దీపం', 'വിളക്ക്', 'Lights up the room'),
    _s('h3', 'Home', 'Bed', 'ಹಾಸಿಗೆ', 'படுக்கை', 'మంచం', 'കിടക്ക', 'Sleep on this'),
    _s('h4', 'Home', 'Phone', 'ಫೋನ್', 'தொலைபேசி', 'ఫోన్', 'ഫോൺ', 'Call your family'),
    _s('h5', 'Home', 'TV', 'ಟಿವಿ', 'தொலைக்காட்சி', 'టీవీ', 'ടിവി', 'Watch news or movies'),

    // --- CATEGORY: BODY PARTS ---
    _s('b1', 'Body', 'Head', 'ತಲೆ', 'தலை', 'తల', 'തല', 'Top of your body'),
    _s('b2', 'Body', 'Hand', 'ಕೈ', 'கை', 'చెయ్యి', 'കൈ', 'Use this to hold things'),
    _s('b3', 'Body', 'Leg', 'ಕಾಲು', 'கால்', 'కాలు', 'Walk with these'),
    _s('b4', 'Body', 'Eye', 'ಕಣ್ಣು', 'கண்', 'కన్ను', 'See the world'),
    _s('b5', 'Body', 'Ear', 'ಕಿವಿ', 'காது', 'చెవి', 'Hear sounds'),

    // --- CATEGORY: ACTIONS (VERBS) ---
    _s('v1', 'Action', 'Eat', 'ತಿನ್ನು', 'சாப்பிடு', 'తిను', 'കഴിക്കുക', 'Putting food in mouth'),
    _s('v2', 'Action', 'Drink', 'ಕುಡಿ', 'குடி', 'త్రాగు', 'കുടിക്കുക', 'Swallowing liquid'),
    _s('v3', 'Action', 'Walk', 'ನಡೆ', 'நட', 'నడు', 'നടക്കുക', 'Moving with your legs'),
    _s('v4', 'Action', 'Sleep', 'ಮಲಗು', 'தூங்கு', 'పడుకో', 'ഉറങ്ങുക', 'Resting at night'),
    _s('v5', 'Action', 'Talk', 'ಮಾತನಾಡು', 'பேசு', 'మాట్లాడు', 'Using your voice'),
  ];

  // Helper function to keep the list clean and easy to expand
  static Stimulus _s(String id, String cat, String en, String kn, String ta, String te, String ml, String cue) {
    return Stimulus(
      id: id,
      category: cat,
      en: en, kn: kn, ta: ta, te: te, ml: ml,
      imagePath: 'https://source.unsplash.com/400x400/?$en',
      semanticCues: {
        'en': cue,
        'kn': 'ಇದರ ಬಗ್ಗೆ ಯೋಚಿಸಿ...', // Default Kannada cue
        'ta': 'இதைப் பற்றி யோசி...', // Default Tamil
        'te': 'దీని గురించి ఆలోచించండి...', // Default Telugu
        'ml': 'ഇതിനെക്കുറിച്ച് ചിന്തിക്കുക...', // Default Malayalam
      },
    );
  }
}
