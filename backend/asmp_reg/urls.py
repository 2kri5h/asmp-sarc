from django.contrib import admin
from django.urls import path, include
from asmp_reg import views

urlpatterns = [
    path('', views.new_mentor_home, name='index'),
    path('Mentor-<str:id>', views.old_mentor_home, name='index'),
    # path('registration/', views.register),
    # path('registration/regcom/', views.menteereg),
    # path('2023_k_webCTM_achhe_hain', views.export, name="export"),
    # path('upload/', views.simple_upload)
    path('mentorReg/', views.mentorReg, name='mentorReg'),
    path('mentorReg/<str:id>/', views.mentorReg, name='mentorReg'),
    # path('api/thanks', views.testapi, name="testapio"),
    # path('phonehome', views.phonehome, name='phonehome'),
]
