from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, ProfileSerializer
from .models import User, Profile, Token
from django.shortcuts import render, redirect
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import smtplib
import os

class CreateUserAPIView(APIView):
    def post(self, request, format=None):
        data = request.data.copy()
        if 'ldap' in data and data['ldap']:
            ldap_input = str(data['ldap']).strip().lower()
            if not ldap_input.endswith('@iitb.ac.in'):
                ldap_input += '@iitb.ac.in'
            data['ldap'] = ldap_input

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = True
            user.save()

            Profile.objects.create(user=user)
            
            token, created = Token.objects.get_or_create(user=user)
            
            print("User created successfully")
            print("Token: ", token)
            
            try:
                send_sso_mail(name=user.fullname, emailid=user.ldap, token=token.token)
            except Exception as e:
                print(f"Error calling send_sso_mail: {e}")
            
            response_data = serializer.data.copy()
            response_data.pop('password', None)
            response_data.pop('accessToken', None)
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TokenVerification(APIView):
    def get(self, request, token, format=None):
        try:
            token_object = Token.objects.get(token=token)
            user = token_object.user
            if user.is_active:
                return redirect('https://asmp.sarc-iitb.org/login')  # Redirect to login page if already verified
            user.is_active = True
            user.save()
            return redirect('https://asmp.sarc-iitb.org/login')  # Redirect to login page after successful verification
        except Token.DoesNotExist:
            print("Error while verifying token: Token does not exist")
            return Response("No user found, please signup", status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Error while verifying token", e)
            return Response("An error occurred", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Login(APIView):
    def post(self, request, format=None):
        try:
            ldap_input = str(request.data.get('ldap', '')).strip().lower()
            if ldap_input and not ldap_input.endswith('@iitb.ac.in'):
                ldap_input += '@iitb.ac.in'
            user = User.objects.get(ldap=ldap_input)
            if user.is_active == False:
                return Response({"error": "User not verified, please verify your account from your email"}, status=status.HTTP_401_UNAUTHORIZED)
            if user.password == request.data['password']:
                serializer = UserSerializer(user)
                return Response({"accessToken": serializer.data['accessToken']}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Error while logging in", e)
            return Response({"error": "Invalid Credentials. Did you signup?"}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    def get(self, request, format=None):
        accessToken = request.query_params.get('accessToken')
        try:
            user = User.objects.get(accessToken=accessToken)
            if user.is_active == False:
                return Response({"error": "User not verified"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Error while fetching user", e)
            return Response(status=status.HTTP_404_NOT_FOUND)
        print(user)
        try:
            profile, created = Profile.objects.get_or_create(user=user)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        except Exception as e:
            print("Error while fetching profile", e)
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):
        accessToken = request.data['accessToken']
        try:
            user = User.objects.get(accessToken=accessToken)
            if user.is_active == False:
                return Response({"error": "User not verified"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Error while fetching user", e)
            return Response(status=status.HTTP_404_NOT_FOUND)
        print(user)
        try:
            request.data['user'] = user.id
            if not Profile.objects.filter(user=user):
                serializer = ProfileSerializer(data=request.data)
            else:
                profile = Profile.objects.get(user=user)
                serializer = ProfileSerializer(profile, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                print("Error while updating profile", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)
        except Exception as e:
            print("Error while updating profile", e)
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, format=None):
        accessToken = request.data['accessToken']
        try:
            user = User.objects.get(accessToken=accessToken)
            if user.is_active == False:
                return Response({"error": "User not verified"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Error while fetching user", e)
            return Response(status=status.HTTP_404_NOT_FOUND)
        print(user)
        try:
            profile = Profile.objects.get(user=user)
            request.data['user'] = user.id
            serializer = ProfileSerializer(profile, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                print("Error while updating profile", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Error while updating profile", e)
            return Response(status=status.HTTP_404_NOT_FOUND)

class ForgotPasswordAPIView(APIView):
    def post(self, request, format=None):
        try:
            ldap = request.data.get('email')
            user = User.objects.get(ldap=ldap)
            
            if user.is_active:
                # Send password reset email with roll number and password
                send_forgot_password_email(
                    emailid=user.ldap,
                    roll=user.roll,
                    password=user.password,
                    name=user.fullname  # Send the password in the email
                )
                
                return Response({"message": "Password reset email has been sent."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "User is not active. Please verify your account."}, status=status.HTTP_400_BAD_REQUEST)
        
        except User.DoesNotExist:
            return Response({"error": "No user found with this email."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("Error while processing forgot password request", e)
            return Response({"error": "An error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordAPIView(APIView):
    def post(self, request, token, format=None):
        try:
            token_object = Token.objects.get(token=token)
            user = token_object.user

            if not user.is_active:
                return Response({"error": "User account is not active."}, status=status.HTTP_400_BAD_REQUEST)

            new_password = request.data.get('new_password')
            if not new_password:
                return Response({"error": "New password is required."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            # Optionally delete the token after successful reset
            token_object.delete()

            return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Error while resetting password", e)
            return Response({"error": "An error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def send_sso_mail(
    mail_subject="User Verification of ASMP 2025 | SARC IIT Bombay",
    text_content="Yo man!",
    emailid="arush.sarc@gmail.com",
    token="",
    name="Web CTM SARC",
    sender_email="sarc@iitb.ac.in",
    sender_name="SARC IIT Bombay",
    reply_name="SARC IIT Bombay",
    reply_to="23b2704@iitb.ac.in",
):
    strFrom = "sarc@iitb.ac.in"
    strTo = emailid
    subject = mail_subject
    text_content = text_content
    token = token
    msgRoot = MIMEMultipart("related")
    msgRoot["Subject"] = mail_subject
    msgRoot["From"] = f"{sender_name} <{strFrom}>"
    msgRoot["To"] = strTo
    msgRoot.preamble = "This is a multi-part message in MIME format."
    msgAlternative = MIMEMultipart("alternative")
    msgRoot.attach(msgAlternative)
    msghtml = f'''
<!DOCTYPE html>
<html>
    <head>
    <title>{subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.5; background-color: #f8f8f8; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h1 style="font-size: 24px; color: #333333; margin-top: 0; margin-bottom: 20px;">User Verification of ASMP 2025 | SARC IIT Bombay</h1>
            <p style="color: #555555; margin-bottom: 10px;">Dear {name},</p>
            <p style="color: #555555; margin-bottom: 10px;">
            Thank you for signing up for the ASMP. To complete your registration, please click the button below to verify your email address:
            </p>
            <p style="text-align: center; margin: 30px 0;">
            <a href="https://asmp.sarc-iitb.org/api/authentication/verify-user/{token}" 
                style="text-decoration: none; background-color: #007bff; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
                Verify Email
            </a>
            </p>
            <p style="color: #777777; font-size: 14px;">
            If you did not sign up for ASMP, please ignore this email.
            </p>
            <p style="color: #555555; margin-top: 30px; margin-bottom: 10px;">
              Regards,<br>
              Aadit Sule - +91 8459539918<br>
              Aastha Mailwal - +91 9403521022<br>
              <strong>Core Team Members, ASMP Program</strong>
              <br><br>
              Kartik Vaishnav - +91 8815726072<br>
              <strong>Overall Coordinator, SARC</strong>
            </p>
            <hr style="border:none; border-top:1px solid #eee; margin: 20px 0;" />
            <p style="color: #999999; font-size: 12px;">
            © 2025 | SARC IIT Bombay<br/>
            Indian Institute of Technology Bombay<br/>
        </div>
    </body>
</html>
'''
    msgText = MIMEText(
        msghtml,
        "html",
    )

    msgAlternative.attach(msgText)
    try:
        smtp = smtplib.SMTP("smtp-auth.iitb.ac.in", 587, timeout=5)
        smtp.starttls()
        print(
            "everything is fine till now--------------------------------------------------"
        )
        smtp.login("sarc@iitb.ac.in", "c1a90a1351390958f742b8097d9feaab")
        response = smtp.sendmail(strFrom, strTo, msgRoot.as_string())
        print("Response is ", response)
        smtp.quit()
        return response
    except Exception as e:
        print(f"SMTP Error during local testing: {e}")
        return None

def send_forgot_password_email(
    mail_subject="Credentials | ASMP | SARC IIT Bombay",
    text_content="Please reset your password.",
    emailid="",
    roll="",  # Ensure 'roll' is included here
    password="",
    token="",
    name="SARC Team",
    sender_email="sarc@iitb.ac.in",
    sender_name="SARC",
    reply_name="SARC",
    reply_to="support@iitb.ac.in",
):
    strFrom = "sarc@iitb.ac.in"
    strTo = emailid
    subject = mail_subject
    text_content = text_content
    token = token
    msgRoot = MIMEMultipart("related")
    msgRoot["Subject"] = mail_subject
    msgRoot["From"] = strFrom
    msgRoot["To"] = strTo
    msgRoot.preamble = "This is a multi-part message in MIME format."
    msgAlternative = MIMEMultipart("alternative")
    msgRoot.attach(msgAlternative)
    msghtml = f'''
        <html>
      <body>
        <p>Hi {name},</p>
        <p>Here are your credentials:</p>
        <p><strong>Email ID:</strong> {emailid}</p>
        <p><strong>Password:</strong> {password}</p>
        <p>If you didn’t request this, please ignore this email.</p>
        <p>Thanks,</p>
        <p>SARC Team</p>
        <p>2024-25</p>
      </body>
    </html>
    '''
    
    msgText = MIMEText(
        msghtml,
        "html",
    try:
        smtp = smtplib.SMTP("smtp-auth.iitb.ac.in", 587, timeout=5)
        smtp.starttls()
        smtp.login("sarc@iitb.ac.in", "c1a90a1351390958f742b8097d9feaab")
        response = smtp.sendmail(strFrom, strTo, msgRoot.as_string())
        print("Response is ", response)
        smtp.quit()
        return response
    except Exception as e:
        print(f"SMTP Error during password reset email: {e}")
        return None