from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
class Checker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.rtl = False
    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if tag == "html":
            self.rtl = data.get("lang") == "ar" and data.get("dir") == "rtl"
        for key in ("href", "src"):
            if key in data:
                self.links.append(data[key])

errors = []
for file in ROOT.glob("*.html"):
    checker = Checker()
    checker.feed(file.read_text(encoding="utf-8"))
    if not checker.rtl:
        errors.append(f"{file.name}: missing Arabic RTL document")
    for link in checker.links:
        parts = urlsplit(link)
        if parts.scheme or parts.netloc or link.startswith(("#", "mailto:", "tel:", "data:")):
            continue
        target = unquote(parts.path)
        if not target:
            continue
        resolved = (file.parent / target).resolve()
        if not resolved.is_relative_to(ROOT.resolve()) or not resolved.is_file():
            errors.append(f"{file.name}: missing local asset {link}")
if errors:
    raise SystemExit("\n".join(errors))
print("All local links and RTL document attributes passed.")
