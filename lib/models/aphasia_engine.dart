class AphasiaEngine {
  static Map<String, dynamic> calculateAQ(double f, double c, double r, double n) {
    double aq = (f + c + r + n) * 2.5;
    String type = "Undefined";

    if (aq < 25) type = "Global Aphasia";
    else if (f < 5 && c >= 5) type = "Broca's Aphasia";
    else if (f >= 5 && c < 5) type = "Wernicke's Aphasia";
    else if (r < 5) type = "Conduction Aphasia";
    else type = "Anomic Aphasia";

    return {"aq": aq, "type": type};
  }
}
