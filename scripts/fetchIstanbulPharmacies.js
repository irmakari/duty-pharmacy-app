const fs = require('fs');
const path = require('path');

/**
 * OpenStreetMap Overpass API üzerinden İstanbul'daki tüm eczaneleri çeken ve
 * veritabanı / mock formatına uygun olarak src/data/istanbulPharmacies.json dosyasına kaydeden script.
 */
async function fetchIstanbulPharmacies() {
  console.log('🔄 İstanbul eczane verisi Overpass API üzerinden çekiliyor...');

  const query = `
    [out:json][timeout:90];
    area["name"="İstanbul"]->.searchArea;
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const elements = data.elements || [];

    console.log(`✅ Toplam ${elements.length} adet ham veri çekildi. Formatlanıyor...`);

    const formattedPharmacies = elements
      .map((el, index) => {
        const tags = el.tags || {};
        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;
        const name = tags['name:tr'] || tags.name || 'Eczane';

        return {
          id: String(index + 1),
          name: name.endsWith('Eczanesi') ? name : `${name} Eczanesi`,
          dist: tags['addr:district'] || tags['addr:suburb'] || tags['addr:city'] || 'İstanbul',
          city: 'İstanbul',
          address: `${tags['addr:street'] || ''} ${tags['addr:housenumber'] || ''} ${tags['addr:suburb'] || ''}`.trim() || 'İstanbul',
          phone: tags.phone || tags['contact:phone'] || 'Belirtilmedi',
          loc: lat && lon ? `${lat},${lon}` : '',
          dutyHours: '09:00 - 19:00 (Hafta içi & Cmt)',
          dutyType: 'sabit',
          dutyTypeLabel: 'SABİT ECZANE',
          workingHours: '09:00 - 19:00',
          distance: `${(0.5 + index * 0.2).toFixed(1)} km`,
          isOpenNow: true,
        };
      })
      .filter(item => item.name && item.name !== 'Eczane Eczanesi');

    const outputDir = path.join(__dirname, '../src/data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'istanbulPharmacies.json');
    fs.writeFileSync(outputPath, JSON.stringify(formattedPharmacies, null, 2), 'utf-8');

    console.log(`🎉 Başarıyla ${formattedPharmacies.length} adet İstanbul eczanesi kaydedildi!`);
    console.log(`📍 Dosya Yolu: ${outputPath}`);
  } catch (error) {
    console.error('❌ Eczane verisi çekilirken hata oluştu:', error);
  }
}

fetchIstanbulPharmacies();
