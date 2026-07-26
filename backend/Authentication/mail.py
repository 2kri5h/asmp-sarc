import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_reminder_mail(
    mail_subject="Reminder to complete your ASMP application",
    emailid="",
    name="User",
    sender_email="sarc@iitb.ac.in",
    sender_name="SARC",
    reply_name="SARC",
    reply_to="support@iitb.ac.in",
):
    strFrom = sender_email
    strTo = emailid

    msgRoot = MIMEMultipart("related")
    msgRoot["Subject"] = mail_subject
    msgRoot["From"] = f"{sender_name} <{sender_email}>"
    msgRoot["To"] = strTo
    msgRoot["Reply-To"] = f"{reply_name} <{reply_to}>"

    msgAlternative = MIMEMultipart("alternative")
    msgRoot.attach(msgAlternative)
    msghtml = f'''
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6; max-width: 650px; margin: auto; background-color: #f7f7f7; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <tr>
        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">
            ASMP IIT Bombay
          </h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">
            Alumni Student Mentorship Program
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 30px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear <strong>{name}</strong>,</p>

          <p style="font-size: 15px; margin-bottom: 15px; color: #555;">
            This is regarding your <strong>Alumni Student Mentorship Program (ASMP)</strong> application.
          </p>

          <p style="font-size: 15px; margin-bottom: 15px; color: #555;">
            You've already taken the first big step: logging in to the ASMP portal and exploring our incredible list of alumni mentors.
            You've even added some amazing mentors to your wishlist
            (<em>If you haven't yet, do it now, slots are filling fast!</em>).
          </p>

          <p style="font-size: 15px; margin-bottom: 15px; color: #555;">
            But your application is still <strong style="color: #e74c3c;">incomplete</strong>.
            Without submitting it, you won't be matched with a mentor, and you might miss the chance to connect with the alumni you've shortlisted!
          </p>

          <p style="font-size: 15px; margin-bottom: 15px; color: #555;">Complete your ASMP application in just a few minutes:</p>
          <ul style="margin-bottom: 20px; padding-left: 20px;">
            <li style="margin-bottom: 8px; color: #555;">Log in to your ASMP profile page</li>
            <li style="margin-bottom: 8px; color: #555;">Review your wishlist mentors and select <strong>top 5 preferences</strong> from them</li>
            <li style="margin-bottom: 8px; color: #555;">Write your SOP and expectations</li>
            <li style="margin-bottom: 8px; color: #555;">Click <strong>Submit</strong>, that's it!</li>
          </ul>

          <h3 style="color: #2c3e50; font-size: 18px; margin: 25px 0 15px 0; padding: 15px; background-color: #ecf0f1; border-left: 4px solid #3498db; border-radius: 0 4px 4px 0;">
            Why submit now:
          </h3>
          <ul style="margin-bottom: 25px; padding-left: 20px;">
            <li style="margin-bottom: 8px; color: #555;">Early submissions have the best chance of getting top-choice mentors</li>
            <li style="margin-bottom: 8px; color: #555;">Mentors are looking for proactive and enthusiastic mentees</li>
            <li style="margin-bottom: 8px; color: #555;">Once mentor slots are full, they're gone!</li>
          </ul>

          <p style="font-size: 15px; margin-bottom: 20px; color: #555;">
            This is your chance to learn directly from <strong>IIT Bombay alumni</strong> who've been where you are
            and gone on to achieve remarkable success. <strong>Don't let this opportunity pass.</strong>
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://asmp.sarc-iitb.org/profile" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
              Complete your application now
            </a>
          </div>

          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; color: #856404; font-weight: 600;">
              <strong>Deadline:</strong> 14th August 2025, 11:59 PM
            </p>
          </div>

          <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; color: #495057; font-weight: 600;">For any queries, contact:</p>
            <p style="margin: 5px 0; color: #6c757d;">Aadit Sule | ASMP Head, SARC | +91 8459539918</p>
            <p style="margin: 5px 0; color: #6c757d;">Aastha Maliwal | ASMP Head, SARC | +91 9403521022</p>
          </div>

          <p style="font-size: 15px; margin-top: 30px; color: #555;">
            Regards,<br>
            <strong>Kartik Vaishnav</strong><br>
            Overall Coordinator,<br>
            Student Alumni Relations Cell
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
'''

    msgText = MIMEText(msghtml, "html")
    msgAlternative.attach(msgText)

    try:
        smtp = smtplib.SMTP("smtp-auth.iitb.ac.in", 587)
        smtp.starttls()
        smtp.login("sarc@iitb.ac.in", "c1a90a1351390958f742b8097d9feaab")
        response = smtp.sendmail(strFrom, strTo, msgRoot.as_string())
        smtp.quit()
        return response
    except Exception as e:
        print(f"❌ Email error (reminder): {e}")
        return None