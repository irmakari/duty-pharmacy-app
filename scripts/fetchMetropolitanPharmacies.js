const fs = require('fs');
const path = require('path');

/**
 * Metropol İller Listesi
 */
const METROPOL_CITIES = [
  { name: 'İstanbul', tag: 'İstanbul' },
  { name: 'Ankara', tag: 'Ankara' },
  { name: 'İzmir', tag: 'İzmir' },
  { name: 'Bursa', tag: 'Bursa' },
  { name: 'Antalya', tag: 'Antalya' },
  { name: 'Adana', tag: 'Adana' },
  { name: 'Gaziantep', tag: 'Gaziantep' },
  { name: 'Kocaeli', tag: 'Kocaeli' },
  { name: 'Konya', tag: 'Konya' },
  { name: 'Mersin', tag: 'Mersin' },
  { name: 'Muğla', tag: 'Muğla' },
];

async function fetchCityPharmacies(cityName) {
  console.log(`🔄 [${cityName}] eczane verisi çekiliyor...`);

  const query = `
    [out:json][timeout:90];
    area["name"="${cityName}"]->.searchArea;
    (
      node["amenity"="pharmacy"](area.searchArea);
      way["amenity"="pharmacy"](area.searchArea);
    );
    out body center;
  `;

  const url = 'https://overpass-api.de/api/interpreter';

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'DutyPharmacyApp/1.0 (https://github.com/irmakari/duty-pharmacy-app)',
      },
    });

    if (!response.ok) {
      console.warn(`⚠️ [${cityName}] için HTTP hatası: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const elements = data.elements || [];

    return elements.map((el) => {
      const tags = el.tags || {};
      const lat = el.lat || el.center?.lat;
      const lon = el.lon || el.center?.lon;
      const name = tags['name:tr'] || tags.name || 'Eczane';
      const dist = tags['addr:district'] || tags['addr:suburb'] || tags['addr:city'] || cityName;

      return {
        name: name.endsWith('Eczanesi') ? name : `${name} Eczanesi`,
        dist: dist,
        city: cityName,
        address: `${tags['addr:street'] || ''} ${tags['addr:housenumber'] || ''} ${dist} / ${cityName}`.trim(),
        phone: tags.phone || tags['contact:phone'] || 'Belirtilmedi',
        loc: lat && lon ? `${lat},${lon}` : '',
        dutyHours: '09:00 - 19:00 (Hafta içi & Cmt)',
        dutyType: 'sabit',
        dutyTypeLabel: 'SABİT ECZANE',
        workingHours: '09:00 - 19:00',
        distance: '1.2 km',
        isOpenNow: true,
      };
    }).filter(item => item.name && item.name !== 'Eczane Eczanesi');
  } catch (err) {
    console.error(`❌ [${cityName}] çekilirken hata:`, err.message);
    return [];
  }
}

async function fetchAllMetropolPharmacies() {
  console.log('🚀 Türkiye Metropol İlleri Eczane Çekimi Başlatılıyor...');

  let allPharmacies = [];

  for (const city of METROPOL_CITIES) {
    const cityData = await fetchCityPharmacies(city.name);
    console.log(`✅ [${city.name}] -> ${cityData.length} eczane bulundu.`);
    allPharmacies = allPharmacies.concat(cityData);
  }

  // ID ata
  allPharmacies = allPharmacies.map((item, index) => ({
    id: String(index + 1),
    ...item,
  }));

  const outputDir = path.join(__dirname, '../src/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'istanbulPharmacies.json');
  fs.writeFileSync(outputPath, JSON.stringify(allPharmacies, null, 2), 'utf-8');

  console.log(`\n🎉 TAMAMLANDI! Toplam ${allPharmacies.length} metropol eczanesi indirildi ve kaydedildi.`);
  console.log(`📍 Dosya Yolu: ${outputPath}`);
}

fetchAllMetropolPharmacies();
