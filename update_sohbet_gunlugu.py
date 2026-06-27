import os
import sqlite3
import re
import datetime

conv_dir = r"C:\Users\mehme\.gemini\antigravity-ide\conversations"
sohbet_gunlugu_path = r"c:\Users\mehme\.gemini\antigravity-ide\scratch\TMA-Web-Site\sohbet_gunlugu.md"
scratch_dir = r"c:\Users\mehme\.gemini\antigravity-ide\scratch"

# Get the actual folder names on disk to resolve the protobuf serialization suffix issue
try:
    known_workspaces = [f for f in os.listdir(scratch_dir) if os.path.isdir(os.path.join(scratch_dir, f))]
except Exception:
    known_workspaces = ["SocialMedia", "TMA-Web-Site", "Youtube", "CodeCompare", "upwork-workshop"]

def clean_workspace_name(name):
    # Match the matched name with known workspace folders on disk
    for kw in known_workspaces:
        if name.lower().startswith(kw.lower()):
            return kw
    return name

def extract_clean_strings(blob):
    if not blob:
        return []
    text = blob.decode('utf-8', errors='replace')
    pattern = r'[A-Za-z0-9ğüşöçİĞÜŞÖÇ\s\.,;:!\?\-\(\)\'\"\`#\+]{15,}'
    matches = re.findall(pattern, text)
    cleaned = []
    for m in matches:
        m_strip = m.strip()
        if len(m_strip) < 15:
            continue
        if any(x in m_strip for x in ['file://', 'C:\\', 'c:\\', 'execute_url', 'read_file', 'read_url', 'http://', 'https://']):
            continue
        if m_strip.startswith('{') or m_strip.endswith('}'):
            continue
        if len(set(m_strip)) < 6:
            continue
        if re.search(r'^[a-fA-F0-9\-]{36}', m_strip):
            continue
        if re.search(r'^[A-Za-z0-9\+\/]{20,}=*$', m_strip):
            continue
        # Only keep if it has spaces (like a sentence)
        if ' ' in m_strip:
            cleaned.append(m_strip)
    return cleaned

def get_workspace_from_db(db_path):
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        
        cur.execute("SELECT * FROM trajectory_metadata_blob")
        row = cur.fetchone()
        if row and len(row) > 1:
            blob = row[1]
            matches = re.findall(rb'scratch/([A-Za-z0-9_\-]+)', blob)
            if matches:
                names = list(set([m.decode('utf-8', errors='ignore') for m in matches]))
                for n in names:
                    clean = clean_workspace_name(n)
                    if clean in known_workspaces:
                        return clean
                    
        cur.execute("SELECT step_payload FROM steps WHERE step_payload LIKE '%scratch/%'")
        rows = cur.fetchall()
        for row in rows:
            payload = row[0]
            matches = re.findall(rb'scratch/([A-Za-z0-9_\-]+)', payload)
            if matches:
                names = list(set([m.decode('utf-8', errors='ignore') for m in matches]))
                for n in names:
                    clean = clean_workspace_name(n)
                    if clean in known_workspaces:
                        return clean
    except Exception:
        pass
    return "Genel / Diğer"

def get_first_user_msg_db(db_path):
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        
        cur.execute("SELECT step_payload FROM steps WHERE step_type = 14 ORDER BY idx")
        rows = cur.fetchall()
        for row in rows:
            payload = row[0]
            strs = extract_clean_strings(payload)
            for s in strs:
                s_clean = " ".join(s.strip().split())
                if len(s_clean) > 20:
                    return s_clean[:90] + ("..." if len(s_clean) > 90 else "")
                    
        cur.execute("SELECT step_payload FROM steps ORDER BY idx")
        rows = cur.fetchall()
        for row in rows:
            payload = row[0]
            strs = extract_clean_strings(payload)
            for s in strs:
                s_clean = " ".join(s.strip().split())
                if len(s_clean) > 20 and ' ' in s_clean:
                    return s_clean[:90] + ("..." if len(s_clean) > 90 else "")
    except Exception as e:
        return f"Hata: {e}"
    return "(Başlangıç mesajı bulunamadı)"

def get_pb_summary(pb_path):
    try:
        with open(pb_path, 'rb') as f:
            data = f.read()
        strs = extract_clean_strings(data)
        for s in strs:
            s_clean = " ".join(s.strip().split())
            if len(s_clean) > 25 and ' ' in s_clean:
                return s_clean[:90] + ("..." if len(s_clean) > 90 else "")
    except Exception:
        pass
    return "(Başlangıç mesajı bulunamadı)"

def get_pb_workspace(pb_path):
    try:
        with open(pb_path, 'rb') as f:
            data = f.read()
        matches = re.findall(rb'scratch/([A-Za-z0-9_\-]+)', data)
        if matches:
            names = list(set([m.decode('utf-8', errors='ignore') for m in matches]))
            for n in names:
                clean = clean_workspace_name(n)
                if clean in known_workspaces:
                    return clean
    except Exception:
        pass
    return "Genel / Diğer"

files = os.listdir(conv_dir)
conv_data = []

for f in files:
    if f.endswith('.db') or f.endswith('.pb'):
        path = os.path.join(conv_dir, f)
        mtime = os.path.getmtime(path)
        dt = datetime.datetime.fromtimestamp(mtime)
        conv_id = os.path.splitext(f)[0]
        ext = os.path.splitext(f)[1]
        
        if ext == '.db':
            workspace = get_workspace_from_db(path)
            summary = get_first_user_msg_db(path)
        else:
            workspace = get_pb_workspace(path)
            summary = get_pb_summary(path)
            
        conv_data.append({
            'id': conv_id,
            'time': dt,
            'workspace': workspace,
            'summary': summary
        })

conv_data.sort(key=lambda x: x['time'], reverse=True)

markdown_content = """# Trend Master Akademi Web Sitesi - Geliştirme Sohbet Günlüğü

Bu dosya, Antigravity IDE'nin geçmiş sohbetleri çalışma alanlarına (workspace) göre listeleme özelliğinden dolayı göremediğiniz sohbetleri kolayca bulabilmeniz amacıyla **otomatik olarak oluşturulmuş ve güncellenmiştir**.

Kaldığınız sohbeti bulmak için aşağıdaki tabloda yer alan **Sohbet ID (Conversation ID)** değerini kopyalayıp yeni sohbette `@` işareti yazdıktan sonra yapıştırarak (örneğin `@8ef2c548...`) o sohbetteki tüm bağlama ve kod geçmişine kaldığınız yerden devam edebilirsiniz.

## 📂 Tüm Geçmiş Sohbetlerin Dökümü

| Tarih / Saat | Çalışma Alanı (Workspace) | Sohbet ID (Conversation ID) | Yapılan Çalışmanın Özeti / İlk Mesaj |
| :--- | :--- | :--- | :--- |
"""

for item in conv_data:
    dt_str = item['time'].strftime('%Y-%m-%d %H:%M:%S')
    summary_esc = item['summary'].replace('|', '\\|')
    markdown_content += f"| {dt_str} | **{item['workspace']}** | `{item['id']}` | {summary_esc} |\n"

markdown_content += """
---
*Son Güncelleme Tarihi: """ + datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S') + """*
"""

with open(sohbet_gunlugu_path, 'w', encoding='utf-8') as f:
    f.write(markdown_content)

print("sohbet_gunlugu.md başarıyla güncellendi!")
