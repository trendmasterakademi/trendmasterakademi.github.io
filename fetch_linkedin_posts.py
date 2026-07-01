import os
import json
import xml.etree.ElementTree as ET
import urllib.request
import urllib.error
from datetime import datetime

JSON_FILE_PATH = "articles.json"

def fetch_rss_feed(feed_url):
    print(f"RSS feedi indiriliyor: {feed_url}")
    try:
        req = urllib.request.Request(
            feed_url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            return response.read()
    except urllib.error.URLError as e:
        print(f"HATA: RSS feed indirilemedi: {e}")
        return None

def parse_date(date_str):
    # Try to parse standard RSS pubDate formats (e.g., "Tue, 30 Jun 2026 07:30:00 GMT")
    formats = [
        "%a, %d %b %Y %H:%M:%S %Z",
        "%a, %d %b %Y %H:%M:%S %z",
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%d"
      ]
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str.strip(), fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
    # Fallback to current date if parsing fails
    return datetime.now().strftime("%Y-%m-%d")

def clean_summary(desc):
    if not desc:
        return ""
    # Strip HTML tags simply
    import re
    clean = re.sub('<[^<]+?>', '', desc)
    clean = clean.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&quot;', '"')
    # Limit length to 180 chars
    clean = clean.strip()
    if len(clean) > 180:
        return clean[:177] + "..."
    return clean

def extract_image_url(item_node):
    # Try to find media tags in the RSS item
    namespaces = {
        'media': 'http://search.yahoo.com/mrss/',
        'content': 'http://purl.org/rss/1.0/modules/content/'
    }
    
    # 1. Try media:content or media:thumbnail
    for prefix, uri in namespaces.items():
        ET.register_namespace(prefix, uri)
        
    try:
        media_content = item_node.find('.//{http://search.yahoo.com/mrss/}content')
        if media_content is not None and 'url' in media_content.attrib:
            return media_content.attrib['url']
        
        media_thumbnail = item_node.find('.//{http://search.yahoo.com/mrss/}thumbnail')
        if media_thumbnail is not None and 'url' in media_thumbnail.attrib:
            return media_thumbnail.attrib['url']
    except Exception:
        pass
        
    # 2. Try looking in description or content:encoded for an <img> src
    desc = item_node.find('description')
    if desc is not None and desc.text:
        import re
        img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', desc.text)
        if img_match:
            return img_match.group(1)
            
    # Default fallback image
    return "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800"

def main():
    feed_url = os.environ.get("LINKEDIN_FEED_URL")
    if not feed_url:
        print("BİLGİ: LINKEDIN_FEED_URL çevre değişkeni tanımlı değil. Otomatik güncelleme atlanıyor.")
        return

    xml_data = fetch_rss_feed(feed_url)
    if not xml_data:
        return

    try:
        root = ET.fromstring(xml_data)
    except ET.ParseError as e:
        print(f"HATA: XML ayrıştırılamadı: {e}")
        return

    # Load existing articles
    existing_articles = []
    if os.path.exists(JSON_FILE_PATH):
        try:
            with open(JSON_FILE_PATH, "r", encoding="utf-8") as f:
                existing_articles = json.load(f)
        except Exception as e:
            print(f"Mevcut JSON okunamadı, yeni liste oluşturulacak: {e}")

    # Track links to prevent duplicates
    existing_links = {a["link"] for a in existing_articles}
    new_articles = []

    # Parse RSS items
    items = root.findall('.//item')
    print(f"Toplam {len(items)} adet yayın bulundu.")
    
    for item in items:
        title_node = item.find('title')
        link_node = item.find('link')
        desc_node = item.find('description')
        pubdate_node = item.find('pubDate')

        title = title_node.text if title_node is not None else "LinkedIn Paylaşımı"
        link = link_node.text if link_node is not None else ""
        desc = desc_node.text if desc_node is not None else ""
        pubdate = pubdate_node.text if pubdate_node is not None else ""

        if not link:
            continue

        # Prevent duplicate entries
        if link in existing_links:
            continue

        date = parse_date(pubdate)
        summary = clean_summary(desc)
        image = extract_image_url(item)

        # Generate simple ID based on timestamp
        article_id = str(int(datetime.now().timestamp()) + len(new_articles))

        new_articles.append({
            "id": article_id,
            "title": title,
            "summary": summary,
            "link": link,
            "image": image,
            "date": date
        })

    if new_articles:
        print(f"{len(new_articles)} adet yeni makale eklendi.")
        # Prepend new articles (so newest are at the top)
        updated_articles = new_articles + existing_articles
        
        # Keep maximum 15 articles to ensure fast loading times
        updated_articles = updated_articles[:15]
        
        try:
            with open(JSON_FILE_PATH, "w", encoding="utf-8") as f:
                json.dump(updated_articles, f, indent=2, ensure_ascii=False)
            print("articles.json başarıyla güncellendi!")
        except Exception as e:
            print(f"HATA: JSON yazılırken hata oluştu: {e}")
    else:
        print("Yeni makale bulunmadı.")

if __name__ == "__main__":
    main()
