import unittest

from app import app


class AppTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_index(self):
        rv = self.client.get("/")
        self.assertEqual(rv.status_code, 200)
        data = rv.get_json()
        self.assertIsInstance(data, dict)
        self.assertIn("message", data)

    def test_health(self):
        rv = self.client.get("/health")
        self.assertEqual(rv.status_code, 200)
        data = rv.get_json()
        self.assertEqual(data.get("status"), "ok")


if __name__ == "__main__":
    unittest.main()
