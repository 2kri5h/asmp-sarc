from rest_framework import serializers
from .models import Registration, WishList
from Mentors.models import Mentor


# Minimal Mentor serializer for concise card data (for preferences)
class MentorMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mentor
        fields = ['id', 'fullname', 'designation']


class RegistrationSerializer(serializers.ModelSerializer):
    # These fields are used for displaying mentor details (for GET)
    pref1 = MentorMiniSerializer(read_only=True)
    pref2 = MentorMiniSerializer(read_only=True)
    pref3 = MentorMiniSerializer(read_only=True)
    pref4 = MentorMiniSerializer(read_only=True)
    pref5 = MentorMiniSerializer(read_only=True)

    # These fields are used for setting mentor by ID (for POST/PATCH)
    pref1_id = serializers.PrimaryKeyRelatedField(
        queryset=Mentor.objects.all(), source='pref1', write_only=True, required=False)
    pref2_id = serializers.PrimaryKeyRelatedField(
        queryset=Mentor.objects.all(), source='pref2', write_only=True, required=False)
    pref3_id = serializers.PrimaryKeyRelatedField(
        queryset=Mentor.objects.all(), source='pref3', write_only=True, required=False)
    pref4_id = serializers.PrimaryKeyRelatedField(
        queryset=Mentor.objects.all(), source='pref4', write_only=True, required=False)
    pref5_id = serializers.PrimaryKeyRelatedField(
        queryset=Mentor.objects.all(), source='pref5', write_only=True, required=False)

    class Meta:
        model = Registration
        fields = [
            'id', 'user',
            'pref1', 'pref2', 'pref3', 'pref4', 'pref5',
            'pref1_id', 'pref2_id', 'pref3_id', 'pref4_id', 'pref5_id'
        ]


class WishListSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishList
        fields = '__all__'
