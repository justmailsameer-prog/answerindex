import urllib.request
import urllib.error

url = 'https://answerindex.xyz/api/auth/send-otp'
data = b'{"email": "invalid"}'
headers = {'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}

req = urllib.request.Request(url, data=data, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        print('SUCCESS:', resp.status)
        print('HEADERS:', resp.headers)
        print('BODY:', resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('HTTP ERROR:', e.code)
    print('HEADERS:', e.headers)
    print('BODY:', e.read().decode('utf-8'))
except Exception as e:
    print('ERROR:', e)

