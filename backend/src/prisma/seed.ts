import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "smartphones" }, update: {}, create: { name: "Смартфоны", slug: "smartphones" } }),
    prisma.category.upsert({ where: { slug: "laptops" }, update: {}, create: { name: "Ноутбуки", slug: "laptops" } }),
    prisma.category.upsert({ where: { slug: "tablets" }, update: {}, create: { name: "Планшеты", slug: "tablets" } }),
    prisma.category.upsert({ where: { slug: "headphones" }, update: {}, create: { name: "Наушники", slug: "headphones" } }),
    prisma.category.upsert({ where: { slug: "watches" }, update: {}, create: { name: "Смарт-часы", slug: "watches" } }),
  ]);

  // Brands
  const brands = await Promise.all([
    prisma.brand.upsert({ where: { slug: "apple" }, update: {}, create: { name: "Apple", slug: "apple" } }),
    prisma.brand.upsert({ where: { slug: "samsung" }, update: {}, create: { name: "Samsung", slug: "samsung" } }),
    prisma.brand.upsert({ where: { slug: "sony" }, update: {}, create: { name: "Sony", slug: "sony" } }),
    prisma.brand.upsert({ where: { slug: "google" }, update: {}, create: { name: "Google", slug: "google" } }),
    prisma.brand.upsert({ where: { slug: "xiaomi" }, update: {}, create: { name: "Xiaomi", slug: "xiaomi" } }),
  ]);

  const [catPhone, catLaptop, catTablet, catHeadphones, catWatch] = categories;
  const [apple, samsung, sony, google, xiaomi] = brands;

  // Products
  const products = [
    // Smartphones
    { name: "iPhone 15 Pro", slug: "iphone-15-pro", description: "Профессиональный смартфон с чипом A17 Pro, камерой 48 Мп и титановым корпусом.", price: 119990, stock: 25, categoryId: catPhone.id, brandId: apple.id, images: ["/uploads/placeholder.jpg"], specs: { display: "6.1 OLED Super Retina XDR", cpu: "A17 Pro", ram: "8 GB", storage: "256 GB", camera: "48 MP + 12 MP + 12 MP" } },
    { name: "iPhone 15", slug: "iphone-15", description: "Смартфон с Dynamic Island, камерой 48 Мп и USB-C.", price: 89990, stock: 40, categoryId: catPhone.id, brandId: apple.id, images: ["/uploads/placeholder.jpg"], specs: { display: "6.1 OLED Super Retina XDR", cpu: "A16 Bionic", ram: "6 GB", storage: "128 GB", camera: "48 MP + 12 MP" } },
    { name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra", description: "Флагман с встроенным S Pen, камерой 200 Мп и искусственным интеллектом Galaxy AI.", price: 109990, stock: 18, categoryId: catPhone.id, brandId: samsung.id, images: ["/uploads/placeholder.jpg"], specs: { display: "6.8 Dynamic AMOLED 2X", cpu: "Snapdragon 8 Gen 3", ram: "12 GB", storage: "256 GB", camera: "200 MP + 50 MP + 10 MP + 12 MP" } },
    { name: "Samsung Galaxy S24", slug: "samsung-galaxy-s24", description: "Компактный флагман с 50-мегапиксельной камерой и процессором Snapdragon 8 Gen 3.", price: 79990, stock: 30, categoryId: catPhone.id, brandId: samsung.id, images: ["/uploads/placeholder.jpg"], specs: { display: "6.2 Dynamic AMOLED 2X", cpu: "Snapdragon 8 Gen 3", ram: "8 GB", storage: "128 GB", camera: "50 MP + 12 MP + 10 MP" } },
    { name: "Google Pixel 8 Pro", slug: "google-pixel-8-pro", description: "Смартфон с чипом Google Tensor G3, семилетними обновлениями и лучшей в классе камерой.", price: 94990, stock: 15, categoryId: catPhone.id, brandId: google.id, images: ["/uploads/placeholder.jpg"], specs: { display: "6.7 LTPO OLED", cpu: "Google Tensor G3", ram: "12 GB", storage: "128 GB", camera: "50 MP + 48 MP + 48 MP" } },
    { name: "Xiaomi 14", slug: "xiaomi-14", description: "Флагман с оптикой Leica, процессором Snapdragon 8 Gen 3 и зарядкой 90 Вт.", price: 74990, stock: 22, categoryId: catPhone.id, brandId: xiaomi.id, images: ["/uploads/placeholder.jpg"], specs: { display: "6.36 AMOLED", cpu: "Snapdragon 8 Gen 3", ram: "12 GB", storage: "256 GB", camera: "50 MP + 50 MP + 50 MP" } },

    // Laptops
    { name: "MacBook Pro 14 M3 Pro", slug: "macbook-pro-14-m3-pro", description: "Профессиональный ноутбук с чипом M3 Pro, дисплеем Liquid Retina XDR и автономностью до 18 часов.", price: 229990, stock: 10, categoryId: catLaptop.id, brandId: apple.id, images: ["/uploads/placeholder.jpg"], specs: { display: "14.2 Liquid Retina XDR", cpu: "Apple M3 Pro", ram: "18 GB", storage: "512 GB SSD", battery: "18 hours" } },
    { name: "MacBook Air 15 M3", slug: "macbook-air-15-m3", description: "Тонкий и лёгкий ноутбук с 15-дюймовым дисплеем и чипом M3.", price: 149990, stock: 14, categoryId: catLaptop.id, brandId: apple.id, images: ["/uploads/placeholder.jpg"], specs: { display: "15.3 Liquid Retina", cpu: "Apple M3", ram: "8 GB", storage: "256 GB SSD", battery: "15 hours" } },
    { name: "Samsung Galaxy Book4 Pro", slug: "samsung-galaxy-book4-pro", description: "Тонкий Windows-ноутбук с AMOLED-дисплеем и процессором Intel Core Ultra 7.", price: 139990, stock: 8, categoryId: catLaptop.id, brandId: samsung.id, images: ["/uploads/placeholder.jpg"], specs: { display: "14 AMOLED 2K", cpu: "Intel Core Ultra 7 155H", ram: "16 GB", storage: "512 GB SSD", battery: "22 hours" } },

    // Tablets
    { name: "iPad Pro 13 M4", slug: "ipad-pro-13-m4", description: "Самый тонкий iPad с OLED-дисплеем, чипом M4 и поддержкой Apple Pencil Pro.", price: 149990, stock: 12, categoryId: catTablet.id, brandId: apple.id, images: ["/uploads/placeholder.jpg"], specs: { display: "13 Ultra Retina XDR OLED", cpu: "Apple M4", ram: "8 GB", storage: "256 GB", connectivity: "Wi-Fi 6E" } },
    { name: "iPad Air 11 M2", slug: "ipad-air-11-m2", description: "Универсальный планшет с чипом M2 и поддержкой Apple Pencil USB-C.", price: 89990, stock: 20, categoryId: catTablet.id, brandId: apple.id, images: ["/uploads/placeholder.jpg"], specs: { display: "11 Liquid Retina", cpu: "Apple M2", ram: "8 GB", storage: "128 GB", connectivity: "Wi-Fi 6E" } },
    { name: "Samsung Galaxy Tab S9 Ultra", slug: "samsung-galaxy-tab-s9-ultra", description: "Планшет с огромным AMOLED-дисплеем 14.6 дюйма, S Pen в комплекте и защитой IP68.", price: 99990, stock: 9, categoryId: catTablet.id, brandId: samsung.id, images: ["/uploads/placeholder.jpg"], specs: { display: "14.6 Dynamic AMOLED 2X", cpu: "Snapdragon 8 Gen 2", ram: "12 GB", storage: "256 GB", connectivity: "Wi-Fi 6E" } },
    { name: "Xiaomi Pad 6", slug: "xiaomi-pad-6", description: "Планшет с дисплеем 144 Гц, процессором Snapdragon 870 и зарядкой 33 Вт.", price: 39990, stock: 28, categoryId: catTablet.id, brandId: xiaomi.id, images: ["/uploads/placeholder.jpg"], specs: { display: "11 IPS 144Hz", cpu: "Snapdragon 870", ram: "8 GB", storage: "256 GB", connectivity: "Wi-Fi 6" } },

    // Headphones
    { name: "AirPods Pro 2", slug: "airpods-pro-2", description: "TWS-наушники с активным шумоподавлением, адаптивным звуком и чипом H2.", price: 24990, stock: 50, categoryId: catHeadphones.id, brandId: apple.id, images: ["/uploads/placeholder.jpg"], specs: { type: "TWS", anc: "да", driver: "Индивидуальный", battery: "6 часов (30 ч с кейсом)", waterproof: "IPX4" } },
    { name: "Sony WH-1000XM5", slug: "sony-wh-1000xm5", description: "Полноразмерные наушники с лучшим в классе шумоподавлением и 30 часами автономности.", price: 34990, stock: 35, categoryId: catHeadphones.id, brandId: sony.id, images: ["/uploads/placeholder.jpg"], specs: { type: "Полноразмерные", anc: "да", driver: "30 мм", battery: "30 часов", codec: "LDAC, AAC, SBC" } },
    { name: "Sony WF-1000XM5", slug: "sony-wf-1000xm5", description: "Компактные TWS-наушники с LDAC, шумоподавлением и 8 часами воспроизведения.", price: 19990, stock: 42, categoryId: catHeadphones.id, brandId: sony.id, images: ["/uploads/placeholder.jpg"], specs: { type: "TWS", anc: "да", driver: "8.4 мм", battery: "8 часов (24 ч с кейсом)", codec: "LDAC, AAC, SBC" } },
    { name: "Samsung Galaxy Buds3 Pro", slug: "samsung-galaxy-buds3-pro", description: "Наушники с ANC, голосовым мастером и Hi-Fi-звуком.", price: 17990, stock: 33, categoryId: catHeadphones.id, brandId: samsung.id, images: ["/uploads/placeholder.jpg"], specs: { type: "TWS", anc: "да", driver: "10.5 мм", battery: "6 часов (30 ч с кейсом)", codec: "SSC HiFi, AAC, SBC" } },

    // Watches
    { name: "Apple Watch Ultra 2", slug: "apple-watch-ultra-2", description: "Самые мощные Apple Watch с корпусом из титана, дисплеем 2000 нит и GPS двойной частоты.", price: 79990, stock: 11, categoryId: catWatch.id, brandId: apple.id, images: ["/uploads/placeholder.jpg"], specs: { display: "49 мм LTPO OLED 2000 нит", chip: "S9 SiP", gps: "L1 + L5", battery: "36 часов", waterproof: "100 м" } },
    { name: "Apple Watch Series 9", slug: "apple-watch-series-9", description: "Смарт-часы с чипом S9, Double Tap и дисплеем всегда включён.", price: 44990, stock: 25, categoryId: catWatch.id, brandId: apple.id, images: ["/uploads/placeholder.jpg"], specs: { display: "41 мм LTPO OLED", chip: "S9 SiP", gps: "L1", battery: "18 часов", waterproof: "50 м" } },
    { name: "Samsung Galaxy Watch 7", slug: "samsung-galaxy-watch-7", description: "Смарт-часы с анализом состава тела, BioActive-сенсором и Wear OS.", price: 29990, stock: 20, categoryId: catWatch.id, brandId: samsung.id, images: ["/uploads/placeholder.jpg"], specs: { display: "40 мм Super AMOLED", chip: "Exynos W1000", gps: "L1 + L5", battery: "40 часов", waterproof: "5 ATM" } },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  // Admin user
  const adminHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@techstore.ru" },
    update: {},
    create: { email: "admin@techstore.ru", passwordHash: adminHash, name: "Admin", role: "ADMIN" },
  });

  await prisma.cart.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id },
  });

  console.log(`Seeded: ${categories.length} categories, ${brands.length} brands, ${products.length} products`);
  console.log("Admin login: admin@techstore.ru / admin123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
