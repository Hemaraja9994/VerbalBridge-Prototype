import '../models/stimulus_model.dart';

class StimuliRepo {
  static List<Stimulus> library = [
    // --- 1. BASIC NEEDS & HYGIENE ---
    _s('n1', 'Needs', 'Water', 'ನೀರು', 'தண்ணீர்', 'నీరు', 'വെള്ളം', 'Drink this'),
    _s('n2', 'Needs', 'Medicine', 'ಮಾತ್ರೆ', 'மருந்து', 'మందు', 'മരുന്ന്', 'Take for health'),
    _s('n3', 'Needs', 'Specs', 'ಕನ್ನಡಕ', 'கண்ணாடி', 'కళ్లద్దాలు', 'കണ്ണട', 'To see clearly'),
    _s('n4', 'Needs', 'Soap', 'ಸೋಪು', 'சோப்பு', 'సబ్బు', 'സോപ്പ്', 'Wash hands'),
    _s('n5', 'Needs', 'Brush', 'ಬ್ರಷ್', 'பல் துலக்கி', 'బ్రష్', 'ബ്രഷ്', 'Clean teeth'),
    _s('n6', 'Needs', 'Comb', 'ಬಾಚಣಿಗೆ', 'சீப்பு', 'దువ్వెన', 'ചീപ്പ്', 'Style hair'),
    _s('n7', 'Needs', 'Towel', 'ಟವಲ್', 'துண்டு', 'తువ్వాలు', 'ടുവൽ', 'Wipe dry'),
    _s('n8', 'Needs', 'Toilet', 'ಶೌಚಾಲಯ', 'கழிப்பறை', 'మరుగుదొడ్డి', 'ശൗചാലയം', 'Restroom'),
    _s('n9', 'Needs', 'Sleep', 'ನಿದ್ರೆ', 'தூக்கம்', 'నిద్ర', 'ഉറക്കം', 'Rest at night'),
    _s('n10', 'Needs', 'Help', 'ಸಹಾಯ', 'உதவி', 'సహాయం', 'സഹായം', 'Need assistance'),

    // --- 2. KITCHEN & FOOD (INDIAN CONTEXT) ---
    _s('f1', 'Food', 'Plate', 'ತಟ್ಟೆ', 'தட்டு', 'కంచಂ', 'പ്ലേറ്റ്', 'Eat on this'),
    _s('f2', 'Food', 'Spoon', 'ಚಮಚ', 'ஸ்பூன்', 'చెంచా', 'സ്പൂൺ', 'Eat with this'),
    _s('f3', 'Food', 'Milk', 'ಹಾಲು', 'பால்', 'పాలు', 'പാൽ', 'White drink'),
    _s('f4', 'Food', 'Rice', 'ಅನ್ನ', 'சாதம்', 'అన్నం', 'ചോറ്', 'Main meal'),
    _s('f5', 'Food', 'Fruit', 'ಹಣ್ಣು', 'பழம்', 'పండు', 'പഴം', 'Healthy snack'),
    _s('f6', 'Food', 'Salt', 'ಉಪ್ಪು', 'உப்பு', 'ఉప్పు', 'ഉപ്പ്', 'Tastes salty'),
    _s('f7', 'Food', 'Sugar', 'ಸಕ್ಕರೆ', 'சர்க்கரை', 'చక్కెర', 'പഞ്ചസാര', 'Tastes sweet'),
    _s('f8', 'Food', 'Curd', 'ಮೊಸರು', 'தயிர்', 'పెరుగు', 'തൈര്', 'White and sour'),
    _s('f9', 'Food', 'Bread', 'ಬ್ರೆಡ್', 'ரொட்டி', 'రొట్టె', 'ബ്രെഡ്', 'Soft toast'),
    _s('f10', 'Food', 'Tea', 'ಚಹಾ', 'தேநீர்', 'టీ', 'ചായ', 'Hot drink'),
    _s('f11', 'Food', 'Idli', 'ಇಡ್ಲಿ', 'இட்லி', 'ఇడ్లీ', 'ഇഡ്ഡലി', 'Steam cake'),
    _s('f12', 'Food', 'Dosa', 'ದೋಸೆ', 'தோசை', 'దోశ', 'ദോശ', 'Rice pancake'),
    _s('f13', 'Food', 'Watermelon', 'ಕಲ್ಲಂಗಡಿ', 'தர்பூசணி', 'పుచ్చకాయ', 'തണ്ണിമത്തൻ', 'Red fruit'),
    _s('f14', 'Food', 'Banana', 'ಬಾಳೆಹಣ್ಣು', 'வாழைப்பழம்', 'అరటిపండు', 'വാഴപ്പഴം', 'Yellow fruit'),
    _s('f15', 'Food', 'Coffee', 'ಕಾಫಿ', 'காபி', 'కాఫీ', 'കോഫി', 'Morning drink'),

    // --- 3. HOME ITEMS ---
    _s('h1', 'Home', 'Fan', 'ಫ್ಯಾನ್', 'மின்விசிறಿ', 'ఫ్యాన్', 'ഫാൻ', 'Cool air'),
    _s('h2', 'Home', 'Light', 'ದೀಪ', 'விளக்கு', 'దీపం', 'വിളക്ക്', 'Brightness'),
    _s('h3', 'Home', 'Bed', 'ಹಾಸಿಗೆ', 'படுக்கை', 'మంచం', 'കിടക്ക', 'To sleep'),
    _s('h4', 'Home', 'Phone', 'ಫೋನ್', 'தொலைபேசி', 'ఫోన్', 'ഫോൺ', 'To call'),
    _s('h5', 'Home', 'TV', 'ಟಿವಿ', 'தொலைக்காட்சி', 'టీవీ', 'ടിവി', 'Watch news'),
    _s('h6', 'Home', 'Chair', 'ಕುರ್ಚಿ', 'நாற்காலி', 'కుర్చీ', 'കസേര', 'To sit'),
    _s('h7', 'Home', 'Table', 'ಮೇಜು', 'மேசை', 'మేజ బల్ల', 'മേശ', 'Keep things on'),
    _s('h8', 'Home', 'Door', 'ಬಾಗಿಲು', 'கதவு', 'తలుపు', 'വാതിൽ', 'Open or close'),
    _s('h9', 'Home', 'Window', 'ಕಿಟಕಿ', 'ஜன்னல்', 'కిటికీ', 'ജനൽ', 'See outside'),
    _s('h10', 'Home', 'Clock', 'ಗಡಿಯಾರ', 'கடிகாரம்', 'గడియారం', 'See time'),
    _s('h11', 'Home', 'Keys', 'ಕೀಲಿ', 'சாவி', 'తాళం చెవి', 'താക്കോൽ', 'Open lock'),
    _s('h12', 'Home', 'Mirror', 'ಕನ್ನಡಿ', 'கண்ணாடி', 'అద్దం', 'കണ്ണാടി', 'See yourself'),
    _s('h13', 'Home', 'Bucket', 'ಬಕೆಟ್', 'வாளி', 'బకెట్', 'ബക്കറ്റ്', 'Hold water'),
    _s('h14', 'Home', 'Pillow', 'ದಿಂಬು', 'தலையணை', 'దిండు', 'തലയണ', 'Under head'),
    _s('h15', 'Home', 'Bag', 'ಚೀಲ', 'பை', 'సంచి', 'ബാഗ്', 'Carry things'),

    // --- 4. FAMILY & PEOPLE ---
    _s('p1', 'Family', 'Doctor', 'ವೈದ್ಯರು', 'மருத்துவர்', 'డాక్టర్', 'ഡോക്ടർ', 'Treats you'),
    _s('p2', 'Family', 'Nurse', 'ದಾದಿ', 'செவிலியர்', 'నర్సు', 'നഴ്സ്', 'Helps you'),
    _s('p3', 'Family', 'Son', 'ಮಗ', 'மகன்', 'కొడుకు', 'മകൻ', 'Your boy'),
    _s('p4', 'Family', 'Daughter', 'ಮಗಳು', 'மகள்', 'కూతురు', 'മകൾ', 'Your girl'),
    _s('p5', 'Family', 'Friend', 'ಸ್ನೇಹಿತ', 'நண்பன்', 'స్నేహితుడు', 'സുഹൃത്ത്', 'Plays with you'),
    _s('p6', 'Family', 'Wife', 'ಹೆಂಡತಿ', 'மனைவி', 'భార్య', 'ഭാര്യ', 'Partner'),
    _s('p7', 'Family', 'Husband', 'ಗಂಡ', 'கணவர்', 'భర్త', 'ഭർത്താവ്', 'Partner'),
    _s('p8', 'Family', 'Mother', 'ತಾಯಿ', 'தாய்', 'తల్లి', 'അമ്മ', 'Parent'),
    _s('p9', 'Family', 'Father', 'ತಂದೆ', 'தந்தை', 'తండ్రి', 'അച്ഛൻ', 'Parent'),
    _s('p10', 'Family', 'Children', 'ಮಕ್ಕಳು', 'குழந்தைகள்', 'పిల్లలు', 'കുട്ടികൾ', 'Young ones'),

    // --- 5. ACTION VERBS ---
    _s('v1', 'Action', 'Eat', 'ತಿನ್ನು', 'சாப்பிடு', 'తిను', 'കഴിക്കുക', 'Mouth'),
    _s('v2', 'Action', 'Drink', 'ಕುಡಿ', 'குடி', 'త్రాగు', 'കുടിക്കുക', 'Liquid'),
    _s('v3', 'Action', 'Walk', 'ನಡೆ', 'நட', 'నడు', 'നടക്കുക', 'Legs'),
    _s('v4', 'Action', 'Sleep', 'ಮಲಗು', 'தூங்கு', 'పడుకో', 'ഉറങ്ങുക', 'Rest'),
    _s('v5', 'Action', 'Talk', 'ಮಾತನಾಡು', 'பேசு', 'మాట్లాడు', 'Voice'),
    _s('v6', 'Action', 'See', 'ನೋಡು', 'பார்', 'చూడు', 'കാണുക', 'Eyes'),
    _s('v7', 'Action', 'Sit', 'ಕುಳಿತುಕೋ', 'உட்கார்', 'కూర్చో', 'ഇരിക്കുക', 'Chair'),
    _s('v8', 'Action', 'Stand', 'ನಿಲ್ಲು', 'நில்', 'నిలబడు', 'നിൽക്കുക', 'Upright'),
    _s('v9', 'Action', 'Give', 'ಕೊಡು', 'கொடு', 'ఇవ్వు', 'നൽകുക', 'Hand over'),
    _s('v10', 'Action', 'Take', 'ತೆಗೆದುಕೊ', 'எடு', 'తీసుకో', 'എടുക്കുക', 'Receive'),
    _s('v11', 'Action', 'Wash', 'ತೊಳೆಯಿರಿ', 'கழுவு', 'కడుగు', 'കഴുകുക', 'Clean'),
    _s('v12', 'Action', 'Read', 'ಓದು', 'படி', 'చదువు', 'വായിക്കുക', 'Book'),
    _s('v13', 'Action', 'Write', 'ಬರೆ', 'எழுது', 'రాయి', 'എഴുതുക', 'Pen'),
    _s('v14', 'Action', 'Open', 'ತೆರೆ', 'திற', 'తెరువు', 'തുറക്കുക', 'Door'),
    _s('v15', 'Action', 'Close', 'ಮುಚ್ಚು', 'மூடு', 'మూయి', 'അടയ്ക്കുക', 'Window'),

    // --- 6. BODY PARTS ---
    _s('b1', 'Body', 'Head', 'ತಲೆ', 'தலை', 'తల', 'തല', 'Top'),
    _s('b2', 'Body', 'Hand', 'ಕೈ', 'கை', 'చెయ్యಿ', 'കൈ', 'Hold'),
    _s('b3', 'Body', 'Leg', 'ಕಾಲು', 'கால்', 'కాలు', 'Walk'),
    _s('b4', 'Body', 'Eye', 'ಕಣ್ಣು', 'கண்', 'కన్ను', 'See'),
    _s('b5', 'Body', 'Ear', 'ಕಿವಿ', 'காது', 'చెవి', 'Hear'),
    _s('b6', 'Body', 'Mouth', 'ಬಾಯಿ', 'வாய்', 'నోరు', 'വായ', 'Speak'),
    _s('b7', 'Body', 'Nose', 'ಮೂಗು', 'மூக்கு', 'ముక్కు', 'മൂക്ക്', 'Smell'),
    _s('b8', 'Body', 'Hair', 'ಕೂದಲು', 'முடி', 'జుట్టు', 'മുടി', 'Black'),
    _s('b9', 'Body', 'Face', 'ಮುಖ', 'முகம்', 'ముఖం', 'മുഖം', 'Look'),
    _s('b10', 'Body', 'Stomach', 'ಹೊಟ್ಟೆ', 'வயிறு', 'పొట్ట', 'വയർ', 'Food'),

    // --- 7. CLOTHING ---
    _s('c1', 'Clothing', 'Shirt', 'ಶರ್ಟ್', 'சட்டை', 'చొక్కా', 'ഷർട്ട്', 'Wear'),
    _s('c2', 'Clothing', 'Sari', 'ಸೀರೆ', 'சேலை', 'చీర', 'സാരി', 'Drape'),
    _s('c3', 'Clothing', 'Shoes', 'ಶೂಗಳು', 'காலணி', 'షూలు', 'ഷൂസ്', 'Feet'),
    _s('c4', 'Clothing', 'Watch', 'ವಾಚ್', 'கடிகாரம்', 'వాచ్', 'വാച്ച്', 'Wrist'),
    _s('c5', 'Clothing', 'Cap', 'ಟೋಪಿ', 'தொப்பி', 'టోపీ', 'തൊപ്പി', 'Head'),

    // --- 8. ANIMALS & NATURE ---
    _s('a1', 'Animal', 'Dog', 'ನಾಯಿ', 'நாய்', 'కుక్క', 'പട്ടി', 'Bark'),
    _s('a2', 'Animal', 'Cat', 'ಬೆಕ್ಕು', 'பூனை', 'పిల్లి', 'പൂച്ച', 'Meow'),
    _s('a3', 'Animal', 'Cow', 'ಹಸು', 'பசு', 'ఆవు', 'പശു', 'Milk'),
    _s('a4', 'Nature', 'Sun', 'ಸೂರ್ಯ', 'சூரியன்', 'సూర్యుడు', 'സൂര്യൻ', 'Bright'),
    _s('a5', 'Nature', 'Moon', 'ಚಂದ್ರ', 'நிலா', 'చంద్రుడు', 'ചന്ദ്രൻ', 'Night'),
    _s('a6', 'Nature', 'Tree', 'ಮರ', 'மரம்', 'చెట్టు', 'മരം', 'Green'),
    _s('a7', 'Nature', 'Flower', 'ಹೂವು', 'பூ', 'పువ్వు', 'പൂവ്', 'Smell'),
    _s('a8', 'Nature', 'Rain', 'ಮಳೆ', 'மழை', 'వర్షం', 'മഴ', 'Wet'),

    // --- 9. HOSPITAL CONTEXT ---
    _s('hosp1', 'Hospital', 'Hospital', 'ಆಸ್ಪತ್ರೆ', 'மருத்துவமனை', 'ఆసుపత్రి', 'ആശുപത്രി', 'Care'),
    _s('hosp2', 'Hospital', 'Pain', 'ನೋವು', 'வலி', 'నెప్పి', 'വേദന', 'Hurts'),
    _s('hosp3', 'Hospital', 'Injection', 'ಇಂಜೆಕ್ಷನ್', 'ஊசி', 'ఇంజెక్షన్', 'ഇഞ്ചക്ഷൻ', 'Prick'),
    _s('hosp4', 'Hospital', 'Wheelchair', 'ಚಕ್ರ ಕುರ್ಚಿ', 'சக்கர நாற்காலி', 'చక్రాల కుర్చీ', 'വീൽചെയർ', 'Move'),
    _s('hosp5', 'Hospital', 'Blood', 'ರಕ್ತ', 'இரத்தம்', 'రక్తం', 'രക്തം', 'Red'),

    // --- 10. COLORS ---
    _s('clr1', 'Color', 'Red', 'ಕೆಂಪು', 'சிவப்பு', 'ఎరుపు', 'ചുവപ്പ്', 'Color'),
    _s('clr2', 'Color', 'Blue', 'ನೀಲಿ', 'நீலம்', 'నీలం', 'നീല', 'Color'),
    _s('clr3', 'Color', 'Green', 'ಹಸಿರು', 'பச்சை', 'పచ్చ', 'പച്ച', 'Color'),
    _s('clr4', 'Color', 'Yellow', 'ಹಳದಿ', 'மஞ்சள்', 'పసుపు', 'മഞ്ഞ', 'Color'),
    _s('clr5', 'Color', 'White', 'ಬಿಳಿ', 'வெள்ளை', 'తెలుపు', 'വെള്ള', 'Color'),
  ];

  static Stimulus _s(String id, String cat, String en, String kn, String ta, String te, String ml, String cue) {
    return Stimulus(
      id: id,
      category: cat,
      en: en, kn: kn, ta: ta, te: te, ml: ml,
      imagePath: 'https://images.unsplash.com/photo-1544640808-32ca72ac7f67?auto=format&fit=crop&q=80&w=400&q=water', // This is a placeholder; logic uses 'en' for search
      semanticCues: {
        'en': cue,
        'kn': 'ಇದರ ಬಗ್ಗೆ ಯೋಚಿಸಿ...',
        'ta': 'இதைப் பற்றி யோசி...',
        'te': 'దీని గురించి ఆలోచించండి...',
        'ml': 'ഇതിനെക്കുറിച്ച് ചിന്തിക്കുക...',
      },
    );
  }
}
