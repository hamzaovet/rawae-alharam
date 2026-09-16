"use server";

export async function generateProductDescription(
  title: string,
  categoryName?: string
): Promise<{ description?: string; error?: string }> {
  if (!title || title.trim().length === 0) {
    return { error: "يرجى كتابة اسم المنتج أولاً لتوليد الوصف" };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      description: `${title} - تحفة إسلامية فاخرة صُممت بأعلى معايير الجودة والإتقان، تمنحك إطلالة راقية ولمسة روحانية مميزة تليق بمناسباتك وهداياك.`,
    };
  }

  const prompt = `أنت خبير كتابة محتوى تسويقي لمتجر إسلامي فاخر اسمه "روائع الحرم" بالقاهرة.
اكتب وصفاً تسويقياً موجزاً وجذاباً (في سطرين إلى 3 أسطر كحد أقصى) بدون مقدمات أو خاتمة لمنتج اسمه: "${title}"${
    categoryName ? ` وينتمي لقسم: "${categoryName}"` : ""
  }.
ركز على الجودة العالية، الفخامة، واللمسة الروحانية الأصيلة. اكتب النص مباشرة بدون علامات تنصيص.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text && text.trim().length > 0) {
      return { description: text.trim() };
    }
  } catch (e) {
    console.error("Gemini AI API Error:", e);
  }

  // Fallback high-quality template if API call fails
  return {
    description: `${title} - قطعة فاخرة مستوحاة من عراقة التراث الإسلامي، صُنعت بعناية واهتمام بالتفاصيل لتكون خيارك الأمثل للاقتناء الشخصي أو الإهداء الراقي.`,
  };
}
