const fs = require('fs');
const zlib = require('zlib');

const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  crcTable[n] = c;
}
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  return (crc ^ (-1)) >>> 0;
}
function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0); chunk.write(type, 4, 4, 'ascii'); data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(chunk.slice(4, 8 + len)), 8 + len); return chunk;
}
function encodePng(w, h, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(w, 0); ihdrData.writeUInt32BE(h, 4);
  ihdrData[8] = 8; ihdrData[9] = 6; ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;
  const ihdr = makeChunk('IHDR', ihdrData);
  const raw = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) {
    const rowOffset = y * (1 + w * 4);
    raw[rowOffset] = 0;
    rgba.copy(raw, rowOffset + 1, y * w * 4, (y + 1) * w * 4);
  }
  const idat = makeChunk('IDAT', zlib.deflateSync(raw, { level: 9 }));
  const iend = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, ihdr, idat, iend]);
}
function paeth(a, b, c) {
  const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}
function decodePng(buf) {
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  let idats = [], offset = 8;
  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IDAT') idats.push(buf.slice(offset + 8, offset + 8 + len));
    offset += 12 + len;
  }
  const decompressed = zlib.inflateSync(Buffer.concat(idats));
  const bpp = 4, stride = 1 + w * bpp;
  const rgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const filter = decompressed[y * stride];
    const rowIn = y * stride + 1, rowOut = y * w * bpp, prevRowOut = (y - 1) * w * bpp;
    for (let x = 0; x < w * bpp; x++) {
      const raw = decompressed[rowIn + x];
      const a = x >= bpp ? rgba[rowOut + x - bpp] : 0;
      const b = y > 0 ? rgba[prevRowOut + x] : 0;
      const c = (x >= bpp && y > 0) ? rgba[prevRowOut + x - bpp] : 0;
      let val = 0;
      if (filter === 0) val = raw;
      else if (filter === 1) val = (raw + a) & 0xff;
      else if (filter === 2) val = (raw + b) & 0xff;
      else if (filter === 3) val = (raw + Math.floor((a + b) / 2)) & 0xff;
      else if (filter === 4) val = (raw + paeth(a, b, c)) & 0xff;
      rgba[rowOut + x] = val;
    }
  }
  return { w, h, rgba };
}

function convertToPureWhiteCropped(sourcePath, destPath, options = {}) {
  const { w, h, rgba } = decodePng(fs.readFileSync(sourcePath));
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const a = rgba[idx + 3];
      if (a > 25) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
    }
  }
  const pad = 4;
  minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
  const cropW = maxX - minX + 1, cropH = maxY - minY + 1;
  const outRgba = Buffer.alloc(cropW * cropH * 4);

  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const srcIdx = ((minY + y) * w + (minX + x)) * 4;
      const destIdx = (y * cropW + x) * 4;
      const r = rgba[srcIdx], g = rgba[srcIdx + 1], b = rgba[srcIdx + 2], a = rgba[srcIdx + 3];

      if (options.cutoutRedHeart && r > 120 && g < 100 && b < 100) {
        outRgba[destIdx + 3] = 0;
      } else {
        outRgba[destIdx] = 255;
        outRgba[destIdx + 1] = 255;
        outRgba[destIdx + 2] = 255;
        outRgba[destIdx + 3] = a;
      }
    }
  }
  const outBuf = encodePng(cropW, cropH, outRgba);
  fs.writeFileSync(destPath, outBuf);
  console.log('Generated:', destPath, `${cropW}x${cropH}`);
}

// 1. Zoff with cutout heart
convertToPureWhiteCropped('public/brands/ZOFF Logo 2195.png', 'public/brands/zoff-logo-white.png', { cutoutRedHeart: true });

// 2. Blue Tyga
convertToPureWhiteCropped('public/brands/Blue Tyga.png', 'public/brands/bluetyga-logo-white.png');

// 3. Toothsi
convertToPureWhiteCropped('public/brands/Toothsi.png', 'public/brands/toothsi-logo-white.png');

// 4. Rentomojo
convertToPureWhiteCropped('public/brands/Rentomojo.png', 'public/brands/rentomojo-logo-white.png');

// 5. Re'equil
convertToPureWhiteCropped('public/brands/REEQUIL_logo.png', 'public/brands/reequil-logo-white.png');

// 6. Wakefit
convertToPureWhiteCropped('public/brands/wakefit.png', 'public/brands/wakefit-logo-white.png');

// 7. Pizza Hut
convertToPureWhiteCropped('public/brands/Pizza Hut.png', 'public/brands/pizzahut-logo-white.png');

// 8. OneCard
convertToPureWhiteCropped('public/brands/one card.png', 'public/brands/onecard-logo-white.png');

// 9. Beat XP
convertToPureWhiteCropped('public/brands/Beat XP.png', 'public/brands/beatxp-logo-white.png');

// 10. Vibhor
convertToPureWhiteCropped('public/brands/vibhor-logo.png', 'public/brands/vibhor-logo-white.png');

// 11. CheQ
convertToPureWhiteCropped('public/brands/cheq-logo-white.png', 'public/brands/cheq-logo-white.png');

// 12. Pilgrim
convertToPureWhiteCropped('public/brands/pilgrim-logo-white.png', 'public/brands/pilgrim-logo-white.png');

// 13. Eat Anytime
convertToPureWhiteCropped('public/brands/eatanytime-logo-white.png', 'public/brands/eatanytime-logo-white.png');

console.log('All PNG logos converted to pure white with alpha!');
