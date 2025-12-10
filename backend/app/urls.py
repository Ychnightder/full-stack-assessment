
from django.contrib import admin
from django.urls import include, path
from bridges.urls import router as bridges_router


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(bridges_router.urls)),
]
