import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updates = [
  // ─── SMARTPHONES ────────────────────────────────────────────────────────────
  {
    slug: "iphone-15-pro",
    images: ["/uploads/iphone-15-pro.png"],
    specs: {
      "Дисплей": "6.1\" Super Retina XDR OLED, ProMotion 1–120 Гц, 2556×1179, 460 ppi",
      "Процессор": "Apple A17 Pro (3 нм), 6-ядерный CPU + 6-ядерный GPU",
      "ОЗУ": "8 ГБ",
      "Память": "256 ГБ",
      "Основная камера": "48 МП f/1.78 (главная) + 12 МП f/2.2 (ультра) + 12 МП f/2.8 3× зум",
      "Фронтальная камера": "12 МП TrueDepth f/1.9",
      "Аккумулятор": "3274 мАч, USB‑C (USB 3), MagSafe 15 Вт",
      "ОС": "iOS 17",
      "Корпус": "Титан Grade 5, Ceramic Shield",
      "Защита": "IP68 (6 м / 30 мин)",
      "Связь": "5G, Wi‑Fi 6E, Bluetooth 5.3, Ultra Wideband",
      "Вес": "187 г",
    },
  },
  {
    slug: "iphone-15",
    images: ["/uploads/iphone-15.png"],
    specs: {
      "Дисплей": "6.1\" Super Retina XDR OLED, 60 Гц, 2556×1179, 460 ppi",
      "Процессор": "Apple A16 Bionic (4 нм), 6-ядерный CPU",
      "ОЗУ": "6 ГБ",
      "Память": "128 ГБ",
      "Основная камера": "48 МП f/1.6 (главная) + 12 МП f/2.4 (ультра)",
      "Фронтальная камера": "12 МП TrueDepth f/1.9",
      "Аккумулятор": "3349 мАч, USB‑C, MagSafe 15 Вт",
      "ОС": "iOS 17",
      "Корпус": "Алюминий, Ceramic Shield",
      "Защита": "IP68 (6 м / 30 мин)",
      "Связь": "5G, Wi‑Fi 6, Bluetooth 5.3",
      "Вес": "171 г",
    },
  },
  {
    slug: "samsung-galaxy-s24-ultra",
    images: ["/uploads/samsung-s24-ultra.jpg"],
    specs: {
      "Дисплей": "6.8\" Dynamic AMOLED 2X, LTPO 1–120 Гц, QHD+ 3088×1440, 505 ppi",
      "Процессор": "Snapdragon 8 Gen 3 (4 нм), 8-ядерный",
      "ОЗУ": "12 ГБ",
      "Память": "256 ГБ",
      "Основная камера": "200 МП f/1.7 + 50 МП перископ 5× + 10 МП 3× + 12 МП ультра",
      "Фронтальная камера": "12 МП f/2.2",
      "S Pen": "Встроенный",
      "Аккумулятор": "5000 мАч, 45 Вт проводная / 15 Вт беспроводная",
      "ОС": "Android 14 + One UI 6.1 (Galaxy AI)",
      "Защита": "IP68, Gorilla Glass Armor",
      "Связь": "5G, Wi‑Fi 6E, Bluetooth 5.3",
      "Вес": "232 г",
    },
  },
  {
    slug: "samsung-galaxy-s24",
    images: ["/uploads/samsung-s24.jpg"],
    specs: {
      "Дисплей": "6.2\" Dynamic AMOLED 2X, 1–120 Гц, FHD+ 2340×1080, 416 ppi",
      "Процессор": "Snapdragon 8 Gen 3 (4 нм)",
      "ОЗУ": "8 ГБ",
      "Память": "128 ГБ",
      "Основная камера": "50 МП f/1.8 + 12 МП ультра + 10 МП 3× зум",
      "Фронтальная камера": "12 МП f/2.2",
      "Аккумулятор": "4000 мАч, 25 Вт проводная / 15 Вт беспроводная",
      "ОС": "Android 14 + One UI 6.1",
      "Защита": "IP68, Gorilla Glass Victus 2",
      "Связь": "5G, Wi‑Fi 6E, Bluetooth 5.3",
      "Вес": "167 г",
    },
  },
  {
    slug: "google-pixel-8-pro",
    images: ["/uploads/placeholder.jpg"],
    specs: {
      "Дисплей": "6.7\" LTPO OLED, 1–120 Гц, QHD+ 2992×1344, 489 ppi, 2400 нит",
      "Процессор": "Google Tensor G3 (4 нм)",
      "ОЗУ": "12 ГБ",
      "Память": "128 ГБ",
      "Основная камера": "50 МП f/1.68 (главная) + 48 МП f/1.95 (ультра) + 48 МП f/2.8 5× перископ",
      "Фронтальная камера": "10.5 МП f/2.2",
      "Аккумулятор": "5050 мАч, 30 Вт проводная / 23 Вт беспроводная",
      "ОС": "Android 14, 7 лет обновлений",
      "Защита": "IP68, Corning Gorilla Glass Victus 2",
      "Связь": "5G, Wi‑Fi 7, Bluetooth 5.3",
      "Вес": "213 г",
    },
  },
  {
    slug: "xiaomi-14",
    images: ["/uploads/xiaomi-14.jpg"],
    specs: {
      "Дисплей": "6.36\" AMOLED LTPO, 1–120 Гц, FHD+ 2670×1200, 460 ppi, 3000 нит",
      "Процессор": "Snapdragon 8 Gen 3 (4 нм)",
      "ОЗУ": "12 ГБ",
      "Память": "256 ГБ",
      "Оптика": "Leica Summilux",
      "Основная камера": "50 МП f/1.6 + 50 МП ультра f/2.0 + 50 МП 3.2× зум f/2.0",
      "Аккумулятор": "4610 мАч, HyperCharge 90 Вт / 50 Вт беспроводная",
      "ОС": "Xiaomi HyperOS (Android 14)",
      "Защита": "IP68, Xiaomi Shield Glass",
      "Связь": "5G, Wi‑Fi 7, Bluetooth 5.4",
      "Вес": "193 г",
    },
  },

  // ─── LAPTOPS ────────────────────────────────────────────────────────────────
  {
    slug: "macbook-pro-14-m3-pro",
    images: ["/uploads/macbook-pro-14-m3.png"],
    specs: {
      "Дисплей": "14.2\" Liquid Retina XDR, ProMotion 120 Гц, 3024×1964, 254 ppi, 1600 нит",
      "Процессор": "Apple M3 Pro, 12-ядерный CPU (6P+6E)",
      "Видеокарта": "18-ядерный GPU",
      "ОЗУ": "18 ГБ унифицированной памяти",
      "Накопитель": "512 ГБ SSD",
      "Порты": "3× Thunderbolt 4, HDMI 2.1, SD‑card, MagSafe 3, AUX",
      "Звук": "6 динамиков, Spatial Audio",
      "Аккумулятор": "До 18 часов работы, 96 Вт USB‑C",
      "ОС": "macOS Sonoma",
      "Вес": "1.61 кг",
    },
  },
  {
    slug: "macbook-air-15-m3",
    images: ["/uploads/macbook-air-15-m3.jpg"],
    specs: {
      "Дисплей": "15.3\" Liquid Retina, 60 Гц, 2880×1864, 224 ppi, 500 нит",
      "Процессор": "Apple M3, 8-ядерный CPU (4P+4E)",
      "Видеокарта": "10-ядерный GPU",
      "ОЗУ": "8 ГБ унифицированной памяти",
      "Накопитель": "256 ГБ SSD",
      "Порты": "2× Thunderbolt / USB 4, MagSafe 3, AUX",
      "Звук": "6 динамиков, Spatial Audio",
      "Аккумулятор": "До 18 часов работы, 70 Вт USB‑C",
      "ОС": "macOS Sonoma",
      "Вес": "1.51 кг",
    },
  },
  {
    slug: "samsung-galaxy-book4-pro",
    images: ["/uploads/placeholder.jpg"],
    specs: {
      "Дисплей": "14\" Dynamic AMOLED 2X, 120 Гц, 2880×1800",
      "Процессор": "Intel Core Ultra 7 155H (до 4.8 ГГц, 16 ядер)",
      "Видеокарта": "Intel Arc Graphics",
      "ОЗУ": "16 ГБ LPDDR5x",
      "Накопитель": "512 ГБ NVMe SSD",
      "Порты": "Thunderbolt 4, USB‑A 3.2, HDMI, AUX, SD‑card",
      "Аккумулятор": "До 22 часов, 65 Вт USB‑C",
      "ОС": "Windows 11 Home",
      "Вес": "1.24 кг",
    },
  },

  // ─── TABLETS ────────────────────────────────────────────────────────────────
  {
    slug: "ipad-pro-13-m4",
    images: ["/uploads/ipad-pro-13-m4.png"],
    specs: {
      "Дисплей": "13\" Ultra Retina XDR OLED (тандем), ProMotion 120 Гц, 2752×2064, 264 ppi, 1600 нит",
      "Процессор": "Apple M4, 10-ядерный CPU + 10-ядерный GPU",
      "ОЗУ": "8 ГБ унифицированной памяти",
      "Накопитель": "256 ГБ",
      "Камера": "12 МП, видео 4K 60 fps",
      "Фронтальная камера": "12 МП TrueDepth, Landscape",
      "Подключение": "Wi‑Fi 6E, опционально 5G",
      "Apple Pencil": "Pro (магнитный, хаптика)",
      "Толщина": "5.1 мм (самый тонкий Apple-продукт)",
      "Вес": "582 г",
    },
  },
  {
    slug: "ipad-air-11-m2",
    images: ["/uploads/ipad-air-11-m2.png"],
    specs: {
      "Дисплей": "11\" Liquid Retina, 60 Гц, 2360×1640, 264 ppi, True Tone, P3",
      "Процессор": "Apple M2, 8-ядерный CPU + 9-ядерный GPU",
      "ОЗУ": "8 ГБ",
      "Накопитель": "128 ГБ",
      "Камера": "12 МП, видео 4K",
      "Фронтальная камера": "12 МП TrueDepth, Landscape",
      "Подключение": "Wi‑Fi 6E, USB‑C (USB 3)",
      "Apple Pencil": "USB‑C и Pro",
      "Вес": "462 г",
    },
  },
  {
    slug: "samsung-galaxy-tab-s9-ultra",
    images: ["/uploads/samsung-tab-s9-ultra.jpg"],
    specs: {
      "Дисплей": "14.6\" Dynamic AMOLED 2X, 120 Гц, 2960×1848, 240 ppi",
      "Процессор": "Snapdragon 8 Gen 2 (4 нм)",
      "ОЗУ": "12 ГБ",
      "Накопитель": "256 ГБ (microSD до 1 ТБ)",
      "Камера": "13 МП + 8 МП (ультра)",
      "Фронтальная камера": "12 МП + 12 МП",
      "S Pen": "В комплекте",
      "Аккумулятор": "11200 мАч, 45 Вт",
      "Защита": "IP68, Gorilla Glass Victus",
      "Вес": "732 г",
    },
  },
  {
    slug: "xiaomi-pad-6",
    images: ["/uploads/xiaomi-pad-6.jpg"],
    specs: {
      "Дисплей": "11\" IPS LCD, 144 Гц, 2880×1800, 309 ppi",
      "Процессор": "Snapdragon 870 (7 нм)",
      "ОЗУ": "8 ГБ LPDDR5",
      "Накопитель": "256 ГБ UFS 3.1",
      "Камера": "13 МП",
      "Фронтальная камера": "8 МП",
      "Аккумулятор": "8840 мАч, 33 Вт",
      "Звук": "4 динамика Dolby Atmos",
      "Подключение": "Wi‑Fi 6, Bluetooth 5.2",
      "Вес": "490 г",
    },
  },

  // ─── HEADPHONES ─────────────────────────────────────────────────────────────
  {
    slug: "airpods-pro-2",
    images: ["/uploads/airpods-pro-2.png"],
    specs: {
      "Тип": "TWS вкладыши",
      "Чип": "Apple H2",
      "Шумоподавление": "Адаптивное ANC + Адаптивная прозрачность",
      "Аккумулятор": "6 ч (до 30 ч с чехлом MagSafe)",
      "Быстрая зарядка": "5 мин → 1 ч прослушивания",
      "Защита": "IPX4 (вкладыши и чехол)",
      "Spatial Audio": "Да, с отслеживанием движений головы",
      "Разъём чехла": "Lightning / USB‑C (в зависимости от версии)",
      "Голосовой ассистент": "Siri hands-free",
    },
  },
  {
    slug: "sony-wh-1000xm5",
    images: ["/uploads/sony-wh-1000xm5.jpg"],
    specs: {
      "Тип": "Полноразмерные накладные, Bluetooth",
      "Шумоподавление": "HD Noise Cancelling, 8 микрофонов",
      "Драйвер": "30 мм",
      "Аккумулятор": "30 ч (ANC вкл.) / 3 мин зарядки → 3 ч прослушивания",
      "Кодеки": "LDAC, AAC, SBC",
      "Multipoint": "2 устройства одновременно",
      "360 Reality Audio": "Да",
      "Вес": "250 г",
      "Складная конструкция": "Нет (плоское сложение)",
    },
  },
  {
    slug: "sony-wf-1000xm5",
    images: ["/uploads/placeholder.jpg"],
    specs: {
      "Тип": "TWS вкладыши",
      "Шумоподавление": "HD Noise Cancelling, 8 микрофонов",
      "Драйвер": "8.4 мм",
      "Аккумулятор": "8 ч (до 24 ч с кейсом) / 5 мин → 60 мин",
      "Кодеки": "LDAC, AAC, SBC",
      "Защита": "IPX4",
      "Вес": "5.9 г (каждый вкладыш)",
      "360 Reality Audio": "Да",
    },
  },
  {
    slug: "samsung-galaxy-buds3-pro",
    images: ["/uploads/placeholder.jpg"],
    specs: {
      "Тип": "TWS вкладыши (blade-дизайн)",
      "Шумоподавление": "Intelligent ANC",
      "Драйвер": "10.5 мм вуфер + 6.1 мм твитер",
      "Аккумулятор": "6 ч (до 30 ч с кейсом)",
      "Кодеки": "SSC HiFi 24-бит, AAC, SBC",
      "Защита": "IPX7",
      "360 Audio": "Да, с отслеживанием головы",
      "Разъём кейса": "USB‑C + беспроводная зарядка",
    },
  },

  // ─── WATCHES ────────────────────────────────────────────────────────────────
  {
    slug: "apple-watch-ultra-2",
    images: ["/uploads/apple-watch-ultra-2.jpg"],
    specs: {
      "Корпус": "49 мм, Титан класса 5",
      "Дисплей": "LTPO OLED, Always‑On, 2000 нит, 410×502",
      "Чип": "Apple S9 SiP, двухъядерный",
      "GPS": "Двухчастотный L1 + L5",
      "Аккумулятор": "36 ч (60 ч в режиме Low Power)",
      "Водозащита": "100 м (EN 13319)",
      "Датчики": "Температура, ЧСС, ЭКГ, SpO2, Crash Detection",
      "Звук": "Сирена до 86 дБ",
      "Вес": "61.4 г (с Alpine Loop M/L)",
    },
  },
  {
    slug: "apple-watch-series-9",
    images: ["/uploads/apple-watch-series-9.jpg"],
    specs: {
      "Корпус": "41 / 45 мм, алюминий или нержавеющая сталь",
      "Дисплей": "LTPO OLED, Always‑On, 2000 нит",
      "Чип": "Apple S9 SiP, двухъядерный",
      "GPS": "L1",
      "Аккумулятор": "18 ч (36 ч в Low Power Mode)",
      "Водозащита": "50 м",
      "Датчики": "Температура, ЧСС, ЭКГ, SpO2, Crash Detection",
      "Double Tap": "Да — управление без касания экрана",
      "Вес": "31.9 г (алюминий 41 мм)",
    },
  },
  {
    slug: "samsung-galaxy-watch-7",
    images: ["/uploads/placeholder.jpg"],
    specs: {
      "Корпус": "40 / 44 мм, алюминий",
      "Дисплей": "Super AMOLED, Always‑On, 480×480",
      "Чип": "Exynos W1000 (3 нм), 5-ядерный",
      "GPS": "L1 + L5, GLONASS, Beidou, Galileo",
      "Аккумулятор": "40 ч (до 54 ч с Power Saving)",
      "Водозащита": "5 ATM + IP68",
      "BioActive Sensor": "ЧСС, ЭКГ, состав тела, SpO2",
      "ОС": "Wear OS 5 + One UI Watch 6",
      "Вес": "28.8 г (40 мм без ремешка)",
    },
  },
];

async function main() {
  console.log("Updating products with real specs and images...");
  let updated = 0;

  for (const upd of updates) {
    const result = await prisma.product.updateMany({
      where: { slug: upd.slug },
      data: {
        images: upd.images,
        specs:  upd.specs as never,
      },
    });
    if (result.count > 0) {
      console.log(`  ✓ ${upd.slug}`);
      updated++;
    } else {
      console.log(`  ✗ not found: ${upd.slug}`);
    }
  }

  console.log(`\nDone: ${updated}/${updates.length} products updated`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
