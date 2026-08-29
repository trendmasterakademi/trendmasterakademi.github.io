export default {
  "slug": "yedek-var-sanildi-yedek-yok",
  "no": "09",
  "baslik": {
    "tr": "Yedek var sanılıyordu, yedek yok",
    "en": "Backup Assumed to Exist, No Valid Backup"
  },
  "diyagramBaslik": {
    "tr": "Yedek yok",
    "en": "No valid backup"
  },
  "kirinti": {
    "tr": "Devir & Süreklilik",
    "en": "Handover & Continuity"
  },
  "aciliyet": {
    "seviye": "kritik",
    "etiket": {
      "tr": "Kritik · veri riski",
      "en": "Critical · data loss risk"
    }
  },
  "ozet": {
    "tr": "Bir sorun çıktı, yedeğe dönülmek istendi ve yedeğin ya hiç alınmadığı ya da geri yüklenemediği görüldü. Yedeğin var olması ile geri yüklenebilir olması aynı şey değildir; ikincisi denenmeden bilinmez.",
    "en": "An outage occurred, a rollback to backup was requested, only to discover snapshots were never generated or are un-restorable. A backup file existing versus being restorable are entirely different; the latter is unknown until tested."
  },
  "logSatirlari": [
    "Yedek klasöründeki son dosyanın tarihi   ← aylar öncesi mi?",
    "cron log: backup job — exit status 1",
    "Yedek dosya boyutu 0 byte / birkaç KB",
    "Depolama sağlayıcısı: quota exceeded"
  ],
  "logNotu": {
    "tr": "Yedek işi çoğu zaman sessizce başarısız olur. Hata bir yere düşer ama kimse okumaz; klasörde dosya göründüğü için sorun fark edilmez.",
    "en": "Backup routines fail silently most of the time. Errors are emitted to unmonitored logs while stale files in the folder give a false sense of security."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "Yedek alınmıyor",
        "en": "Backups not running"
      },
      "aciklama": {
        "tr": "Görev kurulmuş ama çalışmıyor: zamanlayıcı durmuş, kimlik değişmiş ya da hedef dolmuş.",
        "en": "Cron was configured but terminated: scheduler daemon died, auth expired, or target bucket filled up."
      },
      "kanit": {
        "tr": "Son yedek tarihi çok eski → A",
        "en": "Latest backup date is stale → A"
      },
      "diyagramAd": {
        "tr": "Yedek alınmıyor",
        "en": "Backups failing"
      },
      "diyagramTest": {
        "tr": [
          "Son yedek dosyası",
          "kaç günlük?"
        ],
        "en": [
          "How old is the",
          "latest backup file",
          "in storage?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Görev onarımı +",
          "başarısızlık",
          "bildirimi"
        ],
        "en": [
          "Cron repair +",
          "dead-man switch",
          "alerts"
        ]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "Yedek eksik alınıyor",
        "en": "Partial / incomplete dump"
      },
      "aciklama": {
        "tr": "Dosyalar var ama veritabanı yok, ya da tersi. Kısmi yedek olay anında tam geri dönüş sağlamaz.",
        "en": "Uploaded assets exist without SQL dumps, or vice versa. Partial snapshots prevent full recovery during disaster recovery."
      },
      "kanit": {
        "tr": "Yedekte veritabanı dökümü yok → B",
        "en": "Missing SQL dump in archive → B"
      },
      "diyagramAd": {
        "tr": "Yedek eksik",
        "en": "Incomplete dump"
      },
      "diyagramTest": {
        "tr": [
          "Yedekte veritabanı",
          "dökümü var mı?"
        ],
        "en": [
          "Does archive",
          "contain valid SQL",
          "dump file?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Kapsam genişletme",
          "+ boyut kontrolü"
        ],
        "en": [
          "Full scope dump",
          "+ file size",
          "threshold check"
        ]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "Geri yüklenemiyor",
        "en": "Un-restorable / corrupted"
      },
      "aciklama": {
        "tr": "Dosya bozuk, şifresi kayıp ya da sürüm uyumsuz. Hiç denenmediği için bugüne kadar bilinmiyordu.",
        "en": "Archive is corrupt, decryption key is missing, or schema versions clash. Never tested until live disaster hit."
      },
      "kanit": {
        "tr": "Test geri yükleme başarısız → C",
        "en": "Test sandbox restore failed → C"
      },
      "diyagramAd": {
        "tr": "Geri yüklenemiyor",
        "en": "Un-restorable"
      },
      "diyagramTest": {
        "tr": [
          "Boş ortama geri",
          "yükleme denendi mi?"
        ],
        "en": [
          "Was restore",
          "tested in clean",
          "sandbox env?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Düzenli geri",
          "yükleme provası"
        ],
        "en": [
          "Automated drill",
          "restoration in",
          "staging sandbox"
        ]
      }
    }
  ],
  "kimCozer": {
    "tr": "Sistem yöneticisi. Ama asıl çözüm teknik değil rutinseldir: yedek başarısız olduğunda haber veren bir bildirim ve düzenli aralıklarla yapılan geri yükleme provası. Denenmemiş yedek, yedek sayılmaz.",
    "en": "Sysadmin / DevOps. But the true solution is procedural: dead-man failure alerts and scheduled sandbox restoration drills. An untested backup is not a backup."
  },
  "cozulmezse": {
    "tr": "Yedeksiz geçen her gün, tek bir donanım arızasının ya da yanlış komutun projeyi tamamen bitirebileceği bir gündür. Bu riskin bedeli ancak gerçekleştiğinde görülür.",
    "en": "Every day operating without restorable backups is a single disk crash or rogue query away from total business termination."
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
