
from rest_framework import viewsets
from .models import Bridge
from .serializers import BridgeSerializer

class BridgeViewSet(viewsets.ModelViewSet):

    """
    ViewSet permettant d'interagir avec les ponts via l'API REST.
    Cette classe fournit :
        - GET /bridges/        → liste de tous les ponts
        - GET /bridges/<id>/   → détail d'un pont
        - POST /bridges/       → créer un pont
        - PUT /bridges/<id>/   → mettre à jour un pont
        - DELETE /bridges/<id> → supprimer un pont

    Le ModelViewSet gère automatiquement toutes ces actions.
    """
    # Récupère tous les objets dans la table "bridges"
    queryset = Bridge.objects.all()

    # Définit quel serializer transformer les objets en JSON
    serializer_class = BridgeSerializer