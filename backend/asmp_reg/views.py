# # from django.shortcuts import render, redirect
# # from django.http import HttpResponse, response
# # from .models import Registration
# # from django.core.exceptions import ValidationError
# # import csv
# # from rest_framework.decorators import api_view
# # from . import options
# # from django.views.decorators.csrf import csrf_exempt


# # def export(request):
# # 	response = HttpResponse(content_type='text/csv')
# # 	writer = csv.writer(response)
# # 	writer.writerow([
# #             'First Name',
# #             'Last Name',
# #             'Department',
# #             'Other department',
# #             'degree',
# #             'Other Degree',
# #             'Hostel',
# #             'Year',
# #             'Contact',
# #             'Email',
# #             'Linkedin Profile',
# #             'City',
# #             'Country'
# #             'Designation',
# #             'Company Name',
# #             'Work Profile',
# #             'Preferences',
# #             'Mentees',
# #             'Dept Mentees',
# #             'options',
# #         ])
# # 	for registration in Registration.objects.all().values_list(
# #             'firstname',
# #             'lastname',
# #             'department',
# #             'department_other',
# #             'degree',
# #             'degree_other',
# #             'hostel',
# #             'year',
# #             'other_year',
# #             'contact',
# #             'email',
# #             'linkedin',
# #             'city',
# #             'country',
# #             'designation',
# #             'company_name',
# #             'work_profile',
# #             'Pref',
# #             'mentees',
# #             'dept_mentees',
# #             'suggestions',
# #             'alumni_recommendations'
# #         ):
# # 		writer.writerow(registration)

# # 	response['Content-Disposition'] = 'attachment; filename="mentors_pmp23.csv"'
# # 	return response


# # def index(request):
# #     return render(request, 'AsmpReg/home.html')


# # def phonehome(request):
# #     return render(request, 'AsmpReg/phonehome.html')


# # @csrf_exempt
# # def mentorReg(request):

# #     def __str__(self):
# #         return self.fullname

# #     if request.method == 'POST':

# #         fullname = request.POST.get('fullname')
# #         rollno = request.POST.get('rollno')
# #         department = request.POST.get('department')
# #         department_other = request.POST.get('other_department')
# #         degree = request.POST.get('degree')
# #         degree_other = request.POST.get('degree_other')
# #         graduation_year = request.POST.get('graduation_year')
# #         contact = request.POST.get('contact')
# #         email = request.POST.get('email')

# #         placementOrGrad = request.POST.get('placementOrGrad')

# #         field_pref3 = "NA"

# #         if (placementOrGrad == 'placement'):
# #             experience = request.POST.get('placementExperience')
# #             field_pref1 = request.POST.get('placementPref1')
# #             field_pref2 = request.POST.get('placementPref2')
# #             field_pref3 = request.POST.get('placementPref3')
# #         else:
# #             experience = request.POST.get('gradExperience')
# #             field_pref1 = request.POST.get('gradPref1')
# #             field_pref2 = request.POST.get('gradPref2')

# #         designation = request.POST.get('designation')
# #         company_name = request.POST.get('company_name')

# #         university = request.POST.get('university_name')

# #         suggestions = request.POST.get('suggestion')

# #         recommendations = request.POST.get('referral')

# #         core_branch = request.POST.get('core')
# #         branch_subdivision = request.POST.get('subdivisions')

# #         print(branch_subdivision)

# #         preferred_mentees = request.POST.get('no_of_mentees')

# #         registration = Registration(fullname=fullname or "NA", email=email or "NA", department=department or "NA", rollno=rollno or "NA", department_other=department_other or "NA",
# #                                     degree=degree or "NA", degree_other=degree_other or "NA", graduation_year=graduation_year or "NA", field_pref3=field_pref3 or "NA",
# #                                     contact=contact or "NA", placementOrGrad=placementOrGrad or "NA", designation=designation or "NA", company_name=company_name or "NA", experience=experience or "NA", field_pref1=field_pref1 or "NA", field_pref2=field_pref2 or "NA", branch=(core_branch or "NA"), branch_subdivision=(branch_subdivision or "NA"), preferred_mentees=preferred_mentees or "NA", university_name=(university or "NA"), suggestions=suggestions or "NA", alumni_recommendations=recommendations or "NA")

# #         registration.save()

# #         return render(request, 'AsmpReg/thank.html')


# #     context = {
# #         'options': options.__dict__,
# #     }

# #     return render(request, 'AsmpReg/form.html', context)


# # def thank(request):
# #     return render(request, 'AsmpReg/thank.html')


# # @api_view(['POST'])
# # def testapi(request):
# #     req_data = request.data
# #     alumni_id = req_data['id']
# #     duration = req_data['duration']
# #     context = {'alumni_id': alumni_id, 'duration': duration}
# #     return render(request, 'thank.html', context)

# from django.shortcuts import render, redirect
# from django.http import HttpResponse, response
# from .models import Registration
# from django.core.exceptions import ValidationError
# import csv
# from rest_framework.decorators import api_view
# from . import options
# from django.views.decorators.csrf import csrf_exempt
# from django.conf import settings
# from django.core.mail import send_mail
# from .models import Preference


# def export(request):
#     response = HttpResponse(content_type='text/csv')
#     writer = csv.writer(response)
#     writer.writerow([
#         'Full Name',
#         'Department',
#         'Other department',
#         'degree',
#         'Other Degree',
#         'Hostel',
#         'Year',
#         'Contact',
#         'Email',
#         'Linkedin Profile',
#         'City',
#         'Country',
#         'Designation',
#         'Company Name',
#         'Work Profile',
#         'Preferences',
#         'Mentees',
#         'Dept of Mentees',
#         'Options',
#         'Preferences'
#         'Availability',
#         'Buddy'
#     ])

#     for registration in Registration.objects.all().values_list(
#         'fullname',
#         'department',
#         'department_other',
#         'degree',
#         'degree_other',
#         'hostel',
#         'year',
#         'other_year',
#         'contact',
#         'email',
#         'linkedin',
#         'city',
#         'country',
#         'designation',
#         'company_name',
#         'work_profile',
#         'Pref',
#         'mentees',
#         'dept_mentees',
#         'preferences',
#         'availability',
#         'buddy'
#     ):
#         writer.writerow(registration)

#     response['Content-Disposition'] = 'attachment; filename="mentors_asmp23.csv"'
#     return response


# def index(request):
#     return render(request, 'AsmpReg/home.html')


# def phonehome(request):
#     return render(request, 'AsmpReg/phonehome.html')


# @csrf_exempt
# def mentorReg(request):

#     def __str__(self):
#         return self.fullname

#     options_list = ['python', 'java', 'javascript', 'csharp', 'ruby']

#     if request.method == 'POST':

#         fullname = request.POST.get('fullname')
#         department = request.POST.get('department')
#         department_other = request.POST.get('other_department')
#         degree = request.POST.get('degree')
#         degree_other = request.POST.get('degree_other')
#         hostel = request.POST.get('hostel')
#         year = request.POST.get('year')
#         other_year = request.POST.get('other_year')
#         contact = request.POST.get('contact')
#         email = request.POST.get('email')
#         linkedin = request.POST.get('linkedin')
#         city = request.POST.get('city')
#         country = request.POST.get('country')
#         designation = request.POST.get('designation')
#         company_name = request.POST.get('company_name')
#         work_profile = request.POST.get('work_profile')
#         pref = request.POST.get('pref')
#         mentees = request.POST.get('mentees')
#         dept_mentees = request.POST.get('dept_mentees')
#         preferences = request.POST.getlist('preferences')
#         availability = request.POST.get('availability')
#         buddy = request.POST.get('buddy')
#         selected_options = request.POST.getlist('languages')

#         preferences_str = ", ".join(preferences)

#         registration = Registration(fullname=fullname or "NA", email=email or "NA", department=department or "NA", department_other=department_other or "NA",
#                                     degree=degree or "NA", degree_other=degree_other or "NA", year=year or "NA", hostel=hostel or "NA", other_year=other_year or "NA", linkedin=linkedin or "NA", city=city or "NA", country=country or "NA", pref=pref or "NA", mentees=mentees or "NA",
#                                     contact=contact or "NA", designation=designation or "NA", company_name=company_name or "NA", work_profile=work_profile or "NA", dept_mentees=dept_mentees or "NA", availability=availability or "NA", buddy = buddy or "NA"
#                                     , preferences=preferences_str)

#         registration.save()

#         # Clear the existing preferences
#         registration.preferences.clear()

#         # Assign preferences using the set() method
#         preferences_objs = Preference.objects.filter(name__in=preferences)
#         registration.preferences.set(preferences_objs)


#         context = {
#             'preferences': Preference.objects.all(),
#         }

#         # Send confirmation email
#         # recipient_email = registration.email
#         # subject = 'Confirmation Email'
#         # message = 'Thank you for filling out the form.'
#         # sender_email = settings.DEFAULT_FROM_EMAIL
#         # send_mail(subject, message, sender_email, [recipient_email])

#         return render(request, 'AsmpReg/thank.html')

#     context = {
#         'options': options.__dict__,
#     }

#     return render(request, 'AsmpReg/form.html', context)


# def thank(request):
#     return render(request, 'AsmpReg/thank.html')


# @api_view(['POST'])
# def testapi(request):
#     req_data = request.data
#     alumni_id = req_data['id']
#     duration = req_data['duration']
#     context = {'alumni_id': alumni_id, 'duration': duration}
#     return render(request, 'thank.html', context)


# views.py
import html
import json
import os
from django.core import serializers
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from .models import Registration
from rest_framework.decorators import api_view
from . import options
import csv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import smtplib
from django.core.exceptions import ValidationError

def export(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="ASMP_Mentors_2025.csv"'

    writer = csv.writer(response)
    writer.writerow([
        'Timestamp',
        'Personalized Link', 
        'Full Name',
        'New Mentor?',
        'Department',
        'Other department',
        'Degree',
        'Other Degree',
        'Hostel',
        'Graduating Year',
        'Contact',
        'Email',
        'LinkedIn Profile',
        'City',
        'Country',
        'Designation',
        'Company Name',
        'Work Profile',
        'Preference',
        'Other field',
        'Mentee Preference',
        'No. of Mentees',
        'Dept of Mentees',
        'Buddy'
    ])

    registrations = Registration.objects.all()
    country_dict = dict(options.COUNTRY_CHOICES)
    hostel_dict = dict(options.HOSTEL_CHOICES)
    department_dict = dict(options.BRANCH_CHOICES)

    for registration in registrations:
        
        writer.writerow([
            registration.registration_timestamp,
            "https://asmp.sarc-iitb.org/" + registration.token,
            registration.fullname,
            registration.isNew,
            department_dict.get(registration.department, registration.department),
            registration.department_other,
            registration.degree,
            registration.degree_other,
            hostel_dict.get(registration.hostel, registration.hostel),
            registration.year,
            registration.contact,
            registration.email,
            registration.linkedin,
            registration.city,
            country_dict.get(registration.country, registration.country),
            registration.designation,
            registration.company_name,
            registration.work_profile,
            registration.pref,
            registration.field_other,
            registration.get_mentee_preference_display(),
            registration.mentees,
            registration.dept_mentees,
            registration.buddy
        ])
    return response

def new_mentor_home(request):
    return render(request, 'AsmpReg/home.html')

# Takes an id parameter from the URL
def old_mentor_home(request, id):
    try:
        # Look up the mentor by their token
        registration = Registration.objects.get(token=f'Mentor-{id}')
        
        # Convert the registration object to JSON
        serialized_registration = serializers.serialize('json', [registration])
        json_registration = serialized_registration[1:-1]
        registration_dict = json.loads(json_registration)
        
        # Pass the registration data to the template
        context = {'json_registration': registration_dict}
        return render(request, 'AsmpReg/home.html', context)

    except Registration.DoesNotExist:
        # If mentor not found, render empty page
        return render(request, 'AsmpReg/home.html', {})

    # return render(request, 'AsmpReg/home.html', context)

# def phonehome(request):
#     return render(request, 'AsmpReg/phonehome.html')

def mentorReg(request, id=None):
    if request.method == 'POST':
        # Check if this is a new registration or an update
        if (not Registration.objects.filter(token=id).exists()):
            # NEW REGISTRATION
            fullname = request.POST.get('fullname', 'NA')
            department = request.POST.get('department', 'NA')
            department_other = request.POST.get('other_department', 'NA')
            degree = request.POST.get('degree', 'NA')
            degree_other = request.POST.get('degree_other', 'NA')
            hostel = request.POST.get('hostel', 'NA')
            year = request.POST.get('year', 'NA')
            contact = request.POST.get('contact', 'NA')
            email = request.POST.get('email', 'NA')
            linkedin = request.POST.get('linkedin', 'NA')
            city = request.POST.get('city', 'NA')
            country = request.POST.get('country', 'NA')
            designation = request.POST.get('designation', 'NA')
            company_name = request.POST.get('company_name', 'NA')
            work_profile = request.POST.get('work_profile', 'NA')
            pref = request.POST.get('pref', 'NA')
            field_other = request.POST.get('other_field', 'NA')
            mentee_preference = request.POST.get('mentee_preference', 'no_preference')
            mentees = request.POST.get('mentees', 'NA')
            dept_mentees = request.POST.getlist('dept_mentees', 'NA')
            buddy = request.POST.get('buddy', 'NA')
            
            # Create new registration
            registration = Registration.objects.create(
                fullname=fullname,
                department=department,
                department_other=department_other,
                degree=degree,
                degree_other=degree_other,
                hostel=hostel,
                year=year,
                contact=contact,
                email=email,
                linkedin=linkedin,
                city=city,
                country=country,
                designation=designation,
                company_name=company_name,
                work_profile=work_profile,
                mentee_preference=mentee_preference,
                pref=pref,
                field_other=field_other,
                mentees=mentees,
                dept_mentees=dept_mentees,
                buddy=buddy
            )
        else:
            # UPDATE EXISTING REGISTRATION. First get all information
            fullname = request.POST.get('fullname', 'NA')
            department = request.POST.get('department', 'NA')
            department_other = request.POST.get('other_department', 'NA')
            degree = request.POST.get('degree', 'NA')
            degree_other = request.POST.get('degree_other', 'NA')
            hostel = request.POST.get('hostel', 'NA')
            year = request.POST.get('year', 'NA')
            contact = request.POST.get('contact', 'NA')
            email = request.POST.get('email', 'NA')
            linkedin = request.POST.get('linkedin', 'NA')
            city = request.POST.get('city', 'NA')
            country = request.POST.get('country', 'NA')
            designation = request.POST.get('designation', 'NA')
            company_name = request.POST.get('company_name', 'NA')
            work_profile = request.POST.get('work_profile', 'NA')
            pref = request.POST.get('pref', 'NA')
            field_other = request.POST.get('other_field', 'NA')
            mentee_preference = request.POST.get('mentee_preference', 'no_preference')
            mentees = request.POST.get('mentees', 'NA')
            dept_mentees = request.POST.getlist('dept_mentees', 'NA')
            buddy = request.POST.get('buddy', 'NA')

            registration = Registration.objects.get(token=id)
            registration.fullname = fullname
            registration.department = department
            # registration.department_other=department_other,
            registration.degree = degree
            # registration.degree_other=degree_other,
            registration.hostel = hostel
            registration.year = year
            registration.contact = contact
            registration.email = email
            registration.linkedin = linkedin
            registration.city = city
            registration.country = country
            registration.designation = designation
            registration.company_name = company_name
            registration.work_profile = work_profile
            registration.mentee_preference = mentee_preference
            registration.pref = pref
            registration.field_other = field_other
            registration.mentees = mentees
            registration.dept_mentees = dept_mentees
            registration.buddy = buddy

        registration.isNew = True # Mark as new/update
        registration.save()
        send_confirmation_mail(registration.email, registration.fullname)
        
        serialized_registration = serializers.serialize('json', [registration])
        json_registration = serialized_registration[1:-1]
        registration_dict = json.loads(json_registration)
        
        context = {
            'json_registration': registration_dict if id is not None else {},
        }

        return render(request, 'AsmpReg/thank.html', context)

    if (id is not None):
        registration = Registration.objects.get(token=id)
        serialized_registration = serializers.serialize('json', [registration])
        json_registration = serialized_registration[1:-1]
        registration_dict = json.loads(json_registration)

    context = {
        'options': options.__dict__,
        'json_registration': registration_dict if id is not None else {},
    }

    return render(request, 'AsmpReg/form.html', context)

def thank(request):
    return render(request, 'AsmpReg/thank.html')

@api_view(['POST'])
def testapi(request):
    req_data = request.data
    alumni_id = req_data['id']
    duration = req_data['duration']
    context = {'alumni_id': alumni_id, 'duration': duration}
    return render(request, 'thank.html', context)

leftUsers = []

def send_confirmation_mail(
    emailid="arush.sarc@gmail.com",    # Default email if none provided
    to_person_name="User",             # Default name if none provided
):
    strFrom = "sarc@iitb.ac.in"        # Sender email
    strTo = emailid                    # Recipient email
    userName = to_person_name          # Recipient name
    # subject = mail_subject
    # text_content = text_content
    msgRoot = MIMEMultipart("related")
    msgRoot["Subject"] = "Alumni Student Mentorship Program | Registration Successful"
    msgRoot["From"] = strFrom
    msgRoot["To"] = strTo
    msgRoot.preamble = "This is a multi-part message in MIME format."
    msgAlternative = MIMEMultipart("alternative")
    msgRoot.attach(msgAlternative)

    msghtml = f'''
<!DOCTYPE html>
<html>
  <head>
    <title> Alumni Student Mentorship Program | Registration Confirmed </title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.5; background-color: rgba(168, 216, 240, 0.2); margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: rgba(168, 216, 240, 0.2); border-radius: 10px;">
      <h1 style="font-size: 28px; color: #0A1172; text-align: center; margin-top: 0; margin-bottom: 20px;">Alumni Student Mentorship Program | Registration Confirmed</h1>
      <p style="color: #000000;">Dear {userName},</p>
      <p style="color: #000000;">
        Thank you for successfully registering for the Alumni Student Mentorship Program (ASMP). We are thrilled to have you as a part of our mentoring community!
      </p>
      <p style="color: #000000;">
        Stay tuned for updates on upcoming mentoring sessions and events. We believe this program will create meaningful connections and contribute to the development of the next generation of leaders.
      </p>
      <p style="color: #000000;">
        If you have any questions, You can contact:
      </p>
      <p style="color: #0A1172;">
       Aadit Sule: +91 8459539918 <br/> Aastha Maliwal: +91 9403521022
      </p>
      <p style="color: #000000;">We look forward to a successful mentorship journey with you!</p>
    </div>
  </body>
</html>
'''
    # Attach HTML Content
    msgText = MIMEText(msghtml, "html")
    msgAlternative.attach(msgText)

    smtp = smtplib.SMTP("smtp-auth.iitb.ac.in", 587)
    smtp.starttls()

    try:
        smtp.login("sarc@iitb.ac.in", "87638c40a92a794bc81b6de03e5ae86c")
        response = smtp.sendmail(strFrom, strTo, msgRoot.as_string())
        smtp.quit()
        return response
    except Exception as e:
        print(e, "This is error while login smtp or sending")
        leftUsers.append(emailid)
        pass

leftUsers= []

def add_mentor_data():
    file_path = os.path.join(os.getcwd(), 'LastYearData', 'mentorData.csv')
    with open(file_path, 'r', encoding='utf-8-sig') as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            try:
                registration = Registration.objects.create(
                fullname=row['fullname'] or "NA",
                department=row['department'] or "NA",
                degree=row['degree'] or "NA",
                hostel=row['hostel'] or "NA",
                year=row['graduation_year'] or "NA",
                contact=row['contact'] or "NA",
                email=row['email'] or "NA",
                linkedin=row['linkedin'] or "NA",
                city=row['city'] or "NA",
                country=row['country'] or "NA",
                designation=row['designation'] or "NA",
                company_name=row['company_name'] or "NA",
                work_profile=row['work_profile'] or "NA",
                mentee_preference=row.get('mentee_preference', 'no_preference'),
                pref=row['pref'] or "NA",
                field_other="NA",
                mentees=row['mentees'] or "NA",
                buddy="no"
            )
                registration.save()
              
            except ValidationError as e:
                leftUsers.append(row['fullname'])
                print(e)
                pass

# function to check if the SARC smtp login credentials are still working
def test_email_connection():
    try:
        # Test SMTP connection
        smtp = smtplib.SMTP("smtp-auth.iitb.ac.in", 587)
        smtp.starttls()
        
        # Test login
        smtp.login("sarc@iitb.ac.in", "87638c40a92a794bc81b6de03e5ae86c")
        print("SMTP Connection and Login Successful!")
        
        # Test email sending
        test_email = "arush.sarc@gmail.com"
        test_msg = MIMEMultipart()
        test_msg["Subject"] = "Test Email - ASMP"
        test_msg["From"] = "sarc@iitb.ac.in"
        test_msg["To"] = test_email
        test_msg.attach(MIMEText("This is a test email from ASMP.", "plain"))
        
        smtp.sendmail("sarc@iitb.ac.in", test_email, test_msg.as_string())
        print(f"Test email sent successfully to {test_email}")
        
        smtp.quit()
        return True
        
    except Exception as e:
        print(f"Test failed: {str(e)}")
        return False

# You can call this function to test the email system.
# test_email_connection()
# To run the test, run python manage.py shell in ASMP23 folder. You should see a success message