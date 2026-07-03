// Genera el QR que apunta a la web ya publicada.
// Uso:  node scripts/generate-qr.mjs https://mesas-oli.vercel.app
// Salida: public/qr-oli.png  y  public/qr-oli.svg
import QRCode from 'qrcode';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const url = process.argv[2];
if (!url) {
    console.error('\n  Falta la URL. Ej:  node scripts/generate-qr.mjs https://tu-app.vercel.app\n');
    process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public');
await mkdir(outDir, { recursive: true });

const opts = {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 1200,
    color: { dark: '#d98aa0', light: '#ffffff' }, // rosa de la invitación
};

await QRCode.toFile(join(outDir, 'qr-oli.png'), url, opts);
await QRCode.toFile(join(outDir, 'qr-oli.svg'), url, { ...opts, type: 'svg' });

console.log(`\n  QR generado para: ${url}`);
console.log('  → public/qr-oli.png');
console.log('  → public/qr-oli.svg\n');
