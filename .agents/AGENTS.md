# Antigravity Workspace Rules

- **Performans & Sistem Güvenliği (Kritik - Trade / Terminal Koruması):** Kullanıcı aktif trade/terminal operasyonları yürütmektedir. Sistem kaynaklarını kilitleyen, CPU/GPU/RAM tüketen, ağır döngüler içeren `browser_subagent` veya otomatik headless ekran kaydı/tıklama botları KESİNLİKLE KULLANILMAYACAKTIR. Site önizlemeleri veya kontrolleri için sadece doğrudan localhost bağlantısı verilmeli, hafif ve hızlı yanıtlar üretilmelidir.

- **⛔ Sohbet kaydı tutulmayacak:** `sohbet_gecmisi.md`, `sohbet_gunlugu.md` veya benzeri bir oturum/geçmiş kaydı **oluşturulmayacak, güncellenmeyecek, depoya eklenmeyecek.** Eski "Sohbet Günlüğü Otomasyonu" kuralı 2026-08-30'da kaldırılmıştır — sohbet geçmişi artık ortam tarafından tutulmaktadır, ayrıca kayıt gereksizdir.

- **⛔ Depo kökü yayına açıktır:** Bu depo `trendmasterakademi.github.io` olarak kök dizinden servis edilir; köke konan **her dosya canlı sitede herkese erişilebilir olur.** Çalışma notu, döküm, yardımcı betik veya iç belge depo köküne **konmayacaktır.** Böyle bir dosya gerekiyorsa depo dışına (`../TMA-Arsiv/`) yazılır.
