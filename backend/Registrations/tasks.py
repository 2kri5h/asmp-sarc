from django.utils import timezone
from datetime import timedelta
from Authentication.models import User
from Registrations.models import WishList, Registration
from Authentication.mail import send_reminder_mail
import logging

logger = logging.getLogger(__name__)

def send_reminder_emails_12h():
    """
    Send *once* to users who registered 12+ hours ago,
    have NOT completed their mentorship application, and have NOT been reminded.
    """
    # twelve_hours_ago = timezone.now() - timedelta(minutes=4) # Adjusted for testing
    twelve_hours_ago = timezone.now() - timedelta(hours=12) # For production
    users_to_remind = (
        User.objects.filter(
            is_active=True, #for active users only,meaning they have registered and verified
            date_joined__lte=twelve_hours_ago,
            reminder_sent=False,
        )
        .exclude(id__in=Registration.objects.values_list("user_id", flat=True).distinct())
    )
    
    if not users_to_remind.exists():
        print("📧 No users need 12-hour reminders at this time")
        return
    
    print(f"📧 Sending 12-hour reminders to {users_to_remind.count()} users...")
    print("─" * 50)
    
    for i, user in enumerate(users_to_remind, 1):
        try:
            send_reminder_mail(
                emailid=user.ldap, 
                name=user.fullname,
            )
            user.reminder_sent = True
            print(f"✅ [{i:2d}/{users_to_remind.count()}] 12h reminder sent to: {user.ldap}")
            user.save(update_fields=["reminder_sent"])
            logger.info(f"✅ 12h reminder sent to {user.ldap}")
        except Exception as e:
            print(f"❌ [{i:2d}/{users_to_remind.count()}] Failed: {user.ldap} - {e}")
            logger.error(f"❌ Failed (12h) to {user.ldap}: {e}")
        
        # Add space between emails (except for the last one)
        if i < users_to_remind.count():
            print()
    
    print("─" * 50)
    print(f"🎯 Completed: {users_to_remind.count()} 12-hour reminder emails sent")


def send_reminder_emails_fixed():
    """
    Send to all active users who have NOT completed their mentorship application.
    Useful for blast reminders on a specific date/time.
    """
    users_to_remind = (
        User.objects.filter(
            is_active=True,  # Only active users who have registered and verified
        )
        .exclude(id__in=Registration.objects.values_list("user_id", flat=True).distinct())
    )

    print(f"📧 Sending reminders to {users_to_remind.count()} users...")
    print("─" * 50)
    
    for i, user in enumerate(users_to_remind, 1):
        try:
            send_reminder_mail(
                emailid=user.ldap,
                name=user.fullname,
            )
            print(f"✅ [{i:2d}/{users_to_remind.count()}] Sent to: {user.ldap}")
            logger.info(f"✅ Fixed-date reminder sent to {user.ldap}")
        except Exception as e:
            print(f"❌ [{i:2d}/{users_to_remind.count()}] Failed: {user.ldap} - {e}")
            logger.error(f"❌ Failed (fixed) to {user.ldap}: {e}")
        
        # Add space between emails (except for the last one)
        if i < users_to_remind.count():
            print()
    
    print("─" * 50)
    print(f"🎯 Completed: {users_to_remind.count()} reminder emails sent")