const lessons = {
  "turev": {
    lise: {
      explain: [
        "Türev, bir şeyin zamanla ne kadar hızlı değiştiğini gösterir.",
        "Türev, bir grafikteki eğimi ifade eder."
      ],
      example: [
        "Bir arabanın hız göstergesi türeve örnektir.",
        "f(x)=x² ise türevi f'(x)=2x olur."
      ]
    },
    universite: {
      explain: [
        "Türev, limit kavramı kullanılarak tanımlanan matematiksel bir işlemdir.",
        "Türev, bir fonksiyonun anlık değişim oranını verir."
      ],
      example: [
        "lim h→0 (f(x+h)-f(x))/h ifadesi türev tanımıdır.",
        "f(x)=x³ → f'(x)=3x²"
      ]
    }
  },

  "fotosentez": {
    ortaokul: {
      explain: [
        "Fotosentez, bitkilerin güneş ışığını kullanarak besin üretmesidir.",
        "Bitkiler fotosentez sayesinde kendi yiyeceklerini yapar."
      ],
      example: [
        "Bitkilerin yaprakları fotosentez yapar.",
        "Güneş ışığı olmazsa fotosentez gerçekleşmez."
      ]
    },
    lise: {
      explain: [
        "Fotosentez, klorofil yardımıyla gerçekleşen kimyasal bir süreçtir.",
        "Bu süreçte karbondioksit ve su kullanılır."
      ],
      example: [
        "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
        "Bu tepkime yapraklarda gerçekleşir."
      ]
    }
  }
};

function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replaceAll("ü", "u")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ç", "c");
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function teach() {
  const topicInput = document.getElementById("topic").value;
  const topic = normalizeText(topicInput);
  const level = document.getElementById("level").value;
  const result = document.getElementById("result");

  if (!lessons[topic]) {
    result.innerText = "Bu konuyu henüz bilmiyorum 😕";
    return;
  }

  if (!lessons[topic][level]) {
    result.innerText =
      "Bu konu için bu seviyede içerik yok.\nMevcut seviyeler:\n" +
      Object.keys(lessons[topic]).join(", ");
    return;
  }

  const data = lessons[topic][level];

  result.innerText =
    random(data.explain) +
    "\n\nÖrnek:\n" +
    random(data.example);
}
