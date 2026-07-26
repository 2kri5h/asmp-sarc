from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def healthcheck(request):
    return JsonResponse({"status": "ok", "message": "ASMP Django Backend API Server Running"})

urlpatterns = [
    path("", healthcheck),
    path("admin/", admin.site.urls),
    path("api/mentors/", include("Mentors.urls")),
    path("api/authentication/", include("Authentication.urls")),
    path("api/registration/", include("Registrations.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)