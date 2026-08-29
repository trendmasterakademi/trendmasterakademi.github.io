export const caseStudies = [
  {
    id: 'veri-kaybi-sanilan-sistem',
    baslik: {
      tr: '"Veriler kayboldu" sanılan sistemin gerçek hikâyesi',
      en: 'The system everyone thought had lost its data'
    },
    durum: {
      tr: 'Çok şubeli bir kurumun web sistemi ile arka plan verileri arasındaki bağ koptu. On binlerce kayıt erişilemez hâle geldi. İlk değerlendirme "veri kaybı" yönündeydi; kurum içinde verilerin ele geçirilmiş olabileceği konuşuluyordu.',
      en: "The link between a multi-branch organization's web system and its backend data broke. Tens of thousands of records became inaccessible. The initial assessment was data loss; internally, people were discussing whether the data had been stolen."
    },
    teshis: {
      tr: 'Kod tabanında arıza aramadık. Altyapının bulut üzerinde olduğunu görünce e-posta arşivlerini taradık. Beş günlük tarama sonunda sağlayıcının aylar önce gönderdiği yazışmalar çıktı: kapasite artışı nedeniyle altyapı değiştirilecek, güncelleme yapılması gerekiyordu. Beş ayrı e-posta, sonuncusunda "son uyarı" ibaresi. Hiçbiri yanıtlanmamıştı.',
      en: "We didn't look for a fault in the codebase. Once we saw the infrastructure was hosted in the cloud, we searched the email archives. After five days of scanning, the provider's correspondence surfaced — sent months earlier: the infrastructure was being changed to increase capacity, and an update was required. Five separate emails, the last marked \"final notice\". None had been answered."
    },
    kokNeden: {
      tr: 'Kod değil, süreç. Sağlayıcı, güncelleme yapılmadığı için verileri koruma amacıyla ayrı bir arşive almış; ardından gelen ödeme uyarıları da karşılıksız kalınca hesabı askıya almıştı. Veri ne çalınmıştı ne kaybolmuştu — erişim kapanmıştı ve durum yönetime iletilmemişti.',
      en: 'Not code — process. Because no update was made, the provider had moved the data into a separate archive to protect it; when the subsequent payment notices also went unanswered, the account was suspended. The data had neither been stolen nor lost — access had been closed, and the situation had not been escalated to management.'
    },
    sonuc: {
      tr: 'Veri sağlayıcı tarafında eksiksiz duruyordu. Erişim geri alındı, sistem ayağa kaldırıldı.',
      en: "The data was intact on the provider's side. Access was restored and the system brought back up.",
      highlight: {
        tr: 'Veri kaybı: sıfır.',
        en: 'Data lost: none.'
      }
    },
    ajansIcin: {
      tr: 'Bu vakada tek satır kod hatalı değildi. Müşterinizin altyapısı birinin kişisel hesabına kayıtlıysa ve yenileme uyarıları okunmayan bir kutuya düşüyorsa, aynı senaryo sizi de bulur — ve ilk bakışta "veri kaybı" gibi görünür.',
      en: "Not a single line of code was at fault in this case. If your client's infrastructure sits under someone's personal account and renewal notices land in an inbox nobody reads, the same scenario will find you — and at first glance it will look like data loss."
    }
  }
];
