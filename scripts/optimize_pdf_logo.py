import os
import base64
from PIL import Image

src_path = 'v5/assets/AnswerIndex_Logo_v5.png'
out_png = 'v5/assets/AnswerIndex_Logo_pdf.png'
out_js = 'v5/assets/logo-b64.js'

img = Image.open(src_path)
# 120x120 is 200+ DPI when rendered at 15mm in PDF, extremely sharp
thumb = img.resize((120, 120), Image.Resampling.LANCZOS)
thumb.save(out_png, format='PNG', optimize=True, compress_level=9)

with open(out_png, 'rb') as f:
    b64_str = base64.b64encode(f.read()).decode('utf-8')

js_content = f'window.ANSWER_INDEX_LOGO_B64 = "data:image/png;base64,{b64_str}";\n'
with open(out_js, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Optimized PNG: {os.path.getsize(out_png)} bytes")
print(f"Optimized JS: {os.path.getsize(out_js)} bytes")

