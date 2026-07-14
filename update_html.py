import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update audio tag
content = content.replace('<audio id="audio" src="/居場所.mp3"></audio>', '<audio id="audio" src="/居場所.mp3" preload="metadata"></audio>')

# 2. Update bg-image divs to use data-bg, EXCEPT the very first one
bg_pattern = r'<div class="bg-image" style="background-image: url\(\'(/images/\d+\.png)\'\)"></div>'

matches = list(re.finditer(bg_pattern, content))
if matches:
    # Replace from the second match onwards
    for match in reversed(matches[1:]):
        start, end = match.span()
        img_url = match.group(1)
        new_tag = f'<div class="bg-image" data-bg="{img_url}"></div>'
        content = content[:start] + new_tag + content[end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
