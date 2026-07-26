from django.urls import path
from .views import CreateUserAPIView, TokenVerification, Login, ProfileView, ForgotPasswordAPIView, ResetPasswordAPIView

urlpatterns = [
    path("create-user/", CreateUserAPIView.as_view(), name="create-user"),
    path('verify-user/<str:token>/', TokenVerification.as_view(), name='verify_user'),
    path('login/', Login.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('forgot-password/', ForgotPasswordAPIView.as_view(), name='forgot_password'),
    path('reset-password/<str:token>/', ResetPasswordAPIView.as_view(), name='reset_password'),
]