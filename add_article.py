import json
import os
import subprocess
from datetime import datetime

JSON_FILE_PATH = "articles.json"

def get_input(prompt, default=""):
    value = input(prompt).strip()
    if not value:
        return default
    return value

def main():
    print("=" * 50)
    print("      TMA WEB SITE - MANUEL MAKALE EKLEME PANELİ      ")
    print("=" * 50)
    
    # Load existing articles
    articles = []
    if os.path.exists(JSON_FILE_PATH):
        try:
            with open(JSON_FILE_PATH, "r", encoding="utf-8") as f:
                articles = json.load(f)
        except Exception as e:
            print(f"Uyarı: articles.json okunamadı, yeni liste oluşturulacak. Hata: {e}")

    # Gather inputs
    title_tr = get_input("Makale Başlığı (TR): ")
    if not title_tr:
        print("Hata: Başlık boş olamaz!")
        return

    title_en = get_input(f"Makale Başlığı (EN) [Varsayılan: {title_tr}]: ", title_tr)
    
    link = get_input("LinkedIn Makale/Gönderi Bağlantısı (URL): ")
    if not link:
        print("Hata: Bağlantı boş olamaz!")
        return

    default_image = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800"
    image = get_input(f"Görsel URL'si [Varsayılan: Trading Görseli]: ", default_image)
    
    default_date = datetime.now().strftime("%Y-%m-%d")
    date = get_input(f"Yayın Tarihi (YYYY-MM-DD) [Varsayılan: Bugün - {default_date}]: ", default_date)
    
    summary_tr = get_input("Makale Özeti / Açıklaması (TR): ")
    if len(summary_tr) > 180:
        print(f"Uyarı: Özet 180 karakterden uzun ({len(summary_tr)} karakter). Kırpılabilir.")
    
    summary_en = get_input(f"Makale Özeti / Açıklaması (EN) [Varsayılan: TR Özet]: ", summary_tr)

    # Build object
    article_id = str(int(datetime.now().timestamp()))
    new_article = {
        "id": article_id,
        "title": title_tr,      # Fallback/General title (TR is primary for this site)
        "title_tr": title_tr,
        "title_en": title_en,
        "summary": summary_tr,  # Fallback/General summary
        "summary_tr": summary_tr,
        "summary_en": summary_en,
        "link": link,
        "image": image,
        "date": date
    }

    # Prepend new article
    articles.insert(0, new_article)
    
    # Keep only top 15
    articles = articles[:15]

    # Save JSON
    try:
        with open(JSON_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(articles, f, indent=2, ensure_ascii=False)
        print("\n[BAŞARILI] Makale başarıyla articles.json dosyasına eklendi!")
        print(f"Eklenen Başlık: {title_tr}\n")
    except Exception as e:
        print(f"Hata: JSON dosyasına yazılamadı: {e}")
        return

    # Git push helper
    push_to_git = get_input("Değişiklikleri GitHub'a otomatik pushlamak ister misiniz? (y/n) [Varsayılan: n]: ", "n").lower()
    if push_to_git == 'y':
        print("\nGitHub'a gönderiliyor...")
        try:
            subprocess.run(["git", "add", JSON_FILE_PATH], check=True)
            commit_msg = f"feat: add new article '{title_tr}'"
            subprocess.run(["git", "commit", "-m", commit_msg], check=True)
            subprocess.run(["git", "push"], check=True)
            print("\n[BAŞARILI] Kodlar GitHub'a gönderildi. GitHub Pages birkaç dakika içinde güncellenecektir!")
        except Exception as e:
            print(f"\n[HATA] Git işlemleri sırasında bir sorun oluştu. Lütfen manuel commit/push yapın. Hata: {e}")

if __name__ == "__main__":
    main()
