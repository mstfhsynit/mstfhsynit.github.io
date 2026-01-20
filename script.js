async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function teach() {
  let topic = document.getElementById("topic").value.trim().toLowerCase();
  const level = document.getElementById("level").value;
  const result = document.getElementById("result");

  if (!topic) {
    result.innerText = "Bir konu yazmalısın 🙂";
    return;
  }

  // Anlık veri kontrolü
  const realtimeKeywords = ["hava", "hava durumu", "kaç derece", "saat", "tarih"];
  if (realtimeKeywords.some(k => topic.includes(k))) {
    result.innerText =
      "⏱️ Bu konu anlık veri gerektirir.\n" +
      "Bu sistem ücretsiz olduğu için canlı veri çekemez.";
    return;
  }

  result.innerText = "Aranıyor... 🔍";

  let text = "";

  // 1️⃣ DuckDuckGo (timeout'lu)
  try {
    const ddgUrl =
      "https://api.allorigins.win/raw?url=" +
      encodeURIComponent(
        `https://api.duckduckgo.com/?q=${topic}&format=json&no_redirect=1`
      );

    const res = await fetchWithTimeout(ddgUrl, 5000);
    const data = await res.json();

    if (data.AbstractText) {
      text = data.AbstractText;
    } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      text = data.RelatedTopics[0].Text;
    }
  } catch (e) {
    console.log("DuckDuckGo zaman aşımı");
  }

  // 2️⃣ Wikipedia yedek
  if (!text) {
    try {
      const wikiUrl =
        `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
      const wikiRes = await fetchWithTimeout(wikiUrl, 5000);
      const wikiData = await wikiRes.json();

      if (wikiData.extract) {
        text = wikiData.extract;
      }
    } catch (e) {
      console.log("Wikipedia zaman aşımı");
    }
  }

  if (!text) {
    result.innerText =
      "Bilgi bulunamadı 😕\n" +
      "Daha genel bir terim dene.";
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
}
