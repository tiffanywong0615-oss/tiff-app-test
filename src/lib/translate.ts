export async function translateText(text: string, source = 'auto', target = 'en'): Promise<string> {
  if (!text.trim()) return text;
  try {
    const res = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source, target, format: 'text' }),
    });
    if (!res.ok) return text;
    const data = await res.json();
    return data.translatedText || text;
  } catch {
    return text;
  }
}
