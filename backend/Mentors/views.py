from django.shortcuts import render
import http.client
from .models import Mentor
import csv
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Mentor
from .serializers import MentorSerializer
from Registrations.models import WishList
from Authentication.models import User

class MentorListAPIView(APIView):
    def post(self, request, format=None, field=None):
        accessToken = request.data.get('accessToken', None)
        user = None
        if accessToken:
            try:
                user = User.objects.get(accessToken=accessToken)
            except Exception as e:
                print("User lookup with token failed:", e)

        if field is None or field == 'all':
            mentors = Mentor.objects.all()
        else:
            try:
                mentors = Mentor.objects.filter(pref=field)
            except Exception as e:
                print("Error while fetching mentors by field", field, e)
                mentors = Mentor.objects.all()
        
        for mentor in mentors:
            mentor.should_show = mentor.popularity <= mentor.preferred_mentees*15
            mentor.save()

        wishlist_mentors = []
        if user:
            wishlist_mentors = WishList.objects.filter(user=user).values_list('mentors', flat=True)
        
        serialized_mentors = []
        for mentor in mentors:
            serialized_mentor = MentorSerializer(mentor).data
            serialized_mentor['wishlisted'] = mentor.pk in wishlist_mentors
            serialized_mentors.append(serialized_mentor)
        
        return Response(serialized_mentors, status=status.HTTP_200_OK)

def add_mentors_from_local_csv():
        try:
            csv_file_path = os.path.join(os.path.dirname(__file__), '../MentorData/data2.csv')
            
            # Read the local CSV file
            with open(csv_file_path, 'r') as file:
                csv_reader = csv.DictReader(file)
                
                # Loop through each row in the CSV file and create Mentor instances
                for row in csv_reader:
                    try:
                        mentor = Mentor(
                            fullname=row['Full Name'],
                            dept=row['Department'],
                            degree=row['Degree'],
                            other_dept=row['Other department'],
                            other_degree=row['Other Degree'],
                            email=row['Email'],
                            year=int(row['Year']),
                            contact=row['Contact'],
                            hostel=row['Hostel'],
                            linkedin=row['Linkedin Profile'],
                            city=row['City'],
                            country=row['Country'],
                            designation=row['Designation'],
                            company_name=row['Company Name'],
                            work_profile=row['Work Profile'],
                            pref=row['Pref'],
                            otherPref=row['Other fieldNo Preference'],
                            preferred_mentees=int(row['Availability'])
                        )
                        mentor.save()
                    except Exception as e:
                        print('Error saving Mentor: ', row['Full Name'], e)
                        pass
                
        except Exception as e:
            print('Failed to add data: ', e)   