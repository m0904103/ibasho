import os, zipfile, glob, re

term = 'generativity'
out = []
files = glob.glob(r"C:\Users\manpo\OneDrive\桌面\(115暑)人生100幸福處方箋-2H6503班\*.docx")

for f in files:
    try:
        xml = zipfile.ZipFile(f).read('word/document.xml').decode('utf-8')
        text = re.sub('<[^<]+>', '', xml)
        idx = text.lower().find(term)
        if idx != -1:
            snippet = text[max(0, idx - 40) : min(len(text), idx + 40)]
            out.append(f"{os.path.basename(f)}:\n{snippet}\n")
    except Exception as e:
        pass

with open('translation_check.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))
