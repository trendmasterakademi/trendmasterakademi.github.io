export default {
  "slug": "guncelleme-sonrasi-veri-kayboldu",
  "no": "05",
  "baslik": {
    "tr": "Güncellemeden sonra veri kayboldu sanılıyor",
    "en": "Data Assumed Lost After System Update"
  },
  "diyagramBaslik": {
    "tr": "Veri kayboldu sanısı",
    "en": "Perceived data loss"
  },
  "kirinti": {
    "tr": "Veri & Devir",
    "en": "Data & Migration"
  },
  "aciliyet": {
    "seviye": "kritik",
    "etiket": {
      "tr": "Kritik · veri paniği",
      "en": "Critical · data panic"
    }
  },
  "ozet": {
    "tr": "Bir güncellemeden sonra kayıtlar görünmüyor ve panik \"veriler silindi\" diye başlıyor. Çoğu vakada veri yerindedir; onu okuyan sorgu değişmiştir. Ama bu doğrulanmadan yapılan her müdahale gerçek kaybı yaratabilir.",
    "en": "Records vanish after a release, triggering data deletion panic. In most incidents, data remains intact; the query reading it mutated. Attempting hasty fixes without proper diagnosis risks causing genuine data loss."
  },
  "logSatirlari": [
    "Göç log'u: rolled back veya yarıda kesilmiş",
    "Column not found / Unknown column in field list",
    "Kayıt sayısı: tablodaki satır sayısı hâlâ eski değerde mi?",
    "Durum veya silme alanı toplu güncellenmiş mi?"
  ],
  "logEslesme": [
    { "satir": 0, "harf": "B" },
    { "satir": 1, "harf": "B" }
  ],
  "logNotu": {
    "tr": "İlk yapılacak iş kayıt saymaktır. Tabloda satır duruyorsa veri kaybolmamıştır, görünürlüğü kaybolmuştur. Bu ayrım müdahalenin yönünü tamamen değiştirir.",
    "en": "The first step is counting table rows directly. If row counts match, data is not erased; its visibility is filtered out. This distinction fundamentally changes the incident response vector."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "Filtre değişti",
        "en": "Default query filter changed"
      },
      "aciklama": {
        "tr": "Yeni bir durum alanı veya yumuşak silme kolonu eklendi; eski kayıtlar varsayılan filtrenin dışında kaldı.",
        "en": "A new status column or soft-delete flag was added; legacy rows fail the default WHERE clause."
      },
      "kanit": {
        "tr": "Satır sayısı eskisiyle aynı → A",
        "en": "Row count unchanged in DB → A"
      },
      "diyagramAd": {
        "tr": "Filtre değişti",
        "en": "Filter changed"
      },
      "diyagramTest": {
        "tr": [
          "Tablodaki satır",
          "sayısı eskisiyle",
          "aynı mı?"
        ],
        "en": [
          "Is database row",
          "count identical to",
          "baseline?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Varsayılan değeri",
          "geriye dönük ata"
        ],
        "en": [
          "Backfill default",
          "flag on legacy",
          "records"
        ]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "Göç yarıda kaldı",
        "en": "Interrupted schema migration"
      },
      "aciklama": {
        "tr": "Şema değişikliği kesildi; bazı tablolar yeni, bazıları eski hâlde. Uygulama ikisini birden okuyamıyor.",
        "en": "DDL migration halted mid-stream; half the tables are upgraded, causing joins to fail."
      },
      "kanit": {
        "tr": "Göç log'unda kesinti → B",
        "en": "Migration abort in deploy log → B"
      },
      "diyagramAd": {
        "tr": "Göç yarıda kaldı",
        "en": "Partial migration"
      },
      "diyagramTest": {
        "tr": [
          "Göç log'unda",
          "yarıda kesilme",
          "var mı?"
        ],
        "en": [
          "Did migration log",
          "terminate with an",
          "unhandled error?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Yedekten dön ·",
          "göçü baştan",
          "çalıştır"
        ],
        "en": [
          "Restore snapshot ·",
          "re-run clean",
          "migration script"
        ]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "Gerçek silme",
        "en": "Genuine bulk deletion"
      },
      "aciklama": {
        "tr": "Bir toplu işlem kayıtları gerçekten sildi. Üçü içinde en az görüleni ama tek gerçek kayıp hâli budur.",
        "en": "A runaway script or bad WHERE clause executed actual hard DELETE. Rare, but the only true data loss scenario."
      },
      "kanit": {
        "tr": "Satır sayısı gerçekten düşmüş → C",
        "en": "Row count decreased in DB → C"
      },
      "diyagramAd": {
        "tr": "Gerçek silme",
        "en": "Actual deletion"
      },
      "diyagramTest": {
        "tr": [
          "Satır sayısı",
          "gerçekten düştü",
          "mü?"
        ],
        "en": [
          "Did physical row",
          "count actually",
          "drop?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Yedekten geri",
          "yükleme · süre",
          "kritik"
        ],
        "en": [
          "Point-in-time",
          "backup restore ·",
          "time critical"
        ]
      }
    }
  ],
  "kimCozer": {
    "tr": "İlk adım geliştirici çağırmak değil, hiçbir şeye yazmamaktır. Yeni kayıt eklemek ve tablo değiştirmek geri dönüş seçeneklerini daraltır. A dakikalar içinde kapanır, B yedekten yürütülür, C'de her saat önemlidir.",
    "en": "The absolute first rule is freezing all writes. Writing new data or altering schemas destroys recovery options. A is resolved in minutes, B via atomic rollback, C requires immediate point-in-time snapshot recovery."
  },
  "cozulmezse": {
    "tr": "Gerçek silme hâlinde geri dönüş penceresi yedek politikanız kadardır. En sık yapılan hata, teşhis konmadan \"düzeltmeye\" başlamak ve kurtarılabilir veriyi üzerine yazmaktır.",
    "en": "Under true deletion, the recovery window equals snapshot retention. The most frequent catastrophe is attempting blind repairs that overwrite restorable blocks."
  },
  "ilgiliTerimler": [
    "migration",
    "staging-ortami",
    "teknik-borc"
  ],
  "ilgiliHizmet": {
    "baslik": {
      "tr": "Devir Hazırlık Kontrolü",
      "en": "Handover Readiness Audit"
    },
    "link": "/devir-kontrolu/"
  }
};
