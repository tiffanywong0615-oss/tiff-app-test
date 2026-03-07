export async function translateText(text: string, source = 'zh', target = 'en'): Promise<string> {
  if (!text || !text.trim()) return text;
  try {
    const langPair = `${source}|${target}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
    const res = await fetch(url);
    if (!res.ok) return text;
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    if (translated && translated !== text) return translated;
    return text;
  } catch {
    return text;
  }
}