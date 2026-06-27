import json
import os
import sys

def extract_transcript(conv_id, output_path):
    path_full = f"C:\\Users\\mehme\\.gemini\\antigravity-ide\\brain\\{conv_id}\\.system_generated\\logs\\transcript_full.jsonl"
    path_normal = f"C:\\Users\\mehme\\.gemini\\antigravity-ide\\brain\\{conv_id}\\.system_generated\\logs\\transcript.jsonl"
    
    path = path_full if os.path.exists(path_full) else path_normal
    if not os.path.exists(path):
        print(f"Error: Transcript files do not exist for conversation {conv_id}")
        return
        
    with open(path, 'r', encoding='utf-8') as f, open(output_path, 'w', encoding='utf-8') as out:
        out.write(f"# Dünkü Sohbet Geçmişi (ID: {conv_id})\n\n")
        out.write("Bu dosya, dünkü çalışmanızda ne konuştuğunuzu kelimesi kelimesine hatırlayabilmeniz için otomatik olarak oluşturulmuştur.\n\n")
        
        for line in f:
            try:
                data = json.loads(line)
                step_type = data.get('type')
                content = data.get('content', '')
                
                if step_type == 'USER_INPUT':
                    out.write("\n---\n### 👤 KULLANICI:\n")
                    out.write(content.strip() + "\n")
                elif step_type == 'PLANNER_RESPONSE':
                    # Clean up some markdown artifacts
                    out.write("\n---\n### 🤖 YAPAY ZEKA:\n")
                    out.write(content.strip() + "\n")
            except Exception as e:
                continue

if __name__ == "__main__":
    if len(sys.argv) > 2:
        extract_transcript(sys.argv[1], sys.argv[2])
