from django.urls import path
from .views import *

urlpatterns = [
    path('', MentorListAPIView.as_view(), name='mentor-list'),
    path('<field>/', MentorListAPIView.as_view(), name='mentor-list-field'),
]