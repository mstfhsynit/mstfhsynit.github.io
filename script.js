async function teach() {
  const topic = document.getElementById("topic").value.trim();
  const level = document.getElementById("level").value;
  const result = document.getElementById("result");

  if (!topic) {
    result.innerText = "Lütfen bir konu yaz.";
    return;
  }

  result.innerText = "Bilgi getiriliyor... ⏳";

  const url = `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.extract) {
      result.innerText = "Bu konu hakkında bilgi bulunamadı 😕";
      return;
    }

    let text = data.extract;

    // Seviye basitleştirme
    if (level === "ilkokul") {
      text = text.split(".").slice(0, 2).join(".") + ".";
    }
    if (level === "ortaokul") {
      text = text.split(".").slice(0, 3).join(".") + ".";
    }
    if (level === "lise") {
      text = text.split(".").slice(0, 5).join(".") + ".";
    }

    result.innerText =
      `📌 Konu: ${data.title}\n\n` +
      text +
      `\n\n📚 Kaynak: Wikipedia`;

  } catch (err) {
    result.innerText = "Bir hata oluştu 😕";
  }
}
