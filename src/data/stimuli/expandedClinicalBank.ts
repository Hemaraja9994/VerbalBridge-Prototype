import type { LangCode, LanguageStimuli, StimulusItem } from '../../types';

type SeverityGrade = 'Severe' | 'Moderate' | 'Mild';
type LocalWord = [word: string, translit?: string];
type LocalWords = Record<LangCode, LocalWord>;

interface ClinicalConcept {
  slug: string;
  conceptTag: string;
  category: string;
  subCategory: string;
  severityGrade: SeverityGrade;
  lesionProfileTarget: string;
  culturalRelevance: boolean;
  emoji: string;
  semanticCue: string;
  gesture: string;
  gestureEmoji: string;
  distractorEmojis: string[];
  words: LocalWords;
}

const w = (
  en: LocalWord,
  kn: LocalWord,
  hi: LocalWord,
  ml: LocalWord,
  ta: LocalWord,
  te: LocalWord
): LocalWords => ({ en, kn, hi, ml, ta, te });

const c = (
  slug: string,
  conceptTag: string,
  category: string,
  subCategory: string,
  severityGrade: SeverityGrade,
  lesionProfileTarget: string,
  culturalRelevance: boolean,
  emoji: string,
  semanticCue: string,
  gesture: string,
  gestureEmoji: string,
  distractorEmojis: string[],
  words: LocalWords
): ClinicalConcept => ({
  slug,
  conceptTag,
  category,
  subCategory,
  severityGrade,
  lesionProfileTarget,
  culturalRelevance,
  emoji,
  semanticCue,
  gesture,
  gestureEmoji,
  distractorEmojis,
  words,
});

const firstCue = (word: string, translit?: string): string => {
  const source = (translit || word).trim().replace(/[()]/g, '');
  const first = source.split(/[\s/-]+/)[0] || source;
  return first.slice(0, Math.min(first.length, 3)).toLowerCase();
};

const concepts: ClinicalConcept[] = [
  c('water', 'Water', 'ADLs', 'Basic Needs & Survival', 'Severe', 'Global/Anterior', true, '💧', 'You drink this when you are thirsty.', 'Cup your hand and bring it to your mouth.', '🥤', ['🍵', '🥛', '🧃'], w(['Water'], ['ನೀರು', 'neeru'], ['पानी', 'paani'], ['വെള്ളം', 'vellam'], ['தண்ணீர்', 'thanneer'], ['నీళ్లు', 'neellu'])),
  c('food', 'Food', 'ADLs', 'Basic Needs & Survival', 'Severe', 'Global/Anterior', true, '🍽️', 'You eat this when you are hungry.', 'Bring fingers toward the mouth as if eating.', '🤏', ['💧', '💊', '🛏️'], w(['Food'], ['ಊಟ', 'oota'], ['खाना', 'khaana'], ['ഭക്ഷണം', 'bhakshanam'], ['உணவு', 'unavu'], ['ఆహారం', 'aaharam'])),
  c('rice', 'Rice', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Severe', 'Global/Anterior', true, '🍚', 'A common cooked grain eaten with dal, sambar, or curry.', 'Pretend to mix rice and eat with fingers.', '🤏', ['🍞', '🥣', '🥛'], w(['Rice'], ['ಅನ್ನ', 'anna'], ['चावल', 'chawal'], ['ചോറ്', 'choru'], ['சாதம்', 'saadam'], ['అన్నం', 'annam'])),
  c('pain', 'Pain', 'Medical', 'Symptom Reporting', 'Severe', 'Global', false, '🤕', 'This word tells someone that something hurts.', 'Hold the painful body part and make a mild pain face.', '🤕', ['😊', '😴', '🍚'], w(['Pain'], ['ನೋವು', 'novu'], ['दर्द', 'dard'], ['വേദന', 'vedana'], ['வலி', 'vali'], ['నొప్పి', 'noppi'])),
  c('toilet', 'Toilet', 'ADLs', 'Basic Needs & Survival', 'Severe', 'Global', true, '🚻', 'A place used for passing urine or stool.', 'Point thumb backward as if asking to go, then say the word.', '🚶', ['🛏️', '🚪', '🏥'], w(['Toilet'], ['ಶೌಚಾಲಯ', 'shauchalaya'], ['शौचालय', 'shauchalay'], ['ശൗചാലയം', 'shauchalayam'], ['கழிப்பறை', 'kazhipparai'], ['మరుగుదొడ్డి', 'marugudoddi'])),
  c('help', 'Help', 'Social Pragmatics', 'Basic Needs & Survival', 'Severe', 'Global/Anterior', false, '🆘', 'Use this when you need another person to assist you.', 'Raise one hand gently to request help.', '✋', ['✅', '❌', '📞'], w(['Help'], ['ಸಹಾಯ', 'sahaya'], ['मदद', 'madad'], ['സഹായം', 'sahayam'], ['உதவி', 'uthavi'], ['సహాయం', 'sahayam'])),
  c('sleep', 'Sleep', 'ADLs', 'Basic Needs & Survival', 'Severe', 'Global/Anterior', false, '😴', 'You do this at night when tired.', 'Rest your head on folded hands.', '🛌', ['🚶', '🍽️', '📞'], w(['Sleep'], ['ನಿದ್ರೆ', 'nidre'], ['नींद', 'neend'], ['ഉറക്കം', 'urakkam'], ['தூக்கம்', 'thookkam'], ['నిద్ర', 'nidra'])),
  c('hot', 'Hot', 'Descriptors', 'Basic Needs & Survival', 'Severe', 'Global/Posterior', true, '🔥', 'Use this for tea, food, or weather with high heat.', 'Move hand away as if something is hot.', '🔥', ['❄️', '💧', '😴'], w(['Hot'], ['ಬಿಸಿ', 'bisi'], ['गरम', 'garam'], ['ചൂട്', 'choodu'], ['சூடு', 'soodu'], ['వేడి', 'vedi'])),
  c('cold', 'Cold', 'Descriptors', 'Basic Needs & Survival', 'Severe', 'Global/Posterior', true, '❄️', 'Use this for water, weather, or body feeling low temperature.', 'Rub arms as if shivering.', '🥶', ['🔥', '🍵', '☀️'], w(['Cold'], ['ಚಳಿ', 'chali'], ['ठंडा', 'thanda'], ['തണുപ്പ്', 'thanuppu'], ['குளிர்', 'kulir'], ['చలి', 'chali'])),
  c('hungry', 'Hungry', 'ADLs', 'Basic Needs & Survival', 'Severe', 'Global/Anterior', false, '🍽️', 'This feeling means you need food.', 'Touch stomach and say the word.', '🤲', ['💧', '😴', '🔥'], w(['Hungry'], ['ಹಸಿವು', 'hasivu'], ['भूख', 'bhookh'], ['വിശപ്പ്', 'vishappu'], ['பசி', 'pasi'], ['ఆకలి', 'aakali'])),
  c('thirsty', 'Thirsty', 'ADLs', 'Basic Needs & Survival', 'Severe', 'Global/Anterior', false, '🥤', 'This feeling means you need water.', 'Touch throat and mime drinking.', '🥤', ['🍚', '😴', '💊'], w(['Thirsty'], ['ಬಾಯಾರಿಕೆ', 'baayarike'], ['प्यास', 'pyaas'], ['ദാഹം', 'daaham'], ['தாகம்', 'thaagam'], ['దాహం', 'daaham'])),
  c('yes', 'Yes', 'Social Pragmatics', 'Basic Needs & Survival', 'Severe', 'Global', false, '✅', 'Use this to agree or accept.', 'Nod once and say the word.', '👍', ['❌', '🆘', '⛔'], w(['Yes'], ['ಹೌದು', 'haudu'], ['हाँ', 'haan'], ['അതെ', 'athe'], ['ஆம்', 'aam'], ['అవును', 'avunu'])),
  c('no', 'No', 'Social Pragmatics', 'Basic Needs & Survival', 'Severe', 'Global', false, '❌', 'Use this to refuse or reject.', 'Shake head gently and say the word.', '👎', ['✅', '🆘', '🍽️'], w(['No'], ['ಇಲ್ಲ', 'illa'], ['नहीं', 'nahin'], ['ഇല്ല', 'illa'], ['இல்லை', 'illai'], ['లేదు', 'ledu'])),
  c('more', 'More', 'ADLs', 'Basic Needs & Survival', 'Severe', 'Global/Anterior', false, '➕', 'Use this when you want extra food, water, or help.', 'Bring fingertips together twice.', '➕', ['✅', '❌', '⛔'], w(['More'], ['ಇನ್ನಷ್ಟು', 'innashtu'], ['और', 'aur'], ['കൂടുതൽ', 'kooduthal'], ['இன்னும்', 'innum'], ['ఇంకా', 'inka'])),
  c('finished', 'Finished', 'ADLs', 'Basic Needs & Survival', 'Severe', 'Global/Anterior', false, '🏁', 'Use this when something is complete.', 'Show open empty hands.', '👐', ['➕', '🍽️', '💧'], w(['Finished'], ['ಮುಗಿತು', 'mugitu'], ['खत्म', 'khatam'], ['കഴിഞ്ഞു', 'kazhinju'], ['முடிந்தது', 'mudinthathu'], ['అయింది', 'ayindi'])),
  c('home', 'Home', 'Nouns', 'Basic Needs & Survival', 'Severe', 'Global/Anterior', true, '🏠', 'The place where you live with family.', 'Make a roof shape above the head.', '🏠', ['🏥', '🏫', '🏪'], w(['Home'], ['ಮನೆ', 'mane'], ['घर', 'ghar'], ['വീട്', 'veedu'], ['வீடு', 'veedu'], ['ఇల్లు', 'illu'])),
  c('phone', 'Phone', 'Nouns', 'Basic Needs & Survival', 'Severe', 'Global/Anterior', true, '📱', 'You use this to call family or the doctor.', 'Hold hand to ear like a phone.', '🤙', ['📖', '🥄', '🚌'], w(['Phone'], ['ಫೋನ್', 'phone'], ['फोन', 'phone'], ['ഫോൺ', 'phone'], ['போன்', 'phone'], ['ఫోన్', 'phone'])),
  c('bed', 'Bed', 'Nouns', 'Household Items', 'Severe', 'Global/Anterior', false, '🛏️', 'You sleep or rest on this.', 'Rest head on hands like a pillow.', '🛌', ['🪑', '🚪', '🪟'], w(['Bed'], ['ಹಾಸಿಗೆ', 'haasige'], ['बिस्तर', 'bistar'], ['കിടക്ക', 'kidakka'], ['படுக்கை', 'padukkai'], ['మంచం', 'mancham'])),
  c('chair', 'Chair', 'Nouns', 'Household Items', 'Severe', 'Global/Anterior', false, '🪑', 'You sit on this.', 'Bend knees slightly as if sitting.', '🧎', ['🛏️', '🚪', '🪟'], w(['Chair'], ['ಕುರ್ಚಿ', 'kurchi'], ['कुर्सी', 'kursi'], ['കസേര', 'kasera'], ['நாற்காலி', 'naarkali'], ['కుర్చీ', 'kurchi'])),
  c('door', 'Door', 'Nouns', 'Household Items', 'Severe', 'Global/Anterior', false, '🚪', 'You open this to enter or leave a room.', 'Pretend to open a door handle.', '🚪', ['🪟', '🪑', '💡'], w(['Door'], ['ಬಾಗಿಲು', 'baagilu'], ['दरवाज़ा', 'darwaza'], ['വാതിൽ', 'vaathil'], ['கதவு', 'kathavu'], ['తలుపు', 'talupu'])),
  c('light', 'Light', 'Nouns', 'Household Items', 'Severe', 'Global/Posterior', false, '💡', 'This helps you see in the dark.', 'Point upward and pretend to switch on.', '☝️', ['🪟', '🪭', '🚪'], w(['Light'], ['ಬೆಳಕು', 'belaku'], ['बत्ती', 'batti'], ['വെളിച്ചം', 'velicham'], ['விளக்கு', 'vilakku'], ['లైట్', 'light'])),
  c('fan', 'Fan', 'Nouns', 'Household Items', 'Severe', 'Global/Posterior', true, '🪭', 'This gives air and cools the room.', 'Wave hand in a circular motion.', '🌀', ['💡', '🔥', '❄️'], w(['Fan'], ['ಫ್ಯಾನ್', 'fan'], ['पंखा', 'pankha'], ['ഫാൻ', 'fan'], ['விசிறி', 'visiri'], ['ఫ్యాన్', 'fan'])),
  c('medicine', 'Medicine', 'Medical', 'Medication', 'Severe', 'Global/Anterior', false, '💊', 'This is taken to treat illness or pain.', 'Pretend to take a tablet.', '💊', ['🍬', '🍚', '🥛'], w(['Medicine'], ['ಔಷಧಿ', 'aushadhi'], ['दवा', 'dawa'], ['മരുന്ന്', 'marunnu'], ['மருந்து', 'marunthu'], ['మందు', 'mandu'])),
  c('doctor', 'Doctor', 'Medical', 'Hospital Scenarios', 'Moderate', 'Mixed', false, '🧑‍⚕️', 'This person examines and treats patients.', 'Pretend to use a stethoscope.', '🩺', ['👩‍⚕️', '👨‍🏫', '👮'], w(['Doctor'], ['ವೈದ್ಯರು', 'vaidyaru'], ['डॉक्टर', 'doctor'], ['ഡോക്ടർ', 'doctor'], ['மருத்துவர்', 'maruththuvar'], ['డాక్టర్', 'doctor'])),
  c('nurse', 'Nurse', 'Medical', 'Hospital Scenarios', 'Moderate', 'Mixed', false, '👩‍⚕️', 'This person helps care for patients in hospital.', 'Pretend to check a pulse.', '🩺', ['🧑‍⚕️', '👨‍🍳', '👮'], w(['Nurse'], ['ನರ್ಸ್', 'nurse'], ['नर्स', 'nurse'], ['നഴ്സ്', 'nurse'], ['செவிலியர்', 'seviliyar'], ['నర్స్', 'nurse'])),
  c('hospital', 'Hospital', 'Medical', 'Hospital Scenarios', 'Moderate', 'Mixed', false, '🏥', 'A place where sick people go for treatment.', 'Make a cross sign in the air.', '🏥', ['🏠', '🏫', '🏪'], w(['Hospital'], ['ಆಸ್ಪತ್ರೆ', 'aaspatre'], ['अस्पताल', 'aspataal'], ['ആശുപത്രി', 'aashupathri'], ['மருத்துவமனை', 'maruthuvamanai'], ['ఆసుపత్రి', 'aasupatri'])),
  c('tablet', 'Tablet', 'Medical', 'Medication', 'Moderate', 'Anterior/Expressive', false, '💊', 'A small medicine you swallow.', 'Pretend to place a tablet in the mouth.', '💊', ['💉', '🩹', '🍬'], w(['Tablet'], ['ಗುಳಿ', 'guli'], ['गोली', 'goli'], ['ഗുളിക', 'gulika'], ['மாத்திரை', 'maathirai'], ['గోలి', 'goli'])),
  c('injection', 'Injection', 'Medical', 'Hospital Scenarios', 'Moderate', 'Posterior/Receptive', false, '💉', 'Medicine given through a needle.', 'Point to upper arm.', '💪', ['💊', '🩹', '🩺'], w(['Injection'], ['ಇಂಜೆಕ್ಷನ್', 'injection'], ['इंजेक्शन', 'injection'], ['ഇഞ്ചക്ഷൻ', 'injection'], ['ஊசி', 'oosi'], ['ఇంజెక్షన్', 'injection'])),
  c('blood', 'Blood', 'Medical', 'Hospital Scenarios', 'Moderate', 'Mixed', false, '🩸', 'The red fluid inside the body.', 'Point to the arm where blood is taken.', '💪', ['💧', '💊', '🩹'], w(['Blood'], ['ರಕ್ತ', 'rakta'], ['खून', 'khoon'], ['രക്തം', 'raktham'], ['ரத்தம்', 'ratham'], ['రక్తం', 'raktam'])),
  c('fever', 'Fever', 'Medical', 'Symptom Reporting', 'Moderate', 'Mixed', false, '🌡️', 'High body temperature during illness.', 'Touch forehead as if checking temperature.', '🤒', ['❄️', '😴', '💧'], w(['Fever'], ['ಜ್ವರ', 'jwara'], ['बुखार', 'bukhaar'], ['പനി', 'pani'], ['காய்ச்சல்', 'kaaichal'], ['జ్వరం', 'jwaram'])),
  c('cough', 'Cough', 'Medical', 'Symptom Reporting', 'Moderate', 'Anterior/Expressive', false, '😷', 'A forceful sound from the throat or chest.', 'Cover mouth and cough gently.', '🤧', ['🤒', '😴', '🩹'], w(['Cough'], ['ಕೆಮ್ಮು', 'kemmu'], ['खांसी', 'khaansi'], ['ചുമ', 'chuma'], ['இருமல்', 'irumal'], ['దగ్గు', 'daggu'])),
  c('headache', 'Headache', 'Medical', 'Symptom Reporting', 'Moderate', 'Mixed', false, '🤯', 'Pain in the head.', 'Hold the head with one hand.', '🤕', ['🦵', '💪', '😋'], w(['Headache'], ['ತಲೆನೋವು', 'talenovu'], ['सिरदर्द', 'sirdard'], ['തലവേദന', 'thalavedana'], ['தலைவலி', 'thalaivali'], ['తలనొప్పి', 'talanoppi'])),
  c('breathing', 'Breathing', 'Medical', 'Symptom Reporting', 'Moderate', 'Mixed', false, '🫁', 'Taking air in and out of the lungs.', 'Place hand on chest and breathe slowly.', '🫁', ['💊', '🩸', '🛏️'], w(['Breathing'], ['ಉಸಿರಾಟ', 'usiraata'], ['सांस', 'saans'], ['ശ്വാസം', 'shwasam'], ['மூச்சு', 'moochu'], ['శ్వాస', 'shwasa'])),
  c('pressure', 'Blood Pressure', 'Medical', 'Vitals', 'Moderate', 'Posterior/Receptive', false, '🩺', 'A measure checked with a cuff on the arm.', 'Wrap one hand around the upper arm.', '💪', ['🌡️', '🩸', '💊'], w(['Pressure'], ['ಒತ್ತಡ', 'ottada'], ['ब्लड प्रेशर', 'blood pressure'], ['പ്രഷർ', 'pressure'], ['அழுத்தம்', 'azhutham'], ['ప్రెషర్', 'pressure'])),
  c('sugar', 'Blood Sugar', 'Medical', 'Vitals', 'Moderate', 'Posterior/Receptive', true, '🩸', 'A diabetes-related blood value checked by test.', 'Pretend to prick a finger.', '👉', ['🧂', '🍬', '💊'], w(['Sugar'], ['ಸಕ್ಕರೆ', 'sakkare'], ['शुगर', 'sugar'], ['ഷുഗർ', 'sugar'], ['சர்க்கரை', 'sarkkarai'], ['షుగర్', 'sugar'])),
  c('report', 'Report', 'Medical', 'Hospital Scenarios', 'Mild', 'Posterior/Receptive', false, '📄', 'A paper or file showing test results.', 'Hold imaginary paper and show it.', '📄', ['💊', '🩺', '💉'], w(['Report'], ['ವರದಿ', 'varadi'], ['रिपोर्ट', 'report'], ['റിപ്പോർട്ട്', 'report'], ['அறிக்கை', 'arikkai'], ['రిపోర్ట్', 'report'])),
  c('appointment', 'Appointment', 'Medical', 'Hospital Scenarios', 'Mild', 'Posterior/Receptive', false, '📅', 'A fixed date and time to meet the doctor.', 'Point to an imaginary calendar.', '📅', ['📄', '💊', '🏥'], w(['Appointment'], ['ಅಪಾಯಿಂಟ್ಮೆಂಟ್', 'appointment'], ['अपॉइंटमेंट', 'appointment'], ['അപ്പോയിന്റ്മെന്റ്', 'appointment'], ['நேரம்', 'neram'], ['అపాయింట్మెంట్', 'appointment'])),
  c('prescription', 'Prescription', 'Medical', 'Hospital Scenarios', 'Mild', 'Posterior/Receptive', false, '📝', 'A doctor-written list of medicines.', 'Pretend to write on paper.', '✍️', ['📅', '💊', '🩺'], w(['Prescription'], ['ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್', 'prescription'], ['पर्ची', 'parchi'], ['കുറിപ്പ്', 'kurippu'], ['மருந்துச்சீட்டு', 'marundhu seettu'], ['ప్రిస్క్రిప్షన్', 'prescription'])),
  c('xray', 'X-ray', 'Medical', 'Hospital Scenarios', 'Mild', 'Posterior/Receptive', false, '🩻', 'A picture used to see bones inside the body.', 'Point to chest or arm like taking an X-ray.', '🩻', ['📄', '💉', '🌡️'], w(['X-ray'], ['ಎಕ್ಸ್ ರೇ', 'x-ray'], ['एक्स-रे', 'x-ray'], ['എക്സ്-റേ', 'x-ray'], ['எக்ஸ்-ரே', 'x-ray'], ['ఎక్స్ రే', 'x-ray'])),
  c('ambulance', 'Ambulance', 'Medical', 'Emergency', 'Moderate', 'Mixed', false, '🚑', 'A vehicle that takes sick people to hospital.', 'Move hand like a siren on top of the head.', '🚨', ['🚌', '🚗', '🚕'], w(['Ambulance'], ['ಆಂಬುಲೆನ್ಸ್', 'ambulance'], ['एम्बुलेंस', 'ambulance'], ['ആംബുലൻസ്', 'ambulance'], ['ஆம்புலன்ஸ்', 'ambulance'], ['అంబులెన్స్', 'ambulance'])),
  c('wheelchair', 'Wheelchair', 'Medical', 'Mobility', 'Moderate', 'Mixed', false, '♿', 'A chair with wheels used for moving a patient.', 'Move both hands as if pushing wheels.', '♿', ['🪑', '🛏️', '🚪'], w(['Wheelchair'], ['ವೀಲ್‌ಚೇರ್', 'wheelchair'], ['व्हीलचेयर', 'wheelchair'], ['വീൽചെയർ', 'wheelchair'], ['சக்கர நாற்காலி', 'sakkara naarkali'], ['వీల్‌చైర్', 'wheelchair'])),
  c('speech-therapy', 'Speech Therapy', 'Medical', 'Rehabilitation', 'Mild', 'Anterior/Expressive', false, '🗣️', 'Therapy that helps communication and speech.', 'Point to mouth and say the word.', '🗣️', ['🏥', '🚶', '💊'], w(['Speech therapy'], ['ಮಾತಿನ ಚಿಕಿತ್ಸೆ', 'maatina chikitse'], ['स्पीच थेरेपी', 'speech therapy'], ['സ്പീച്ച് തെറാപ്പി', 'speech therapy'], ['பேச்சு சிகிச்சை', 'pechu sigichai'], ['స్పీచ్ థెరపీ', 'speech therapy'])),
  c('physiotherapy', 'Physiotherapy', 'Medical', 'Rehabilitation', 'Mild', 'Mixed', false, '🏃', 'Therapy that helps body movement and strength.', 'Move arm like exercising.', '💪', ['🗣️', '💊', '📄'], w(['Physiotherapy'], ['ಫಿಸಿಯೊಥೆರಪಿ', 'physiotherapy'], ['फिजियोथेरेपी', 'physiotherapy'], ['ഫിസിയോതെറാപ്പി', 'physiotherapy'], ['உடற்பயிற்சி சிகிச்சை', 'udarpayirchi sigichai'], ['ఫిజియోథెరపీ', 'physiotherapy'])),
  c('dal', 'Dal', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Severe', 'Global/Anterior', true, '🥣', 'A cooked pulse dish eaten with rice or roti.', 'Pretend to pour dal over rice.', '🥣', ['🍚', '🍞', '🥛'], w(['Dal'], ['ಬೇಳೆ', 'bele'], ['दाल', 'dal'], ['പരിപ്പ്', 'parippu'], ['பருப்பு', 'paruppu'], ['పప్పు', 'pappu'])),
  c('roti', 'Roti', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Severe', 'Global/Anterior', true, '🫓', 'A round flatbread eaten with curry.', 'Pretend to tear a piece of roti.', '🤏', ['🍚', '🥣', '🍌'], w(['Roti'], ['ರೊಟ್ಟಿ', 'rotti'], ['रोटी', 'roti'], ['ചപ്പാത്തി', 'chappathi'], ['சப்பாத்தி', 'chappathi'], ['రోటి', 'roti'])),
  c('dosa', 'Dosa', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Moderate', 'Anterior/Expressive', true, '🥞', 'A thin South Indian food often eaten with chutney or sambar.', 'Pretend to fold dosa and eat.', '🤏', ['🍚', '🫓', '🍞'], w(['Dosa'], ['ದೋಸೆ', 'dose'], ['डोसा', 'dosa'], ['ദോശ', 'dosha'], ['தோசை', 'dosai'], ['దోసె', 'dose'])),
  c('idli', 'Idli', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Moderate', 'Anterior/Expressive', true, '⚪', 'A soft steamed South Indian food eaten with sambar or chutney.', 'Show a round shape with fingers.', '⭕', ['🥞', '🍚', '🫓'], w(['Idli'], ['ಇಡ್ಲಿ', 'idli'], ['इडली', 'idli'], ['ഇഡലി', 'idli'], ['இட்லி', 'idli'], ['ఇడ్లీ', 'idli'])),
  c('sambar', 'Sambar', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Moderate', 'Posterior/Receptive', true, '🍲', 'A South Indian lentil curry eaten with rice, idli, or dosa.', 'Pretend to ladle curry into a bowl.', '🥄', ['🥛', '🍵', '🍚'], w(['Sambar'], ['ಸಾಂಬಾರ್', 'sambar'], ['सांभर', 'sambar'], ['സാംബാർ', 'sambar'], ['சாம்பார்', 'sambar'], ['సాంబార్', 'sambar'])),
  c('curd', 'Curd', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Severe', 'Global/Anterior', true, '🥛', 'A milk product eaten with rice or used in raita.', 'Pretend to scoop curd with a spoon.', '🥄', ['🍵', '💧', '🍚'], w(['Curd'], ['ಮೊಸರು', 'mosaru'], ['दही', 'dahi'], ['തൈര്', 'thairu'], ['தயிர்', 'thayir'], ['పెరుగు', 'perugu'])),
  c('milk', 'Milk', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Severe', 'Global/Anterior', true, '🥛', 'A white drink often used in tea or coffee.', 'Pretend to drink from a glass.', '🥤', ['💧', '🍵', '🧃'], w(['Milk'], ['ಹಾಲು', 'haalu'], ['दूध', 'doodh'], ['പാൽ', 'paal'], ['பால்', 'paal'], ['పాలు', 'paalu'])),
  c('tea', 'Tea', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Severe', 'Global/Anterior', true, '🍵', 'A hot drink commonly made with milk, tea powder, and sugar.', 'Hold a cup and blow before sipping.', '🍵', ['☕', '🥛', '💧'], w(['Tea'], ['ಚಹಾ', 'chaha'], ['चाय', 'chai'], ['ചായ', 'chaaya'], ['தேநீர்', 'theneer'], ['టీ', 'tea'])),
  c('coffee', 'Coffee', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Moderate', 'Anterior/Expressive', true, '☕', 'A hot drink, common in many South Indian homes.', 'Hold a cup and sip.', '☕', ['🍵', '🥛', '🧃'], w(['Coffee'], ['ಕಾಫಿ', 'coffee'], ['कॉफी', 'coffee'], ['കാപ്പി', 'kaappi'], ['காபி', 'kaapi'], ['కాఫీ', 'coffee'])),
  c('banana', 'Banana', 'Nouns', 'Fruits', 'Severe', 'Global/Anterior', true, '🍌', 'A long yellow fruit that is easy to eat.', 'Pretend to peel a banana.', '🤲', ['🍎', '🥭', '🥥'], w(['Banana'], ['ಬಾಳೆಹಣ್ಣು', 'baalehannu'], ['केला', 'kela'], ['വാഴപ്പഴം', 'vazhappazham'], ['வாழைப்பழம்', 'vaazhaipazham'], ['అరటి పండు', 'arati pandu'])),
  c('apple', 'Apple', 'Nouns', 'Fruits', 'Moderate', 'Anterior/Expressive', false, '🍎', 'A round fruit, often red or green.', 'Hold an imaginary round fruit and bite.', '🤏', ['🍌', '🥭', '🍊'], w(['Apple'], ['ಸೇಬು', 'sebu'], ['सेब', 'seb'], ['ആപ്പിൾ', 'apple'], ['ஆப்பிள்', 'apple'], ['ఆపిల్', 'apple'])),
  c('mango', 'Mango', 'Nouns', 'Fruits', 'Moderate', 'Anterior/Expressive', true, '🥭', 'A sweet seasonal fruit popular in India.', 'Pretend to slice and eat mango.', '🥭', ['🍎', '🍌', '🥥'], w(['Mango'], ['ಮಾವಿನಹಣ್ಣು', 'maavinahannu'], ['आम', 'aam'], ['മാമ്പഴം', 'maambazham'], ['மாம்பழம்', 'maampazham'], ['మామిడి పండు', 'mamidi pandu'])),
  c('coconut', 'Coconut', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Moderate', 'Posterior/Receptive', true, '🥥', 'A hard fruit used in chutney, curry, and coconut water.', 'Pretend to break a coconut.', '🥥', ['🥭', '🍌', '🥛'], w(['Coconut'], ['ತೆಂಗಿನಕಾಯಿ', 'tenginakaayi'], ['नारियल', 'nariyal'], ['തേങ്ങ', 'thenga'], ['தேங்காய்', 'thengai'], ['కొబ్బరికాయ', 'kobbarikaya'])),
  c('egg', 'Egg', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Moderate', 'Anterior/Expressive', true, '🥚', 'A food that can be boiled, fried, or added to curry.', 'Pretend to crack an egg.', '🥚', ['🐟', '🍗', '🥛'], w(['Egg'], ['ಮೊಟ್ಟೆ', 'motte'], ['अंडा', 'anda'], ['മുട്ട', 'mutta'], ['முட்டை', 'muttai'], ['గుడ్డు', 'guddu'])),
  c('fish', 'Fish', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Moderate', 'Anterior/Expressive', true, '🐟', 'A common non-vegetarian food, especially in coastal homes.', 'Move hand like a swimming fish.', '🐟', ['🥚', '🍗', '🥬'], w(['Fish'], ['ಮೀನು', 'meenu'], ['मछली', 'machhli'], ['മീൻ', 'meen'], ['மீன்', 'meen'], ['చేప', 'chepa'])),
  c('chicken', 'Chicken', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Moderate', 'Anterior/Expressive', true, '🍗', 'A common non-vegetarian food cooked as curry or fry.', 'Pretend to eat a drumstick.', '🍗', ['🐟', '🥚', '🥬'], w(['Chicken'], ['ಕೋಳಿ', 'koli'], ['चिकन', 'chicken'], ['ചിക്കൻ', 'chicken'], ['கோழி', 'kozhi'], ['చికెన్', 'chicken'])),
  c('vegetables', 'Vegetables', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Moderate', 'Posterior/Receptive', true, '🥬', 'Plant foods cooked as sabzi, palya, poriyal, or curry.', 'Pretend to chop vegetables.', '🔪', ['🍗', '🐟', '🍚'], w(['Vegetables'], ['ತರಕಾರಿ', 'tarakaari'], ['सब्ज़ी', 'sabzi'], ['പച്ചക്കറി', 'pachakkari'], ['காய்கறி', 'kaikari'], ['కూరగాయలు', 'kooragayalu'])),
  c('salt', 'Salt', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Moderate', 'Posterior/Receptive', true, '🧂', 'A white seasoning added to food.', 'Pretend to sprinkle salt.', '🧂', ['🍬', '🌶️', '🛢️'], w(['Salt'], ['ಉಪ್ಪು', 'uppu'], ['नमक', 'namak'], ['ഉപ്പ്', 'uppu'], ['உப்பு', 'uppu'], ['ఉప్పు', 'uppu'])),
  c('sugar-food', 'Sugar', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Moderate', 'Posterior/Receptive', true, '🍬', 'A sweet ingredient added to tea or coffee.', 'Pretend to add sugar to tea.', '🥄', ['🧂', '🌶️', '💊'], w(['Sugar'], ['ಸಕ್ಕರೆ', 'sakkare'], ['चीनी', 'cheeni'], ['പഞ്ചസാര', 'panchasara'], ['சர்க்கரை', 'sarkkarai'], ['చక్కెర', 'chakkera'])),
  c('spoon', 'Spoon', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Severe', 'Global/Anterior', true, '🥄', 'You use this to eat or serve food.', 'Pretend to scoop food with a spoon.', '🥄', ['🍽️', '🥣', '🔪'], w(['Spoon'], ['ಚಮಚ', 'chamacha'], ['चम्मच', 'chammach'], ['സ്പൂൺ', 'spoon'], ['கரண்டி', 'karandi'], ['చెంచా', 'chencha'])),
  c('plate', 'Plate', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Severe', 'Global/Anterior', true, '🍽️', 'Food is served on this.', 'Show a flat round shape with both hands.', '🍽️', ['🥄', '🥤', '🥣'], w(['Plate'], ['ತಟ್ಟೆ', 'tatte'], ['थाली', 'thaali'], ['പാത്രം', 'paathram'], ['தட்டு', 'thattu'], ['ప్లేట్', 'plate'])),
  c('glass', 'Glass', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Severe', 'Global/Anterior', true, '🥤', 'You drink water or milk from this.', 'Hold an imaginary glass and drink.', '🥤', ['🍽️', '🥄', '🥣'], w(['Glass'], ['ಗ್ಲಾಸ್', 'glass'], ['गिलास', 'gilaas'], ['ഗ്ലാസ്', 'glass'], ['கண்ணாடி டம்ளர்', 'tumbler'], ['గ్లాస్', 'glass'])),
  c('stove', 'Stove', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Moderate', 'Posterior/Receptive', true, '🍳', 'Food is cooked on this.', 'Pretend to turn on a stove knob.', '🔥', ['🍽️', '🧂', '🥤'], w(['Stove'], ['ಒಲೆ', 'ole'], ['चूल्हा', 'chulha'], ['അടുപ്പ്', 'aduppu'], ['அடுப்பு', 'aduppu'], ['పొయ్యి', 'poyyi'])),
  c('gas', 'Gas', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Moderate', 'Posterior/Receptive', true, '🔥', 'Fuel used for cooking at home.', 'Pretend to turn a gas knob.', '🔥', ['💧', '🧂', '🥄'], w(['Gas'], ['ಗ್ಯಾಸ್', 'gas'], ['गैस', 'gas'], ['ഗ്യാസ്', 'gas'], ['கேஸ்', 'gas'], ['గ్యాస్', 'gas'])),
  c('knife', 'Knife', 'Nouns', 'Indian Cuisine & Kitchen ADLs', 'Moderate', 'Posterior/Receptive', false, '🔪', 'A sharp tool used to cut vegetables or fruit.', 'Pretend to cut carefully.', '🔪', ['🥄', '🍽️', '🥤'], w(['Knife'], ['ಚಾಕು', 'chaaku'], ['चाकू', 'chaaku'], ['കത്തി', 'kathi'], ['கத்தி', 'kathi'], ['కత్తి', 'kathi'])),
  c('mother', 'Mother', 'Nouns', 'Family & Kinship', 'Severe', 'Global/Anterior', true, '👩', 'A female parent, often a very familiar person.', 'Place hand on heart and say the word.', '❤️', ['👨', '👧', '👦'], w(['Mother'], ['ಅಮ್ಮ', 'amma'], ['माँ', 'maa'], ['അമ്മ', 'amma'], ['அம்மா', 'amma'], ['అమ్మ', 'amma'])),
  c('father', 'Father', 'Nouns', 'Family & Kinship', 'Severe', 'Global/Anterior', true, '👨', 'A male parent, often a very familiar person.', 'Place hand on heart and say the word.', '❤️', ['👩', '👧', '👦'], w(['Father'], ['ಅಪ್ಪ', 'appa'], ['पिता', 'pita'], ['അച്ഛൻ', 'achan'], ['அப்பா', 'appa'], ['నాన్న', 'nanna'])),
  c('wife', 'Wife', 'Nouns', 'Family & Kinship', 'Moderate', 'Anterior/Expressive', true, '👩‍❤️‍👨', 'A married female partner.', 'Point to ring finger or heart.', '❤️', ['👨', '👦', '👧'], w(['Wife'], ['ಹೆಂಡತಿ', 'hendati'], ['पत्नी', 'patni'], ['ഭാര്യ', 'bharya'], ['மனைவி', 'manaivi'], ['భార్య', 'bharya'])),
  c('husband', 'Husband', 'Nouns', 'Family & Kinship', 'Moderate', 'Anterior/Expressive', true, '👨‍❤️‍👩', 'A married male partner.', 'Point to ring finger or heart.', '❤️', ['👩', '👧', '👦'], w(['Husband'], ['ಗಂಡ', 'ganda'], ['पति', 'pati'], ['ഭർത്താവ്', 'bharthavu'], ['கணவர்', 'kanavar'], ['భర్త', 'bharta'])),
  c('son', 'Son', 'Nouns', 'Family & Kinship', 'Severe', 'Global/Anterior', true, '👦', 'A male child in the family.', 'Gesture to a child height.', '👦', ['👧', '👩', '👨'], w(['Son'], ['ಮಗ', 'maga'], ['बेटा', 'beta'], ['മകൻ', 'makan'], ['மகன்', 'magan'], ['కొడుకు', 'koduku'])),
  c('daughter', 'Daughter', 'Nouns', 'Family & Kinship', 'Severe', 'Global/Anterior', true, '👧', 'A female child in the family.', 'Gesture to a child height.', '👧', ['👦', '👩', '👨'], w(['Daughter'], ['ಮಗಳು', 'magalu'], ['बेटी', 'beti'], ['മകൾ', 'makal'], ['மகள்', 'magal'], ['కూతురు', 'koothuru'])),
  c('brother', 'Brother', 'Nouns', 'Family & Kinship', 'Moderate', 'Anterior/Expressive', true, '👨‍🦱', 'A male sibling.', 'Hold two fingers side by side.', '✌️', ['👩‍🦱', '👩', '👦'], w(['Brother'], ['ಅಣ್ಣ', 'anna'], ['भाई', 'bhai'], ['സഹോദരൻ', 'sahodaran'], ['அண்ணன்', 'annan'], ['అన్న', 'anna'])),
  c('sister', 'Sister', 'Nouns', 'Family & Kinship', 'Moderate', 'Anterior/Expressive', true, '👩‍🦱', 'A female sibling.', 'Hold two fingers side by side.', '✌️', ['👨‍🦱', '👨', '👧'], w(['Sister'], ['ಅಕ್ಕ', 'akka'], ['बहन', 'behen'], ['സഹോദരി', 'sahodari'], ['அக்கா', 'akka'], ['అక్క', 'akka'])),
  c('caregiver', 'Caregiver', 'Nouns', 'Family & Kinship', 'Mild', 'Mixed', false, '🤝', 'A person who helps with daily care.', 'Hold one hand as if supporting another.', '🤝', ['🧑‍⚕️', '👨‍🏫', '👮'], w(['Caregiver'], ['ಆರೈಕೆದಾರ', 'aaraikedaara'], ['देखभाल करने वाला', 'dekhbhal karne wala'], ['പരിചാരകൻ', 'paricharakan'], ['பராமரிப்பாளர்', 'paramarippalar'], ['సంరక్షకుడు', 'samrakshakudu'])),
  c('friend', 'Friend', 'Nouns', 'Family & Kinship', 'Moderate', 'Anterior/Expressive', false, '🧑‍🤝‍🧑', 'A person you know and like.', 'Gesture handshake.', '🤝', ['👩', '👨', '🧑‍⚕️'], w(['Friend'], ['ಸ್ನೇಹಿತ', 'snehita'], ['दोस्त', 'dost'], ['സുഹൃത്ത്', 'suhruth'], ['நண்பர்', 'nanbar'], ['స్నేహితుడు', 'snehitudu'])),
  c('bus', 'Bus', 'Nouns', 'Transport & Navigation', 'Moderate', 'Posterior/Receptive', true, '🚌', 'A large vehicle used for public travel.', 'Move hand forward like a vehicle.', '🚌', ['🚗', '🚕', '🚆'], w(['Bus'], ['ಬಸ್', 'bus'], ['बस', 'bus'], ['ബസ്', 'bus'], ['பேருந்து', 'perunthu'], ['బస్సు', 'bus'])),
  c('train', 'Train', 'Nouns', 'Transport & Navigation', 'Moderate', 'Posterior/Receptive', true, '🚆', 'A vehicle that runs on tracks between stations.', 'Move hand in a line like a train.', '🚆', ['🚌', '🚗', '🛺'], w(['Train'], ['ರೈಲು', 'railu'], ['ट्रेन', 'train'], ['ട്രെയിൻ', 'train'], ['ரயில்', 'rayil'], ['రైలు', 'railu'])),
  c('auto-rickshaw', 'Auto Rickshaw', 'Nouns', 'Transport & Navigation', 'Moderate', 'Posterior/Receptive', true, '🛺', 'A three-wheeler used for local travel.', 'Move hand like steering a small vehicle.', '🛺', ['🚌', '🚕', '🚲'], w(['Auto'], ['ಆಟೋ', 'auto'], ['ऑटो', 'auto'], ['ഓട്ടോ', 'auto'], ['ஆட்டோ', 'auto'], ['ఆటో', 'auto'])),
  c('taxi', 'Taxi', 'Nouns', 'Transport & Navigation', 'Moderate', 'Posterior/Receptive', true, '🚕', 'A hired car used for travel.', 'Raise hand as if calling a taxi.', '✋', ['🚌', '🚆', '🛺'], w(['Taxi'], ['ಟ್ಯಾಕ್ಸಿ', 'taxi'], ['टैक्सी', 'taxi'], ['ടാക്സി', 'taxi'], ['டாக்ஸி', 'taxi'], ['టాక్సీ', 'taxi'])),
  c('money', 'Money', 'Nouns', 'Shopping & Community', 'Severe', 'Global/Anterior', true, '💵', 'You use this to buy things or pay fare.', 'Rub fingers as if counting money.', '💵', ['🎫', '🚌', '📱'], w(['Money'], ['ಹಣ', 'hana'], ['पैसा', 'paisa'], ['പണം', 'panam'], ['பணம்', 'panam'], ['డబ్బు', 'dabbu'])),
  c('ticket', 'Ticket', 'Nouns', 'Transport & Navigation', 'Moderate', 'Posterior/Receptive', true, '🎫', 'A paper or digital pass for travel.', 'Hold imaginary ticket and show it.', '🎫', ['💵', '📄', '📱'], w(['Ticket'], ['ಟಿಕೆಟ್', 'ticket'], ['टिकट', 'ticket'], ['ടിക്കറ്റ്', 'ticket'], ['டிக்கெட்', 'ticket'], ['టికెట్', 'ticket'])),
  c('left', 'Left', 'Directions', 'Transport & Navigation', 'Severe', 'Posterior/Receptive', false, '⬅️', 'A direction on one side.', 'Point left and say the word.', '👈', ['➡️', '⬆️', '⛔'], w(['Left'], ['ಎಡ', 'eda'], ['बायाँ', 'baaya'], ['ഇടത്', 'idathu'], ['இடது', 'idathu'], ['ఎడమ', 'edama'])),
  c('right', 'Right', 'Directions', 'Transport & Navigation', 'Severe', 'Posterior/Receptive', false, '➡️', 'A direction on one side.', 'Point right and say the word.', '👉', ['⬅️', '⬆️', '⛔'], w(['Right'], ['ಬಲ', 'bala'], ['दायाँ', 'daaya'], ['വലത്', 'valathu'], ['வலது', 'valathu'], ['కుడి', 'kudi'])),
  c('straight', 'Straight', 'Directions', 'Transport & Navigation', 'Moderate', 'Posterior/Receptive', false, '⬆️', 'Go forward without turning.', 'Point forward.', '☝️', ['⬅️', '➡️', '⛔'], w(['Straight'], ['ನೇರ', 'nera'], ['सीधा', 'seedha'], ['നേരെ', 'nere'], ['நேராக', 'neraaga'], ['నేరుగా', 'neruga'])),
  c('stop', 'Stop', 'Directions', 'Basic Needs & Survival', 'Severe', 'Global', false, '⛔', 'Use this to make an action or vehicle halt.', 'Hold palm forward.', '✋', ['✅', '➡️', '➕'], w(['Stop'], ['ನಿಲ್ಲಿಸಿ', 'nillisi'], ['रुको', 'ruko'], ['നിര്‍ത്തുക', 'nirthuka'], ['நிறுத்து', 'niruthu'], ['ఆపు', 'aapu'])),
  c('eat', 'Eat', 'Verbs', 'High-Frequency Action Verbs', 'Severe', 'Anterior/Expressive', false, '🍽️', 'This action means putting food in the mouth.', 'Bring fingers to mouth.', '🤏', ['🥤', '🚶', '😴'], w(['Eat'], ['ತಿನ್ನು', 'tinnu'], ['खाना', 'khaana'], ['കഴിക്കുക', 'kazhikkuka'], ['சாப்பிடு', 'saappidu'], ['తిను', 'tinu'])),
  c('drink', 'Drink', 'Verbs', 'High-Frequency Action Verbs', 'Severe', 'Anterior/Expressive', false, '🥤', 'This action means taking liquid into the mouth.', 'Lift an imaginary cup to lips.', '🥤', ['🍽️', '🚶', '📞'], w(['Drink'], ['ಕುಡಿ', 'kudi'], ['पीना', 'peena'], ['കുടിക്കുക', 'kudikkuka'], ['குடி', 'kudi'], ['తాగు', 'taagu'])),
  c('sit', 'Sit', 'Verbs', 'High-Frequency Action Verbs', 'Severe', 'Anterior/Expressive', false, '🪑', 'This action means resting on a chair or bed.', 'Bend knees slightly.', '🧎', ['🚶', '🛏️', '✋'], w(['Sit'], ['ಕುಳಿತುಕೊಳ್ಳು', 'kulithukollu'], ['बैठना', 'baithna'], ['ഇരിക്കുക', 'irikkuka'], ['உட்கார்', 'utkaar'], ['కూర్చో', 'koorcho'])),
  c('stand', 'Stand', 'Verbs', 'High-Frequency Action Verbs', 'Severe', 'Anterior/Expressive', false, '🧍', 'This action means being upright on the feet.', 'Move hand upward.', '⬆️', ['🪑', '😴', '🚪'], w(['Stand'], ['ನಿಲ್ಲು', 'nillu'], ['खड़ा होना', 'khada hona'], ['നിൽക്കുക', 'nilkkuka'], ['நில்', 'nil'], ['నిలబడు', 'nilabadu'])),
  c('walk', 'Walk', 'Verbs', 'High-Frequency Action Verbs', 'Severe', 'Anterior/Expressive', false, '🚶', 'This action means moving on foot.', 'Move two fingers like legs.', '🚶', ['🪑', '📞', '✍️'], w(['Walk'], ['ನಡೆ', 'nade'], ['चलना', 'chalna'], ['നടക്കുക', 'nadakkuka'], ['நடு', 'nadu'], ['నడువు', 'naduvu'])),
  c('come', 'Come', 'Verbs', 'High-Frequency Action Verbs', 'Severe', 'Anterior/Expressive', false, '👋', 'This action asks someone to move toward you.', 'Beckon with hand.', '👋', ['➡️', '⛔', '🚶'], w(['Come'], ['ಬಾ', 'baa'], ['आओ', 'aao'], ['വരൂ', 'varoo'], ['வா', 'vaa'], ['రా', 'raa'])),
  c('go', 'Go', 'Verbs', 'High-Frequency Action Verbs', 'Severe', 'Anterior/Expressive', false, '➡️', 'This action means moving away or leaving.', 'Point away.', '👉', ['👋', '⛔', '🪑'], w(['Go'], ['ಹೋಗು', 'hogu'], ['जाओ', 'jao'], ['പോകൂ', 'pokoo'], ['போ', 'po'], ['వెళ్లు', 'vellu'])),
  c('give', 'Give', 'Verbs', 'High-Frequency Action Verbs', 'Severe', 'Anterior/Expressive', false, '🤲', 'This action means handing something to another person.', 'Extend hand outward.', '🤲', ['🤏', '📞', '🚪'], w(['Give'], ['ಕೊಡು', 'kodu'], ['देना', 'dena'], ['തരുക', 'tharuka'], ['கொடு', 'kodu'], ['ఇవ్వు', 'ivvu'])),
  c('take', 'Take', 'Verbs', 'High-Frequency Action Verbs', 'Severe', 'Anterior/Expressive', false, '🤏', 'This action means receiving or picking something up.', 'Pull hand toward yourself.', '🤏', ['🤲', '⛔', '📞'], w(['Take'], ['ತೆಗೆದುಕೊಳ್ಳು', 'tegedukollu'], ['लेना', 'lena'], ['എടുക്കുക', 'edukkuka'], ['எடு', 'edu'], ['తీసుకో', 'teesuko'])),
  c('open', 'Open', 'Verbs', 'High-Frequency Action Verbs', 'Moderate', 'Anterior/Expressive', false, '📂', 'This action means making something not closed.', 'Pretend to open a door or box.', '🚪', ['🔒', '📞', '🍽️'], w(['Open'], ['ತೆರೆ', 'tere'], ['खोलना', 'kholna'], ['തുറക്കുക', 'thurakkuka'], ['திற', 'thira'], ['తెరువు', 'teruvu'])),
  c('close', 'Close', 'Verbs', 'High-Frequency Action Verbs', 'Moderate', 'Anterior/Expressive', false, '🔒', 'This action means shutting something.', 'Pretend to close a door.', '🚪', ['📂', '➡️', '🪑'], w(['Close'], ['ಮುಚ್ಚು', 'mucchu'], ['बंद करना', 'band karna'], ['അടയ്ക്കുക', 'adaykkuka'], ['மூடு', 'moodu'], ['మూసు', 'moosu'])),
  c('call', 'Call', 'Verbs', 'High-Frequency Action Verbs', 'Moderate', 'Anterior/Expressive', true, '📞', 'This action means using a phone or calling a person.', 'Hold hand to ear like a phone.', '🤙', ['✍️', '🚶', '💊'], w(['Call'], ['ಕರೆ', 'kare'], ['बुलाना', 'bulana'], ['വിളിക്കുക', 'vilikkuka'], ['அழை', 'azhai'], ['పిలువు', 'piluvu'])),
  c('speak', 'Speak', 'Verbs', 'High-Frequency Action Verbs', 'Severe', 'Anterior/Expressive', false, '🗣️', 'This action means using words with your voice.', 'Point to mouth.', '🗣️', ['👂', '✍️', '📖'], w(['Speak'], ['ಮಾತನಾಡು', 'maatanadu'], ['बोलना', 'bolna'], ['സംസാരിക്കുക', 'samsarikkuka'], ['பேசு', 'pesu'], ['మాట్లాడు', 'maatlaadu'])),
  c('listen', 'Listen', 'Verbs', 'High-Frequency Action Verbs', 'Severe', 'Posterior/Receptive', false, '👂', 'This action means hearing carefully.', 'Cup hand behind ear.', '👂', ['🗣️', '✍️', '📖'], w(['Listen'], ['ಕೇಳು', 'kelu'], ['सुनना', 'sunna'], ['കേൾക്കുക', 'kelkkuka'], ['கேள்', 'kel'], ['విను', 'vinu'])),
  c('wash', 'Wash', 'Verbs', 'High-Frequency Action Verbs', 'Moderate', 'Anterior/Expressive', true, '🧼', 'This action means cleaning with water.', 'Rub hands together as if washing.', '🧼', ['🍽️', '😴', '📞'], w(['Wash'], ['ತೊಳೆಯು', 'toleyu'], ['धोना', 'dhona'], ['കഴുകുക', 'kazhukuka'], ['கழுவு', 'kazhuvu'], ['కడుగు', 'kadugu'])),
  c('bathe', 'Bathe', 'Verbs', 'High-Frequency Action Verbs', 'Moderate', 'Anterior/Expressive', true, '🚿', 'This action means washing the body.', 'Move hands over arms like bathing.', '🚿', ['🧼', '🍽️', '🚶'], w(['Bathe'], ['ಸ್ನಾನ', 'snana'], ['नहाना', 'nahana'], ['കുളിക്കുക', 'kulikkuka'], ['குளி', 'kuli'], ['స్నానం', 'snanam'])),
  c('happy', 'Happy', 'Emotions', 'Emotions & Social Pragmatics', 'Moderate', 'Mixed', false, '😊', 'A good feeling when pleased or joyful.', 'Smile gently and say the word.', '😊', ['😢', '😡', '😨'], w(['Happy'], ['ಸಂತೋಷ', 'santosha'], ['खुश', 'khush'], ['സന്തോഷം', 'santhosham'], ['மகிழ்ச்சி', 'magizhchi'], ['సంతోషం', 'santosham'])),
  c('sad', 'Sad', 'Emotions', 'Emotions & Social Pragmatics', 'Moderate', 'Mixed', false, '😢', 'A low feeling when upset or disappointed.', 'Make a sad face and say the word.', '😢', ['😊', '😡', '😨'], w(['Sad'], ['ದುಃಖ', 'duhkha'], ['दुखी', 'dukhi'], ['ദുഃഖം', 'duhkham'], ['வருத்தம்', 'varutham'], ['దుఃఖం', 'dukham'])),
  c('angry', 'Angry', 'Emotions', 'Emotions & Social Pragmatics', 'Moderate', 'Mixed', false, '😡', 'A strong feeling when upset or irritated.', 'Make a firm face and say the word.', '😡', ['😊', '😢', '😴'], w(['Angry'], ['ಕೋಪ', 'kopa'], ['गुस्सा', 'gussa'], ['കോപം', 'kopam'], ['கோபம்', 'kobam'], ['కోపం', 'kopam'])),
  c('afraid', 'Afraid', 'Emotions', 'Emotions & Social Pragmatics', 'Moderate', 'Mixed', false, '😨', 'A feeling when scared or unsafe.', 'Hold hands close to chest.', '😨', ['😊', '😡', '😴'], w(['Afraid'], ['ಭಯ', 'bhaya'], ['डर', 'dar'], ['ഭയം', 'bhayam'], ['பயம்', 'bayam'], ['భయం', 'bhayam'])),
  c('tired', 'Tired', 'Emotions', 'Emotions & Social Pragmatics', 'Severe', 'Global/Anterior', false, '🥱', 'A feeling when the body needs rest.', 'Rub eyes or lean head slightly.', '🥱', ['😊', '🍽️', '🔥'], w(['Tired'], ['ದಣಿವು', 'danivu'], ['थकान', 'thakaan'], ['ക്ഷീണം', 'ksheenam'], ['சோர்வு', 'sorvu'], ['అలసట', 'alasata'])),
  c('please', 'Please', 'Social Pragmatics', 'Emotions & Social Pragmatics', 'Moderate', 'Anterior/Expressive', false, '🙏', 'A polite word used when requesting.', 'Join hands or use a polite hand gesture.', '🙏', ['✅', '❌', '💵'], w(['Please'], ['ದಯವಿಟ್ಟು', 'dayavittu'], ['कृपया', 'kripya'], ['ദയവായി', 'dayavayi'], ['தயவு செய்து', 'thayavu seithu'], ['దయచేసి', 'dayachesi'])),
  c('thank-you', 'Thank You', 'Social Pragmatics', 'Emotions & Social Pragmatics', 'Moderate', 'Anterior/Expressive', false, '🙏', 'A polite phrase used after receiving help.', 'Join hands briefly and say the word.', '🙏', ['👋', '❌', '🆘'], w(['Thank you'], ['ಧನ್ಯವಾದ', 'dhanyavada'], ['धन्यवाद', 'dhanyavaad'], ['നന്ദി', 'nandi'], ['நன்றி', 'nandri'], ['ధన్యవాదాలు', 'dhanyavadalu'])),
  c('sorry', 'Sorry', 'Social Pragmatics', 'Emotions & Social Pragmatics', 'Mild', 'Anterior/Expressive', false, '🙏', 'A polite word used to apologize.', 'Touch chest lightly and say the word.', '🙏', ['😊', '🆘', '✅'], w(['Sorry'], ['ಕ್ಷಮಿಸಿ', 'kshamisi'], ['माफ़ कीजिए', 'maaf kijiye'], ['ക്ഷമിക്കണം', 'kshamikkanam'], ['மன்னிக்கவும்', 'mannikkavum'], ['క్షమించండి', 'kshaminchandi'])),
  c('shirt', 'Shirt', 'Nouns', 'Clothing & Weather', 'Moderate', 'Posterior/Receptive', true, '👕', 'A clothing item worn on the upper body.', 'Point to upper body clothing.', '👕', ['👖', '👟', '🧣'], w(['Shirt'], ['ಶರ್ಟ್', 'shirt'], ['कमीज़', 'kameez'], ['ഷർട്ട്', 'shirt'], ['சட்டை', 'sattai'], ['షర్ట్', 'shirt'])),
  c('pants', 'Pants', 'Nouns', 'Clothing & Weather', 'Moderate', 'Posterior/Receptive', true, '👖', 'A clothing item worn on the legs.', 'Point to legs.', '👖', ['👕', '👟', '🧢'], w(['Pants'], ['ಪ್ಯಾಂಟ್', 'pant'], ['पैंट', 'pant'], ['പാന്റ്', 'pant'], ['பேன்ட்', 'pant'], ['ప్యాంట్', 'pant'])),
  c('saree', 'Saree', 'Nouns', 'Clothing & Weather', 'Moderate', 'Posterior/Receptive', true, '🥻', 'A traditional Indian garment worn by many women.', 'Gesture draping cloth over shoulder.', '🥻', ['👕', '👖', '🧣'], w(['Saree'], ['ಸೀರೆ', 'seere'], ['साड़ी', 'saari'], ['സാരി', 'sari'], ['சேலை', 'selai'], ['చీర', 'cheera'])),
  c('rain', 'Rain', 'Nouns', 'Clothing & Weather', 'Moderate', 'Posterior/Receptive', true, '🌧️', 'Water falling from the sky during monsoon or rainy weather.', 'Move fingers downward like rain.', '🌧️', ['☀️', '🔥', '❄️'], w(['Rain'], ['ಮಳೆ', 'male'], ['बारिश', 'baarish'], ['മഴ', 'mazha'], ['மழை', 'mazhai'], ['వర్షం', 'varsham'])),
  c('sun', 'Sun', 'Nouns', 'Clothing & Weather', 'Moderate', 'Posterior/Receptive', true, '☀️', 'The bright hot object in the sky during daytime.', 'Point upward and make a circle.', '☀️', ['🌧️', '🌙', '❄️'], w(['Sun'], ['ಸೂರ್ಯ', 'soorya'], ['सूरज', 'suraj'], ['സൂര്യൻ', 'sooryan'], ['சூரியன்', 'sooriyan'], ['సూర్యుడు', 'sooryudu']))
];

export function buildStimuliForLanguage(lang: LangCode): LanguageStimuli {
  const items: StimulusItem[] = concepts.map((concept) => {
    const [word, translit] = concept.words[lang];
    return {
      id: `${lang}-${concept.slug}`,
      conceptTag: concept.conceptTag,
      category: concept.category,
      subCategory: concept.subCategory,
      severityGrade: concept.severityGrade,
      lesionProfileTarget: concept.lesionProfileTarget,
      culturalRelevance: concept.culturalRelevance,
      word,
      translit,
      emoji: concept.emoji,
      semanticCue: concept.semanticCue,
      phonologicalCue: `${word} starts with /${firstCue(word, translit)}/.`,
      gesture: concept.gesture,
      gestureEmoji: concept.gestureEmoji,
      distractorEmojis: concept.distractorEmojis,
    };
  });

  return {
    lang,
    items,
  };
}

export function getClinicalStimulusCount(): number {
  return concepts.length;
}
