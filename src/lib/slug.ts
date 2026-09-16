const ARABIC_DICTIONARY: Record<string, string> = {
  عباية: "abaya",
  عباءة: "abaya",
  رجالي: "men",
  نسائي: "women",
  حريمي: "women",
  مصحف: "quran",
  قرآن: "quran",
  سبحة: "sebha",
  سجادة: "prayer-rug",
  صلاة: "prayer",
  عطر: "perfume",
  عطور: "perfumes",
  عود: "oud",
  بخور: "bukhoor",
  مسك: "musk",
  سواك: "miswak",
  هدايا: "gifts",
  هدية: "gift",
  تحف: "decor",
  فاخر: "luxury",
  فاخرة: "luxury",
  ملكي: "royal",
  كلاسيكي: "classic",
  تركي: "turkish",
  سعودي: "saudi",
  تجويد: "tajweed",
  كريستال: "crystal",
  عنبر: "amber",
  طبيعي: "natural",
  شيفون: "chiffon",
  كريب: "crepe",
};

export function generateSlug(title: string, customSlug?: string): string {
  if (customSlug && customSlug.trim().length > 0) {
    return customSlug
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const words = title
    .trim()
    .toLowerCase()
    .split(/\s+/);

  const translatedWords: string[] = [];

  for (const word of words) {
    const cleanWord = word.replace(/[^\u0621-\u064A\w]/g, "");
    if (ARABIC_DICTIONARY[cleanWord]) {
      translatedWords.push(ARABIC_DICTIONARY[cleanWord]);
    } else if (/^[a-z0-9]+$/i.test(cleanWord)) {
      translatedWords.push(cleanWord.toLowerCase());
    }
  }

  const randomSuffix = Math.random().toString(36).substring(2, 6);

  if (translatedWords.length > 0) {
    return `${translatedWords.slice(0, 4).join("-")}-${randomSuffix}`;
  }

  // Fallback if no dictionary match: transliterate or use short timestamp
  return `item-${Date.now().toString(36)}-${randomSuffix}`;
}
