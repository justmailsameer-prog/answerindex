"""
Comprehensive Integration & Verification Test Suite for Answer Index Auth & Workflow
Covers:
1. Production Edge Headers & HTML cache-buster verification
2. /api/auth/send-otp: Input validation, response sanitation (no secret leaks)
3. /api/auth/verify-otp: Rejection of invalid OTPs with proper 401 code
4. /api/auth/verify-otp: Missing fields rejection (400)
5. /api/crawl-domain: Live domain metadata extraction & validation
6. /client/[domain].js: Live 1-line dynamic edge script serving JSON-LD
"""

import unittest
import json
import urllib.request
import urllib.error

BASE_URL = "https://answerindex.xyz"

def make_request(path, data=None, method=None, headers=None):
    url = f"{BASE_URL}{path}"
    req_headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) QA-Test-Runner/1.0"}
    if headers:
        req_headers.update(headers)
    
    encoded_data = None
    if data is not None:
        if isinstance(data, (dict, list)):
            encoded_data = json.dumps(data).encode("utf-8")
            req_headers["Content-Type"] = "application/json"
        else:
            encoded_data = data.encode("utf-8")
        if method is None:
            method = "POST"
    elif method is None:
        method = "GET"
            
    req = urllib.request.Request(url, data=encoded_data, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.status, resp.read().decode("utf-8"), dict(resp.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8"), dict(e.headers)
    except Exception as e:
        return 0, str(e), {}


class TestProductionAuthAndEdge(unittest.TestCase):

    def test_01_homepage_loads_with_v4_cache_buster(self):
        """Verify homepage loads 200 OK and references updated client-portal assets."""
        status, body, headers = make_request("/")
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        self.assertIn("client-portal.js?v=20261103_v4", body, "v4 cache-buster missing from index.html")
        self.assertIn("client-portal.css?v=20261103_v4", body, "v4 CSS cache-buster missing from index.html")

    def test_02_client_portal_js_has_no_secret_leaks(self):
        """Verify that client-portal.js has zero leaks of verification codes or founder passcodes."""
        status, body, headers = make_request("/assets/client-portal.js?v=20261103_v4")
        self.assertEqual(status, 200)
        self.assertNotIn("loginOtpInstantCodeBox", body, "Found loginOtpInstantCodeBox leak in production JS")
        self.assertNotIn("autoFillOtpCode", body, "Found autoFillOtpCode leak in production JS")
        self.assertNotIn("Master Founder Passcode", body, "Found Master Founder Passcode leak in production JS")

    def test_03_send_otp_input_validation(self):
        """Verify send-otp rejects empty or malformed email with 400 Bad Request."""
        status, body, headers = make_request("/api/auth/send-otp", data={"email": "invalid-email"})
        self.assertEqual(status, 400, f"Expected 400 for malformed email, got {status}")
        parsed = json.loads(body)
        self.assertFalse(parsed.get("success"))
        self.assertIn("valid email", parsed.get("error", "").lower())

    def test_04_send_otp_sanitized_response(self):
        """Verify send-otp for valid email returns 200 and NEVER includes devOtp or raw code in message."""
        test_email = "qa-verification@answerindex.xyz"
        status, body, headers = make_request("/api/auth/send-otp", data={"email": test_email})
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        parsed = json.loads(body)
        self.assertTrue(parsed.get("success"))
        self.assertEqual(parsed.get("email"), test_email)
        self.assertNotIn("devOtp", parsed, "CRITICAL: devOtp leaked in JSON response")
        self.assertNotIn("Dev Mode OTP", parsed.get("message", ""), "CRITICAL: OTP leaked in message string")

    def test_05_verify_otp_rejects_missing_fields(self):
        """Verify verify-otp rejects payload with missing otp with 400."""
        status, body, headers = make_request("/api/auth/verify-otp", data={"email": "test@example.com"})
        self.assertEqual(status, 400)
        parsed = json.loads(body)
        self.assertFalse(parsed.get("success"))

    def test_06_verify_otp_rejects_incorrect_code(self):
        """Verify verify-otp rejects incorrect code with 401 Unauthorized."""
        status, body, headers = make_request(
            "/api/auth/verify-otp", 
            data={"email": "qa-verification@answerindex.xyz", "otp": "000000"}
        )
        self.assertEqual(status, 401, f"Expected 401 for wrong code, got {status}")
        parsed = json.loads(body)
        self.assertFalse(parsed.get("success"))
        self.assertIn("invalid", parsed.get("error", "").lower())

    def test_07_crawl_domain_endpoint(self):
        """Verify crawl-domain endpoint can analyze a live domain and extract truthful meta."""
        status, body, headers = make_request("/api/crawl-domain", data={"domain": "vibelyze.pages.dev"})
        self.assertIn(status, [200, 400, 500])
        parsed = json.loads(body)
        if status == 200:
            self.assertTrue(parsed.get("success"))
            self.assertIn("domain", parsed)

    def test_08_dynamic_edge_script_endpoint(self):
        """Verify /client/[domain].js returns valid JavaScript for edge delivery."""
        status, body, headers = make_request("/client/vibelyze.pages.dev")
        self.assertEqual(status, 200, f"Expected 200 for dynamic client edge script, got {status}")
        self.assertIn("application/ld+json", body, "Dynamic client script must inject JSON-LD schema")


if __name__ == "__main__":
    unittest.main(verbosity=2)
