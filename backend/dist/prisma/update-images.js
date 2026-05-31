"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 19 из 20 продуктов с реальными фото
// Sony WF-1000XM5 использует gradient placeholder (не найдено на Wikimedia)
const IMAGE_MAP = {
    // Смартфоны
    "iphone-15-pro": ["/uploads/iphone-15-pro.png"],
    "iphone-15": ["/uploads/iphone-15.png"],
    "samsung-galaxy-s24-ultra": ["/uploads/samsung-s24-ultra.jpg"],
    "samsung-galaxy-s24": ["/uploads/samsung-s24.jpg"],
    "google-pixel-8-pro": ["/uploads/google-pixel-8-pro.jpg"],
    "xiaomi-14": ["/uploads/xiaomi-14.jpg"],
    // Ноутбуки
    "macbook-pro-14-m3-pro": ["/uploads/macbook-pro-14-m3.png"],
    "macbook-air-15-m3": ["/uploads/macbook-air-15-m3.jpg"],
    "samsung-galaxy-book4-pro": ["/uploads/samsung-book4-pro.jpg"],
    // Планшеты
    "ipad-pro-13-m4": ["/uploads/ipad-pro-13-m4.png"],
    "ipad-air-11-m2": ["/uploads/ipad-air-11-m2.png"],
    "samsung-galaxy-tab-s9-ultra": ["/uploads/samsung-tab-s9-ultra.jpg"],
    "xiaomi-pad-6": ["/uploads/xiaomi-pad-6.jpg"],
    // Наушники
    "airpods-pro-2": ["/uploads/airpods-pro-2.png"],
    "sony-wh-1000xm5": ["/uploads/sony-wh-1000xm5.jpg"],
    "sony-wf-1000xm5": ["/uploads/placeholder.jpg"], // gradient placeholder
    "samsung-galaxy-buds3-pro": ["/uploads/samsung-buds3-pro.jpg"],
    // Смарт-часы
    "apple-watch-ultra-2": ["/uploads/apple-watch-ultra-2.jpg"],
    "apple-watch-series-9": ["/uploads/apple-watch-series-9.jpg"],
    "samsung-galaxy-watch-7": ["/uploads/samsung-watch7.jpg"],
};
async function main() {
    console.log("Updating product images...\n");
    let ok = 0, fail = 0;
    for (const [slug, images] of Object.entries(IMAGE_MAP)) {
        const r = await prisma.product.updateMany({ where: { slug }, data: { images } });
        if (r.count > 0) {
            const img = images[0].split("/").pop();
            console.log(`✓ ${slug.padEnd(28)} → ${img}`);
            ok++;
        }
        else {
            console.log(`✗ ${slug} (not found)`);
            fail++;
        }
    }
    console.log(`\nDone: ${ok} updated, ${fail} not found`);
    console.log(`Coverage: ${ok - Object.values(IMAGE_MAP).filter(i => i[0].includes('placeholder')).length}/${Object.keys(IMAGE_MAP).length} real photos`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=update-images.js.map