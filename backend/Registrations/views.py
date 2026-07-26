from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
import csv

from .serializers import RegistrationSerializer, WishListSerializer
from Authentication.models import User, Profile
from .models import Registration, WishList
from Mentors.models import Mentor
from Mentors.serializers import MentorSerializer


class UserPreferencesView(APIView):
    def get_user_from_request(self, request):
        """
        Helper to acquire authenticated user. Tries request.user, then fallback on accessToken param.
        """
        user = None
        # Check if accessToken in query params
        access_token = request.query_params.get('accessToken') or request.data.get('accessToken')
        if access_token:
            try:
                user = User.objects.get(accessToken=access_token)
            except User.DoesNotExist:
                user = None
        else:
            # Use authenticated user if available
            user = request.user if request.user.is_authenticated else None
        return user

    def get(self, request):
        user = self.get_user_from_request(request)
        if not user:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_403_FORBIDDEN)
        try:
            reg = Registration.objects.get(user=user)
        except Registration.DoesNotExist:
            return Response({"error": "Registration not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = RegistrationSerializer(reg)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = self.get_user_from_request(request)
        if not user:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_403_FORBIDDEN)
        try:
            reg = Registration.objects.get(user=user)
        except Registration.DoesNotExist:
            return Response({"error": "Registration not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RegistrationSerializer(reg, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegistrationAPIView(APIView):
    def post(self, request):
        accessToken = request.data.get('accessToken')
        if not accessToken:
            return Response("accessToken is required", status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(accessToken=accessToken)
            if not user.is_active:
                return Response("User not verified", status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response("Error while fetching user", status=status.HTTP_404_NOT_FOUND)

        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            return Response("Profile Not Found", status=status.HTTP_404_NOT_FOUND)

        if not profile.sop or not profile.linkedin:
            return Response("SOP and LinkedIn must not be blank", status=status.HTTP_402_PAYMENT_REQUIRED)

        # Merge user id into data for serializer
        data = request.data.copy()
        data['user'] = user.id

        serializer = RegistrationSerializer(data=data)
        if serializer.is_valid():
            try:
                # Validate mentors availability
                for idx in range(1,6):
                    field = f'pref{idx}'
                    mentor = serializer.validated_data.get(field)
                    if mentor is None:
                        return Response(f"Preference {idx} is required", status=status.HTTP_400_BAD_REQUEST)
                    if not mentor.should_show:
                        return Response(f'Mentor with ID: {mentor.id} is not available', status=status.HTTP_406_NOT_ACCEPTABLE)

                # Update popularity and availability
                popularity_increments = [5,4,3,2,1]
                for idx, inc in zip(range(1,6), popularity_increments):
                    mentor = serializer.validated_data.get(f'pref{idx}')
                    mentor.popularity += inc
                    if mentor.popularity > mentor.preferred_mentees * 15:
                        mentor.should_show = False
                    mentor.save()
                
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            except Exception as e:
                print("Error updating mentor popularity:", e)
                return Response("Something went wrong", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WishListAPIView(APIView):

    # Add a mentor to wishlist
    def put(self, request):
        accessToken = request.data.get('accessToken')
        if not accessToken:
            return Response("accessToken is required", status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(accessToken=accessToken)
            if not user.is_active:
                return Response("User not verified", status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response("Error while verifying user", status=status.HTTP_404_NOT_FOUND)

        try:
            wishlist, created = WishList.objects.get_or_create(user=user)
            mentor_id = request.data.get('mentor')
            if not mentor_id:
                return Response("mentor id is required", status=status.HTTP_400_BAD_REQUEST)
            if wishlist.mentors.filter(id=mentor_id).exists():
                return Response("Mentor already in wishlist", status=status.HTTP_400_BAD_REQUEST)
            mentor_obj = Mentor.objects.get(id=mentor_id)
            wishlist.mentors.add(mentor_obj)
            wishlist.save()
            return Response("Mentor added to wishlist", status=status.HTTP_201_CREATED)
        except Mentor.DoesNotExist:
            return Response("Mentor not found", status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("Error updating wishlist:", e)
            return Response("Internal Server Error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Remove mentor from wishlist
    def post(self, request):
        accessToken = request.data.get('accessToken')
        if not accessToken:
            return Response("accessToken is required", status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(accessToken=accessToken)
            if not user.is_active:
                return Response("User not verified", status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response("Error while verifying user", status=status.HTTP_404_NOT_FOUND)
        try:
            wishlist = WishList.objects.get(user=user)
            mentor_id = request.data.get('mentor')
            if not mentor_id:
                return Response("mentor id is required", status=status.HTTP_400_BAD_REQUEST)
            if not wishlist.mentors.filter(id=mentor_id).exists():
                return Response("Mentor not in wishlist", status=status.HTTP_404_NOT_FOUND)
            wishlist.mentors.remove(mentor_id)
            wishlist.save()
            return Response("Mentor removed from wishlist", status=status.HTTP_200_OK)
        except WishList.DoesNotExist:
            # If no wishlist exists, the mentor is not in it, so removal is successful
            return Response("Mentor removed from wishlist", status=status.HTTP_200_OK)
        except Exception as e:
            print("Error updating wishlist:", e)
            return Response("Internal Server Error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Get wishlist mentors
    def get(self, request):
        accessToken = request.query_params.get('accessToken')
        if not accessToken:
            return Response("accessToken is required", status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(accessToken=accessToken)
            if not user.is_active:
                return Response("User not verified", status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)
        try:
            wishlist = WishList.objects.get(user=user)
            mentors_qs = wishlist.mentors.filter(should_show=True)
            serializer = MentorSerializer(mentors_qs, many=True)
            # Adding 'wishlisted' flag
            mentors_data = serializer.data
            for mentor in mentors_data:
                mentor['wishlisted'] = True
            return Response(mentors_data, status=status.HTTP_200_OK)
        except WishList.DoesNotExist:
            # Return empty array instead of 404 when no wishlist exists
            return Response([], status=status.HTTP_200_OK)
        except Exception as e:
            print("Error fetching wishlist:", e)
            return Response("Internal Server Error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Export CSV of Registrations with mentor preferences and profile info
def export_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="registration_data.csv"'
    writer = csv.writer(response)

    writer.writerow([
        'full name', 'contact', 'Email', 'sop', 'Personal email', 'linkedin',
        'Pref1 ID', 'Pref1 Name', 'Pref2 ID', 'Pref2 Name', 'Pref3 ID', 'Pref3 Name',
        'Pref4 ID', 'Pref4 Name', 'Pref5 ID', 'Pref5 Name'])

    registrations = Registration.objects.select_related('user', 'pref1', 'pref2', 'pref3', 'pref4', 'pref5').all()

    for reg in registrations:
        profile = Profile.objects.filter(user=reg.user).first()
        writer.writerow([
            reg.user.fullname,
            reg.user.contact,
            reg.user.ldap,
            profile.sop if profile else '',
            profile.personal_email if profile else '',
            profile.linkedin if profile else '',
            reg.pref1.id if reg.pref1 else '',
            reg.pref1.fullname if reg.pref1 else '',
            reg.pref2.id if reg.pref2 else '',
            reg.pref2.fullname if reg.pref2 else '',
            reg.pref3.id if reg.pref3 else '',
            reg.pref3.fullname if reg.pref3 else '',
            reg.pref4.id if reg.pref4 else '',
            reg.pref4.fullname if reg.pref4 else '',
            reg.pref5.id if reg.pref5 else '',
            reg.pref5.fullname if reg.pref5 else '',
        ])

    return response


def export_csv_wishlist(request, queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="wishlist_data.csv"'
    writer = csv.writer(response)

    writer.writerow(['fullname', 'context', 'email', 'Mentor IDs', 'Mentor Names'])

    for wishlist in WishList.objects.all():
        mentors_ids = [str(m.id) for m in wishlist.mentors.all()]
        mentors_names = [m.fullname for m in wishlist.mentors.all()]

        writer.writerow([
            wishlist.user.fullname if wishlist.user else '',
            wishlist.user.contact if wishlist.user else '',
            wishlist.user.ldap if wishlist.user else '',
            ', '.join(mentors_ids),
            ', '.join(mentors_names)
        ])

    return response
