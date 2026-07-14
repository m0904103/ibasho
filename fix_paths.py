with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('data-bg="/images/', 'data-bg="./images/')
content = content.replace("url('/images/", "url('./images/")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
