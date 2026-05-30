import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Real images downloaded from Wikipedia, Apple CDN, etc.
const IMAGE_MAP: Record<string, string[]> = {
  "iphone-15-pro":              ["/uploads/iphone-15-pro.png"],
  "iphone-15":                  ["/uploads/iphone-15.png"],
  "samsung-galaxy-s24-ultra":   ["/uploads/samsung-s24-ultra.jpg"],
  "samsung-galaxy-s24":         ["/uploads/samsung-s24.jpg"],
  "google-pixel-8-pro":         ["/uploads/placeholder.jpg"],
  "xiaomi-14":                  ["/uploads/xiaomi-14.jpg"],
  "macbook-pro-14-m3-pro":      ["/uploads/macbook-pro-14-m3.png"],
  "macbook-air-15-m3":          ["/uploads/macbook-air-15-m3.jpg"],
  "samsung-galaxy-book4-pro":   ["/uploads/placeholder.jpg"],
  "ipad-pro-13-m4":             ["/uploads/ipad-pro-13-m4.png"],
  "ipad-air-11-m2":             ["/uploads/ipad-air-11-m2.png"],
  "samsung-galaxy-tab-s9-ultra":["/uploads/samsung-tab-s9-ultra.jpg"],
  "xiaomi-pad-6":               ["/uploads/xiaomi-pad-6.jpg"],
  "airpods-pro-2":              ["/uploads/airpods-pro-2.png"],
  "sony-wh-1000xm5":            ["/uploads/sony-wh-1000xm5.jpg"],
  "sony-wf-1000xm5":            ["/uploads/placeholder.jpg"],
  "samsung-galaxy-buds3-pro":   ["/uploads/placeholder.jpg"],
  "apple-watch-ultra-2":        ["/uploads/apple-watch-ultra-2.jpg"],
  "apple-watch-series-9":       ["/uploads/apple-watch-series-9.jpg"],
  "samsung-galaxy-watch-7":     ["/uploads/placeholder.jpg"],
};

async function main() {
  let ok = 0;
  for (const [slug, images] of Object.entries(IMAGE_MAP)) {
    const r = await prisma.product.updateMany({ where: { slug }, data: { images } });
    if (r.count) { process.stdout.write(`✓ ${slug}\n`); ok++; }
    else { process.stdout.write(`✗ ${slug} (not found)\n`); }
  }
  console.log(`\nDone: ${ok}/${Object.keys(IMAGE_MAP).length}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
