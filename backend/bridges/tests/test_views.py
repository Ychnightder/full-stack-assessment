from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.gis.geos import Point
from bridges.models import Bridge


class BridgeAPITest(TestCase):
    """Tests de l'API REST pour Bridge."""

    def setUp(self):
        """Configuration initiale pour les tests API."""
        self.client = APIClient()
        self.bridge = Bridge.objects.create(
            bridge_id="B200",
            name="Pont API",
            location=Point(7.35, 43.72)
        )

    def test_get_bridge(self):
        """On vérifie qu'on peut récupérer un pont via l'API."""

        response = self.client.get(f'/api/bridges/{self.bridge.bridge_id}/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["bridge_id"], "B200")
        self.assertEqual(response.data["name"], "Pont API")
        self.assertIn("location", response.data)

    def test_list_bridges(self):
        """GET /api/bridges/ retourne la liste des ponts."""
        response = self.client.get("/api/bridges/")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)


    def test_get_bridge(self):
        """GET /api/bridges/<id>/ retourne le bon pont."""
        response = self.client.get("/api/bridges/B200/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "Pont API")


    def test_create_bridge(self):
        """POST /api/bridges/ crée un nouveau pont."""

        data = {
            "bridge_id": "B201",
            "name": "Pont Nouveau",
            "location": "POINT(7.50 43.70)"
        }

        response = self.client.post(
            "/api/bridges/",
            data,
            format="json"
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(Bridge.objects.filter(bridge_id="B201").exists())