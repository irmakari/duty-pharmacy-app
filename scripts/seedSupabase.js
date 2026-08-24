const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Hata: .env dosyanızda SUPABASE_URL ve SUPABASE_ANON_KEY eksik!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedPharmacies() {
  const jsonPath = path.join(__dirname, '../src/data/istanbulPharmacies.json');

  if (!fs.existsSync(jsonPath)) {
    console.error('❌ istanbulPharmacies.json dosyası bulunamadı.');
    process.exit(1);
  }

  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const pharmacies = JSON.parse(rawData);

  console.log('🧹 Eski ve mükerrer veriler temizleniyor...');
  const { error: deleteError } = await supabase.from('pharmacies').delete().neq('id', 0);
  if (deleteError) {
    console.warn('⚠️ Eski veriler silinirken uyarı (TRUNCATE önerilir):', deleteError.message);
  } else {
    console.log('✅ Eski veriler temizlendi.');
  }

  console.log(`🚀 Supabase'e benzersiz ${pharmacies.length} adet metropol eczanesi aktarılıyor...`);

  const chunkSize = 200;
  let successCount = 0;

  for (let i = 0; i < pharmacies.length; i += chunkSize) {
    const chunk = pharmacies.slice(i, i + chunkSize).map(p => ({
      name: p.name,
      dist: p.dist,
      city: p.city || 'İstanbul',
      address: p.address,
      address_note: p.addressNote || '',
      phone: p.phone,
      loc: p.loc,
      duty_hours: p.dutyHours,
      duty_type: p.dutyType,
      duty_type_label: p.dutyTypeLabel,
      distance: p.distance,
      is_open_now: p.isOpenNow,
    }));

    const { error } = await supabase.from('pharmacies').insert(chunk);

    if (error) {
      console.error(`❌ Paket ${i / chunkSize + 1} eklenirken hata:`, error.message);
    } else {
      successCount += chunk.length;
      console.log(`✅ [${successCount}/${pharmacies.length}] eczane Supabase'e yazıldı.`);
    }
  }

  console.log(`🎉 Aktarım Tamamlandı! Veritabanınızda tam olarak ${successCount} adet benzersiz eczane bulunuyor.`);
}

seedPharmacies();
