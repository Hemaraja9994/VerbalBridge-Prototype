// ADD THIS SECTION TO YOUR DASHBOARD UI
Widget _languageSelector() {
  return GlassCard(
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        _langBtn('KN', 'kn'),
        _langBtn('TA', 'ta'),
        _langBtn('TE', 'te'),
        _langBtn('ML', 'ml'),
        _langBtn('EN', 'en'),
      ],
    ),
  );
}

Widget _langBtn(String label, String code) {
  return GestureDetector(
    onTap: () {
      // Set the active language in your provider
      Provider.of<AphasiaProfileProvider>(context, listen: false).setLanguage(code);
    },
    child: CircleAvatar(
      backgroundColor: Colors.orange.withOpacity(0.2),
      child: Text(label, style: TextStyle(color: Colors.white, fontSize: 12)),
    ),
  );
}
