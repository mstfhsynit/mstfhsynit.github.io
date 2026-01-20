async function teach() {
  const topic = document.getElementById("topic").value.trim();
  const level = document.getElementById("level").value;
  const result = document.getElementById("result");

  if (!topic) {
    result.innerText = "Bir şey yazmalısın 🙂";
    return;
  }

  result.innerText = "Aranıyor... 🔍";

  try {
    // DuckDuckGo Instant Answer API (CORS için proxy)
    const url = `https://api.allorigins.win/raw?url=` +
      encodeURIComponent(
        `https://api.duckduckgo.com/?q=${topic}&format=json&no_redirect=1`
      );

    const res = await fetch(url);
    const data = await res.json();

    let text = "";

    if (data.AbstractText) {
      text = data.AbstractText;
    } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      text = data.RelatedTopics[0].Text;
    }

    if (!text) {
      result.innerText = "Bu arama için özet bulunamadı 😕";
      return;
    }

    // Seviye sadeleştirme
    const sentences = text.split(".");
    if (level === "ilkokul") text = sentences.slice(0, 2).join(".") + ".";
    if (level === "ortaokul") text = sentences.slice(0, 3).join(".") + ".";
    if (level === "lise") text = sentences.slice(0, 5).join(".") + ".";
    if (level === "universite") text = sentences.join(".") + ".";

    result.innerText =
      `🔎 Arama: ${topic}\n\n` +
      text +
      `\n\n🌐 Kaynak: DuckDuckGo / Açık Web`;

  } catch (e) {
    result.innerText = "Bir hata oluştu 😕";
  }
}
