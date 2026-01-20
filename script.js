async function teach() {
  let topic = document.getElementById("topic").value.trim();
  const level = document.getElementById("level").value;
  const result = document.getElementById("result");

  if (!topic) {
    result.innerText = "Bir konu yazmalısın 🙂";
    return;
  }

  // Basit yazım düzeltme
  topic = topic
    .toLowerCase()
    .replace("nedeir", "nedir")
    .replace("nedri", "nedir")
    .replace("nedirr", "nedir");

  result.innerText = "Aranıyor... 🔍";

  try {
    // Önce DuckDuckGo
    const ddgUrl =
      "https://api.allorigins.win/raw?url=" +
      encodeURIComponent(
        `https://api.duckduckgo.com/?q=${topic}&format=json&no_redirect=1`
      );

    const res = await fetch(ddgUrl);
    const data = await res.json();

    let text = "";

    if (data.AbstractText) {
      text = data.AbstractText;
    } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      text = data.RelatedTopics[0].Text;
    }

    // DuckDuckGo boşsa → Wikipedia
    if (!text) {
      const wikiUrl = `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
      const wikiRes = await fetch(wikiUrl);
      const wikiData = await wikiRes.json();

      if (wikiData.extract) {
        text = wikiData.extract;
      }
    }

    if (!text) {
      result.innerText = "Bu arama için bilgi bulunamadı 😕";
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
      `\n\n🌐 Kaynak: Açık Web`;

  } catch (err) {
    result.innerText = "Bir hata oluştu 😕";
  }
}
