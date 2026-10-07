const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/products.json'), 'utf8'));
const outDir = path.join(__dirname, '../public/products');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Brand color themes
const BRAND_THEMES = {
  'Minimalist': { primary: '#1A1A1A', accent: '#666666', body: '#FFFFFF', cap: '#222222' },
  'Simple': { primary: '#2D8659', accent: '#70C194', body: '#F4FAF6', cap: '#2D8659' },
  'The Derma Co': { primary: '#0A3B5C', accent: '#0084B4', body: '#EDF6FA', cap: '#0A3B5C' },
  'CeraVe': { primary: '#0258A0', accent: '#4CA3DD', body: '#F7FAFC', cap: '#0258A0' },
  'Bioderma': { primary: '#E25E77', accent: '#009AA6', body: '#FDF7F8', cap: '#E25E77' },
  'Cetaphil': { primary: '#007A87', accent: '#70B928', body: '#F2F9F9', cap: '#007A87' },
  'Clinique': { primary: '#234E52', accent: '#A3D9C9', body: '#F7FAF9', cap: '#CBD5E0' },
  "Kiehl's": { primary: '#6B4226', accent: '#C5A059', body: '#FAF5EE', cap: '#2A1D13' },
  'Plum': { primary: '#5A3E85', accent: '#9F7AEA', body: '#FAF7FD', cap: '#5A3E85' },
  "Paula's Choice": { primary: '#1F2937', accent: '#4B5563', body: '#F9FAFB', cap: '#111827' },
  'Estee Lauder': { primary: '#0F2C59', accent: '#C5A059', body: '#FDFBF7', cap: '#C5A059' },
  'Dot & Key': { primary: '#D97706', accent: '#F59E0B', body: '#FFFBEB', cap: '#FCD34D' },
  'Neutrogena': { primary: '#0284C7', accent: '#38BDF8', body: '#F0F9FF', cap: '#0284C7' },
  'Sebamed': { primary: '#BE123C', accent: '#0D9488', body: '#FFF1F2', cap: '#BE123C' },
  "Re'equil": { primary: '#0F766E', accent: '#14B8A6', body: '#F0FDFA', cap: '#0F766E' },
  'Sunday Riley': { primary: '#BE185D', accent: '#F472B6', body: '#FDF2F8', cap: '#831843' }
};

function escapeXml(str) {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

async function generateCutout(product) {
  const theme = BRAND_THEMES[product.brand] || { primary: '#333333', accent: '#777777', body: '#FFFFFF', cap: '#111111' };
  const brandEsc = escapeXml(product.brand);
  const nameEsc = escapeXml(product.name.length > 28 ? product.name.slice(0, 26) + '...' : product.name);
  const sizeEsc = escapeXml(product.size);

  let shapeMarkup = '';

  if (product.category === 'cleanser') {
    // Tall pump bottle
    shapeMarkup = 
      <!-- Pump Head -->
      <rect x="188" y="55" width="24" height="40" rx="3" fill="" />
      <path d="M 175 65 L 140 68 Q 135 69 135 74 L 140 76 L 195 72 Z" fill="" />
      <rect x="178" y="90" width="44" height="20" rx="4" fill="#D1D5DB" />
      
      <!-- Bottle Body -->
      <rect x="125" y="110" width="150" height="340" rx="28" fill="" stroke="#E5E7EB" stroke-width="2" />
      <!-- Bottle Highlight -->
      <path d="M 135 125 Q 138 270 138 420" stroke="rgba(255,255,255,0.7)" stroke-width="8" stroke-linecap="round" fill="none" />
      <!-- Label -->
      <rect x="135" y="170" width="130" height="210" rx="12" fill="#FFFFFF" stroke="" stroke-width="1.5" />
      <line x1="145" y1="185" x2="255" y2="185" stroke="" stroke-width="2" />
      <text x="200" y="215" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="" text-anchor="middle"></text>
      <line x1="165" y1="226" x2="235" y2="226" stroke="#E5E7EB" stroke-width="1" />
      <text x="200" y="250" font-family="Arial, sans-serif" font-size="10" font-weight="600" fill="#1F2937" text-anchor="middle"></text>
      <text x="200" y="275" font-family="Arial, sans-serif" font-size="9" fill="#4B5563" text-anchor="middle">CLEANSER REGIMEN</text>
      <rect x="155" y="295" width="90" height="20" rx="10" fill="" />
      <text x="200" y="309" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle"></text>
    ;
  } else if (product.category === 'serum' || product.category === 'treatment') {
    // Dropper Pipette Tincture Bottle
    shapeMarkup = 
      <!-- Dropper Pipette Top -->
      <rect x="185" y="50" width="30" height="42" rx="15" fill="" />
      <rect x="175" y="88" width="50" height="24" rx="4" fill="#9CA3AF" />
      <!-- Bottle Shoulder & Neck -->
      <path d="M 180 112 L 220 112 L 235 145 L 165 145 Z" fill="" stroke="#E5E7EB" stroke-width="1.5" />
      <!-- Glass Bottle Body -->
      <rect x="135" y="145" width="130" height="305" rx="24" fill="" stroke="#E5E7EB" stroke-width="2" />
      <path d="M 145 160 Q 148 290 148 415" stroke="rgba(255,255,255,0.7)" stroke-width="6" stroke-linecap="round" fill="none" />
      <!-- Serum Label -->
      <rect x="145" y="195" width="110" height="195" rx="10" fill="#FFFFFF" stroke="" stroke-width="1.5" />
      <text x="200" y="230" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="" text-anchor="middle"></text>
      <line x1="160" y1="242" x2="240" y2="242" stroke="" stroke-width="1.5" />
      <text x="200" y="268" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#111827" text-anchor="middle"></text>
      <text x="200" y="292" font-family="Arial, sans-serif" font-size="8" fill="#4B5563" text-anchor="middle">ACTIVE COMPLEX</text>
      <rect x="160" y="315" width="80" height="18" rx="9" fill="" />
      <text x="200" y="327" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle"></text>
    ;
  } else if (product.category === 'moisturizer') {
    // Luxury Cream Jar
    shapeMarkup = 
      <!-- Jar Metallic Lid -->
      <rect x="105" y="170" width="190" height="45" rx="14" fill="" stroke="#9CA3AF" stroke-width="1.5" />
      <line x1="115" y1="192" x2="285" y2="192" stroke="rgba(255,255,255,0.5)" stroke-width="3" />
      <!-- Jar Body -->
      <rect x="115" y="215" width="170" height="235" rx="30" fill="" stroke="#E5E7EB" stroke-width="2" />
      <path d="M 128 230 Q 130 330 130 410" stroke="rgba(255,255,255,0.7)" stroke-width="7" stroke-linecap="round" fill="none" />
      <!-- Label -->
      <rect x="135" y="250" width="130" height="150" rx="12" fill="#FFFFFF" stroke="" stroke-width="1.5" />
      <text x="200" y="282" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="" text-anchor="middle"></text>
      <line x1="160" y1="294" x2="240" y2="294" stroke="" stroke-width="1.5" />
      <text x="200" y="318" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#1F2937" text-anchor="middle"></text>
      <text x="200" y="340" font-family="Arial, sans-serif" font-size="8.5" fill="#4B5563" text-anchor="middle">BARRIER MOISTURIZER</text>
      <rect x="160" y="355" width="80" height="18" rx="9" fill="" />
      <text x="200" y="367" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle"></text>
    ;
  } else {
    // Sunscreen Tube
    shapeMarkup = 
      <!-- Tube Flip Cap Base -->
      <rect x="145" y="390" width="110" height="60" rx="8" fill="" stroke="#9CA3AF" stroke-width="1.5" />
      <!-- Tube Body (Tapered Top) -->
      <path d="M 120 100 Q 115 100 115 110 L 145 390 L 255 390 L 285 110 Q 285 100 280 100 Z" fill="" stroke="#E5E7EB" stroke-width="2" />
      <!-- Crimp Top Seal -->
      <rect x="110" y="90" width="180" height="15" rx="3" fill="#D1D5DB" />
      <line x1="115" y1="97" x2="285" y2="97" stroke="#9CA3AF" stroke-width="1" stroke-dasharray="3,3" />
      <!-- Tube Highlight -->
      <path d="M 130 120 L 152 380" stroke="rgba(255,255,255,0.7)" stroke-width="8" stroke-linecap="round" />
      <!-- Sunscreen Graphic & Badge -->
      <circle cx="200" cy="180" r="28" fill="" opacity="0.25" />
      <circle cx="200" cy="180" r="16" fill="" />
      <text x="200" y="235" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="" text-anchor="middle"></text>
      <line x1="160" y1="246" x2="240" y2="246" stroke="" stroke-width="1.5" />
      <text x="200" y="270" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#1F2937" text-anchor="middle"></text>
      <rect x="155" y="295" width="90" height="24" rx="12" fill="" />
      <text x="200" y="311" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SPF 50+ PA++++</text>
      <text x="200" y="345" font-family="Arial, sans-serif" font-size="8.5" fill="#4B5563" text-anchor="middle"></text>
    ;
  }

  const svg = 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" width="400" height="520">
      <defs>
        <filter id="shadowBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
        </filter>
        <radialGradient id="contactShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1A1512" stop-opacity="0.32" />
          <stop offset="60%" stop-color="#1A1512" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#1A1512" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Soft Realistic Ground Contact Shadow -->
      <ellipse cx="200" cy="482" rx="125" ry="16" fill="url(#contactShadow)" filter="url(#shadowBlur)" />
      <ellipse cx="200" cy="480" rx="95" ry="9" fill="#1A1512" opacity="0.18" />

      <!-- Bottle Graphic -->
      
    </svg>
  ;

  const dest = path.join(outDir, ${product.id}.png);
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(dest);
}

async function run() {
  console.log(Generating transparent cutouts for  products...);
  for (const p of products) {
    await generateCutout(p);
  }
  console.log('Successfully generated all product cutouts in /public/products/');
}

run().catch(console.error);
