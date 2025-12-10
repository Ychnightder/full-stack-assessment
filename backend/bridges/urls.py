from rest_framework.routers import DefaultRouter
from .views import BridgeViewSet

router = DefaultRouter()
router.register(r'bridges', BridgeViewSet)

urlpatterns = router.urls
