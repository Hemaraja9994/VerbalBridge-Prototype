import 'package:cloud_firestore/cloud_firestore.dart';

class FirebaseService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Data Storage (Privacy compliant for DPDP Act)
  Future<void> saveClinicalSession(String patientId, Map<String, dynamic> data) async {
    await _db.collection('sessions').doc(patientId).set(data);
  }
}
