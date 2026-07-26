from rest_framework import serializers
from .models import Mentor

class MentorSerializer(serializers.ModelSerializer):
    dept = serializers.CharField(source='get_dept_display')
    class Meta:
        model = Mentor
        exclude = ['email', 'contact', 'linkedin', 'country']
