from django.urls import path
from .views import RegistrationAPIView, WishListAPIView, UserPreferencesView

urlpatterns = [
    path('register/', RegistrationAPIView.as_view(), name='registration'),
    path('wishlist/', WishListAPIView.as_view(), name='wishlist'),
    path('my-preferences/', UserPreferencesView.as_view(), name='my-preferences'),
]
