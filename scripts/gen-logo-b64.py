import base64

with open(r'd:\AI Product\answerindex\assets\AnswerIndex_Logo_v5.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('ascii')

with open(r'd:\AI Product\answerindex\v5\assets\logo-b64.js', 'w', encoding='utf-8') as f:
    f.write('window.ANSWER_INDEX_LOGO_B64 = "data:image/png;base64,' + b64 + '";\n')

print("Wrote logo-b64.js successfully!")

