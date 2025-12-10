from django.test import TestCase
from bridges.serializers import BridgeSerializer
from bridges.models import Bridge
from django.contrib.gis.geos import Point


class BridgeSerializerTest(TestCase):
    """Tests du serializer BridgeSerializer."""

    def test_serializer_output(self):
        """On vérifie que le serializer génère un JSON correct."""

        bridge = Bridge.objects.create(
            bridge_id="B100",
            name="Pont Serialisé",
            location=Point(7.30, 43.71)
        )

        serializer = BridgeSerializer(bridge)
        data = serializer.data

        self.assertEqual(data["bridge_id"], "B100")
        self.assertEqual(data["name"], "Pont Serialisé")
        self.assertIn("location", data)