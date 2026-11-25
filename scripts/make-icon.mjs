// Genera build/icon.png (1024×1024) a partir de build/icon.svg.
// electron-builder crea a partir de él el .icns (macOS) y el .ico (Windows).
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const buildDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'build');

await sharp(path.join(buildDir, 'icon.svg'), { density: 300 })
  .resize(1024, 1024)
  .png()
  .toFile(path.join(buildDir, 'icon.png'));

console.log('Icono generado en build/icon.png');
