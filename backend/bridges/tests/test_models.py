from django.test import TestCase
from bridges.models import Bridge
from django.contrib.gis.geos import Point


class BridgeModelTest(TestCase):
    """Tests unitaires du modèle Bridge."""

    def test_create_bridge(self):
        """On vérifie qu'on peut créer un pont correctement."""

        bridge = Bridge.objects.create(
            bridge_id="B999",
            name="Pont Test",
            location=Point(7.25, 43.70)
        )

        # Vérification des champs
        self.assertEqual(bridge.bridge_id, "B999")
        self.assertEqual(bridge.name, "Pont Test")
        self.assertIsInstance(bridge.location, Point)