async function teach() {
  let topic = document.getElementById("topic").value.trim().toLowerCase();
  const level = document.getElementById("level").value;
  const result = document.getElementById("result");

  if (!topic) {
    result.innerText = "Bir konu yazmalısın 🙂";
    return;
  }

  // "nedir" gibi ekleri temizle
  topic = topic
    .replace("nedir", "")
    .replace("ne demek", "")
    .trim();

  result.innerText = "Bilgi getiriliyor... 📚";

  try {
    const url =
      `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;

    const res = await fetch(url);

    if (!res.ok) {
      result.innerText = "Bu konu hakkında bilgi bulunamadı 😕";
      return;
    }

    const data = await res.json();

    if (!data.extract) {
      result.innerText = "Bu konu hakkında özet bulunamadı 😕";
      return;
    }

    let text = data.extract;

    // Seviye sadeleştirme
    const sentences = text.split(".");
    if (level === "ilkokul") text = sentences.slice(0, 2).join(".") + ".";
    if (level === "ortaokul") text = sentences.slice(0, 3).join(".") + ".";
    if (level === "lise") text = sentences.slice(0, 5).join(".") + ".";
    if (level === "universite") text = sentences.join(".") + ".";

    result.innerText =
      `📌 Konu: ${data.title}\n\n` +
      text +
      `\n\n🌐 Kaynak: Wikipedia`;

  } catch (e) {
    result.innerText = "Bir hata oluştu 😕";
  }
}
