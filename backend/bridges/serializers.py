from rest_framework import serializers
from .models import Bridge

class BridgeSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Bridge.
    
    Le serializer transforme :
      - un objet Bridge en JSON (pour l'API)
      - du JSON en objet Bridge (lors des POST/PUT)

    Il gère automatiquement :
      - la validation des champs
      - la conversion des types (ex : GeometryField)
      - la création et modification des instances
    """
    class Meta:
        model = Bridge
        fields = "__all__"