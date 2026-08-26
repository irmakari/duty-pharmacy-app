import { Pharmacy } from '../types/pharmacy';

// İstanbul'un 39 Resmi İlçesi Listesi
export const ISTANBUL_DISTRICTS: string[] = [
  'Adalar',
  'Arnavutköy',
  'Ataşehir',
  'Avcılar',
  'Bağcılar',
  'Bahçelievler',
  'Bakırköy',
  'Başakşehir',
  'Bayrampaşa',
  'Beşiktaş',
  'Beykoz',
  'Beylikdüzü',
  'Beyoğlu',
  'Büyükçekmece',
  'Çatalca',
  'Çekmeköy',
  'Esenler',
  'Esenyurt',
  'Eyüpsultan',
  'Fatih',
  'Gaziosmanpaşa',
  'Güngören',
  'Kadıköy',
  'Kağıthane',
  'Kartal',
  'Küçükçekmece',
  'Maltepe',
  'Pendik',
  'Sancaktepe',
  'Sarıyer',
  'Silivri',
  'Sultanbeyli',
  'Sultangazi',
  'Şile',
  'Şişli',
  'Tuzla',
  'Ümraniye',
  'Üsküdar',
  'Zeytinburnu',
];

/**
 * İstanbul Semt/Mahalle -> İlçe Eşleştirme Haritası
 * Örneğin: İçerenköy -> Ataşehir, Caddebostan -> Kadıköy, Etiler -> Beşiktaş vb.
 */
export const DISTRICT_NEIGHBORHOODS_MAP: Record<string, string[]> = {
  'Ataşehir': [
    'içerenköy', 'icerenkoy', 'küçükbakkalköy', 'kucukbakkalkoy', 'kayışdağı', 'kayisdagi',
    'barbaros', 'ataturk', 'ataşehir', 'atasehir', 'ferhatpaşa', 'ferhatpasa', 'inönü', 'inonu',
    'mevlana', 'mimar sinan', 'mustafa kemal', 'örnek', 'ornek', 'esatpaşa', 'esatpasa',
    'yeni çamlıca', 'yeni camlica', 'yenisahra', 'yeni sahra', 'yenişehir', 'yenisehir',
    'aşık veysel', 'asik veysel', 'batı ataşehir', 'bati atasehir'
  ],
  'Kadıköy': [
    'caddebostan', 'fenerbahçe', 'fenerbahce', 'suadiye', 'bostancı', 'bostanci',
    'erenköy', 'erenkoy', 'göztepe', 'goztepe', 'moda', 'caferağa', 'caferaga',
    'rasimpaşa', 'rasimpasa', 'kozyatağı', 'kozyatagi', 'kızıltoprak', 'kiziltoprak',
    'feneryolu', 'hasanpaşa', 'hasanpasa', 'fikirtepe', 'sahrayıcedid', 'sahrayicedid',
    'kalamış', 'kalamis', 'ziverbey', 'acıbadem', 'osmanağa', 'osmanaga'
  ],
  'Beşiktaş': [
    'etiler', 'bebek', 'levent', 'arnavutköy', 'arnavutkoy', 'ortaköy', 'ortakoy',
    'aşiyan', 'asiyan', 'ulus', 'gayrettepe', 'akatlar', 'akat', 'yıldız', 'yildiz',
    'dikilitaş', 'dikilitas', 'balmumcu', 'nisbetiye', 'konaklar', 'kuruçeşme', 'kurucesme',
    'abbasağa', 'abbasaga', 'sinanpaşa', 'sinanpasa', 'vişnezade', 'visnezade', 'muradiye'
  ],
  'Şişli': [
    'nişantaşı', 'nisantasi', 'teşvikiye', 'tesvikiye', 'mecidiyeköy', 'mecidiyekoy',
    'fulya', 'okmeydanı', 'okmeydani', 'feriköy', 'ferikoy', 'kurtuluş', 'kurtulus',
    'harbiye', 'pangaltı', 'pangalti', 'bomonti', 'maslak', 'esentepe', 'gülbahar', 'gulbahar',
    'halide edip adıvar', 'halaskargazi', 'kaptanpaşa', 'kaptanpasa'
  ],
  'Üsküdar': [
    'çamlıca', 'camlica', 'beylerbeyi', 'çengelköy', 'cengelkoy', 'kuzguncuk',
    'kandilli', 'salacak', 'altunizade', 'küplüce', 'kupluce', 'bağlarbaşı', 'baglarbasi',
    'kısıklı', 'kisikli', 'libadiye', 'ferah', 'kirazlıtepe', 'kirazlitepe', 'yavuztürk', 'yavuzturk',
    'muratreis', 'selami ali', 'zeynep kamil', 'ahmediye'
  ],
  'Bakırköy': [
    'florya', 'yeşilköy', 'yesilkoy', 'yeşilyurt', 'yesilyurt', 'ataköy', 'atakoy',
    'zuhuratbaba', 'şenlikköy', 'senlikkoy', 'kartaltepe', 'cevizlik', 'osmaniye',
    'sakızağacı', 'sakizagaci', 'yenimahalle', 'basınköy', 'basinkoy'
  ],
  'Fatih': [
    'aksaray', 'eminönü', 'eminonu', 'sirkeci', 'sultanahmet', 'beyazıt', 'beyazit',
    'laleli', 'haseki', 'kocamustafapaşa', 'kocamustafapasa', 'fındıkzade', 'findikzade',
    'karagümrük', 'karagumruk', 'balat', 'fener', 'kumkapı', 'kumkapi', 'vefa',
    'çapa', 'capa', 'şehremini', 'sehremini', 'samatya', 'cerrahpaşa', 'cerrahpasa',
    'draman', 'topkapı', 'topkapi'
  ],
  'Beyoğlu': [
    'taksim', 'cihangir', 'karaköy', 'karakoy', 'galata', 'kasımpaşa', 'kasimpasa',
    'kabataş', 'kabatas', 'tarlabaşı', 'tarlabasi', 'asmalımescit', 'asmalimescit',
    'sütlüce', 'sutluce', 'hasköy', 'haskoy', 'şişhane', 'sishane', 'çukurcuma', 'cukurcuma',
    'ömer avni', 'tomtom', 'pürtelaş', 'purtelas', 'firuzağa', 'firuzaga', 'bereketzade'
  ],
  'Maltepe': [
    'küçükyalı', 'kucukyali', 'zümrütevler', 'zumrutevler', 'idealtepe', 'altıntepe', 'altintepe',
    'bağlarbaşı', 'baglarbasi', 'cevizli', 'gülsuyu', 'gulsuyu', 'fındıklı', 'findikli',
    'başıbüyük', 'basibuyuk', 'büyükbakkalköy', 'buyukbakkalkoy', 'gülensu', 'gulensu', 'girne'
  ],
  'Ümraniye': [
    'çakmak', 'cakmak', 'ihlamurkuyu', 'şerifali', 'serifali', 'dudullu',
    'esenevler', 'namık kemal', 'elmalıkent', 'elmalikent', 'kazım karabekir', 'inkılap',
    'armağanevler', 'armaganevler', 'tepeüstü', 'tepeustu', 'tatlısu', 'tatlisu', 'yamanevler', 'saray', 'altınşehir', 'madenler'
  ],
  'Pendik': [
    'kurtköy', 'kurtkoy', 'kaynarca', 'güzelyalı', 'guzelyali', 'esenyalı', 'esenyali',
    'yenişehir', 'yenisehir', 'çamlık', 'camlik', 'sapan bağları', 'velibaba', 'şeyhli', 'seyhli',
    'kavakpınar', 'güllübağlar', 'ertuğrul gazi'
  ],
  'Kartal': [
    'soğanlık', 'soganlik', 'yakacık', 'yakacik', 'topselvi', 'cevizli', 'kordonboyu',
    'orhanlı', 'orhanli', 'esentepe', 'karlıtepe', 'petrol iş', 'petrol is', 'atalar', 'rahmanlar', 'yalı', 'yali', 'hürriyet', 'gümüşpınar'
  ],
  'Beykoz': [
    'kavacık', 'kavacik', 'kanlıca', 'kanlica', 'anadoluhisarı', 'anadoluhisari',
    'çubuklu', 'cubuklu', 'paşabahçe', 'pasabahce', 'göksu', 'goksu', 'riva', 'polonezköy', 'polonezkoy',
    'yalıköy', 'yalikoy', 'ortaçeşme', 'tokatköy'
  ],
  'Sarıyer': [
    'maslak', 'istinye', 'yeniköy', 'yenikoy', 'tarabya', 'emirgan', 'zekeriyaköy', 'zekeriyakoy',
    'rumelihisarı', 'rumelihisari', 'baltalimanı', 'baltalimani', 'reşitpaşa', 'resitpasa',
    'kireçburnu', 'kirecburnu', 'büyükdere', 'buyukdere', 'bahçeköy', 'uskumruköy', 'kilyos', 'kumköy', 'rumelifeneri', 'garipçe', 'ayazağa'
  ],
  'Eyüpsultan': [
    'göktürk', 'goktürk', 'gokturk', 'kemerburgaz', 'alibeyköy', 'alibeykoy', 'yeşilpınar', 'yesilpinar',
    'karadolap', 'akşemsettin', 'çırçır', 'circir', 'rami', 'topçular', 'nişanca', 'düğmeciler', 'defterdar'
  ],
  'Gaziosmanpaşa': [
    'küçükköy', 'kucukkoy', 'beşyüzevler', 'besyuzevler', 'bağlarbaşı', 'baglarbasi',
    'barbaros hayrettin paşa', 'fevzi çakmak', 'hürriyet', 'karadeniz', 'karayolları', 'kazım karabekir', 'mevlana', 'pazariçi', 'yıldıztabya'
  ],
  'Bahçelievler': [
    'şirinevler', 'sirinevler', 'yenibosna', 'yayla', 'soğanlı', 'soganli',
    'kocasinan', 'hürriyet', 'çobançeşme', 'cumhuriyet', 'fevzi çakmak'
  ],
  'Küçükçekmece': [
    'sefaköy', 'sefakoy', 'cennet', 'kanarya', 'inönü', 'halkalı', 'halkali',
    'atakent', 'yeşilova', 'gültepe', 'beşyol', 'istasyon', 'yarımburgaz'
  ],
  'Avcılar': [
    'cihangir', 'denizköşkler', 'gümüşpala', 'ambarlı', 'parseller', 'tahtakale', 'yeşilkent', 'mustafa kemal paşa'
  ],
  'Bağcılar': [
    'güneşli', 'gunesli', 'mahmutbey', 'yüzyıl', 'yuzyil', 'evren', 'demirkapı', 'göztepe', 'kemalpaşa', 'kirazlı', 'fatih', 'çınar'
  ],
  'Başakşehir': [
    'bahçeşehir', 'bahcesehir', 'kayaşehir', 'kayasehir', 'altınşehir', 'güvercintepe', 'şahintepe', 'ziya gökalp', 'başak'
  ],
  'Beylikdüzü': [
    'beykent', 'gürpınar', 'gurpinar', 'yakuplu', 'kavaklı', 'dereağzı', 'marmara', 'sahil', 'adnan kahveci', 'barış', 'büyükşehir'
  ],
  'Büyükçekmece': [
    'mimaroba', 'sinanoba', 'kumburgaz', 'celaliye', 'kamiloba', 'güzelce', 'alkent', 'karaağaç', 'tepecik', 'türkoba', 'çakmaklı'
  ],
  'Esenyurt': [
    'kıraç', 'kirac', 'haramidere', 'saadetdere', 'yeşilkent', 'güzelyurt', 'mehterçeşme', 'namık kemal', 'incirtepe', 'ardıçlı'
  ],
  'Sultanbeyli': [
    'hasanpaşa', 'akşemsettin', 'battalgazi', 'ahmet yesevi', 'fatih', 'mecidiye', 'mimar sinan', 'turgut reis', 'yavuz selim', 'mehmet akif'
  ],
  'Sancaktepe': [
    'sarıgazi', 'sarigazi', 'samandıra', 'samandira', 'yenidoğan', 'yenidogan', 'akpınar', 'emek', 'inönü', 'kemal türkler', 'meclis', 'veysel karani'
  ],
  'Çekmeköy': [
    'taşdelen', 'tasdelen', 'alemdağ', 'alemdag', 'ömerli', 'omerli', 'mimarsinan', 'ekşioğlu', 'hamidiye', 'mehmet akif', 'soğukpınar', 'aydınlar'
  ],
  'Tuzla': [
    'içmeler', 'icmeler', 'aydınlı', 'aydinli', 'orhanlı', 'akfırat', 'tepeören', 'postane', 'yaylalı', 'istasyon', 'evliya çelebi'
  ]
};

/**
 * Türkçe karakter duyarlı küçük harfe çevirme yardımcısı
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/Ğ/g, 'ğ')
    .replace(/Ü/g, 'ü')
    .replace(/Ş/g, 'ş')
    .replace(/Ö/g, 'ö')
    .replace(/Ç/g, 'ç')
    .toLowerCase();
}

// Hızlı O(1) erişim için semt/mahalle -> ilçe haritası oluşturma
const FAST_NEIGHBORHOOD_MAP = new Map<string, string>();
for (const [officialDist, neighborhoods] of Object.entries(DISTRICT_NEIGHBORHOODS_MAP)) {
  for (const nh of neighborhoods) {
    FAST_NEIGHBORHOOD_MAP.set(normalizeText(nh), officialDist);
  }
}

/**
 * Verilen mahalle/semt adından bağlı olduğu resmi ilçeyi bulur.
 * Örn: "İçerenköy" -> "Ataşehir", "Caddebostan" -> "Kadıköy"
 */
export function getDistrictForNeighborhood(neighborhoodOrDist: string): string | null {
  if (!neighborhoodOrDist) return null;
  const normInput = normalizeText(neighborhoodOrDist.trim());

  // Önce doğrudan resmi ilçelerden biri mi bak
  const directOfficialMatch = ISTANBUL_DISTRICTS.find(
    d => normalizeText(d) === normInput
  );
  if (directOfficialMatch) return directOfficialMatch;

  return FAST_NEIGHBORHOOD_MAP.get(normInput) || null;
}

/**
 * Adres veya ilçe metni içerisinden resmi ilçeyi tespit eden helper fonksiyon.
 *
 * @param address - Eczane adres metni (Örn: "İçerenköy Mah. Karslı Ahmet Cad. No:12")
 * @param fallbackDist - API'den veya veriden gelen ilçe/mahalle metni (Örn: "İçerenköy")
 * @returns Tespit edilen resmi ilçe adı (Örn: "Ataşehir")
 */
export function extractDistrictFromAddress(address: string = '', fallbackDist: string = ''): string {
  const normAddress = normalizeText(address);
  const normFallback = normalizeText(fallbackDist);

  // 1. fallbackDist resmi ilçe adıyla eşleşiyor mu?
  if (fallbackDist && fallbackDist.trim() !== '' && fallbackDist.trim() !== 'İstanbul') {
    const matchedDist = ISTANBUL_DISTRICTS.find(
      d => normalizeText(d) === normFallback
    );
    if (matchedDist) return matchedDist;

    // 2. fallbackDist bir mahalle ise bağlı olduğu ilçeyi bul (Örn: "İçerenköy" -> "Ataşehir")
    const parentDistFromFallback = getDistrictForNeighborhood(fallbackDist);
    if (parentDistFromFallback) return parentDistFromFallback;
  }

  // 3. Adres metni içinde resmi ilçeleri ara
  for (const district of ISTANBUL_DISTRICTS) {
    const normalizedDist = normalizeText(district);
    const regex = new RegExp(`\\b${normalizedDist}\\b`, 'i');
    if (regex.test(normAddress) || normAddress.includes(normalizedDist)) {
      return district;
    }
  }

  // 4. Adres metni içinde bilinen mahalleleri ara ve ilçesini bul
  for (const [officialDistrict, neighborhoods] of Object.entries(DISTRICT_NEIGHBORHOODS_MAP)) {
    for (const neighborhood of neighborhoods) {
      if (normAddress.includes(neighborhood)) {
        return officialDistrict;
      }
    }
  }

  // Eğer hiçbir şey uyuşmadıysa fallback veya "Merkez" döndür
  return fallbackDist && fallbackDist !== 'İstanbul' ? fallbackDist : 'Merkez';
}

/**
 * Bir eczanenin seçili ilçeye ait olup olmadığını kontrol eden helper fonksiyon.
 * Hem resmi ilçe adı eşleşmesini hem de İçerenköy -> Ataşehir gibi mahalle eşleşmesini sağlar.
 * Kullanıcıya 1.5 km'den yakın eczaneleri ilçe sınırından bağımsız olarak gösterir (100m yakındaki eczane kaçmasın).
 */
export function isPharmacyInDistrict(
  itemDist: string,
  itemAddress: string,
  selectedDistrict: string,
  itemNumericDistance?: number
): boolean {
  if (!selectedDistrict || selectedDistrict === 'Tüm Şehirler' || selectedDistrict === 'Tüm İlçeler') {
    return true;
  }

  // Kullanıcıya 1.5 km'den yakın eczaneler (100m, 300m vb.) hangi ilçe seçili olursa olsun gösterilsin
  if (itemNumericDistance !== undefined && itemNumericDistance <= 1.5) {
    return true;
  }

  const normSelected = normalizeText(selectedDistrict);
  const normDist = normalizeText(itemDist);
  const normAddress = normalizeText(itemAddress);

  // 1. Doğrudan ilçe eşleşmesi (Örn: item.dist === "Ataşehir")
  if (normDist === normSelected) {
    return true;
  }

  // 2. Eczane ilçesi (itemDist) seçilen ilçenin bir mahallesi mi?
  const parentDist = FAST_NEIGHBORHOOD_MAP.get(normDist);
  if (parentDist && normalizeText(parentDist) === normSelected) {
    return true;
  }

  // 3. Adres metni seçilen ilçenin adını içeriyor mu?
  if (normAddress.includes(normSelected)) {
    return true;
  }

  // 4. Adres metni seçilen ilçeye ait herhangi bir mahalleyi içeriyor mu? (Örn: "İçerenköy Mah.")
  const targetNeighborhoods = DISTRICT_NEIGHBORHOODS_MAP[selectedDistrict] || [];
  for (let i = 0; i < targetNeighborhoods.length; i++) {
    if (normAddress.includes(targetNeighborhoods[i])) {
      return true;
    }
  }

  return false;
}

/**
 * Mevcut eczane listesindeki benzersiz ilçeleri dinamik olarak filtre menüsüne çıkarır.
 * Mahalle adlarını otomatik olarak bağlı oldukları resmi ilçelere dönüştürür.
 *
 * @param pharmacies - Eczane listesi
 * @returns ['Tüm Şehirler', 'Ataşehir', 'Kadıköy', ...]
 */
export function getAvailableDistricts(pharmacies: Pharmacy[]): string[] {
  const districtSet = new Set<string>();

  pharmacies.forEach(item => {
    if (item.dist && item.dist !== 'Tüm Şehirler' && item.dist !== 'Tüm İlçeler') {
      const resolved = extractDistrictFromAddress(item.address, item.dist);
      if (resolved && resolved !== 'Merkez') {
        districtSet.add(resolved);
      } else {
        districtSet.add(item.dist);
      }
    }
  });

  const sortedDistricts = Array.from(districtSet).sort((a, b) => a.localeCompare(b, 'tr'));
  return ['Tüm Şehirler', ...sortedDistricts];
}
