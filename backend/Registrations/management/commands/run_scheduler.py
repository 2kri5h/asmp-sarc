from django.core.management.base import BaseCommand
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.date import DateTrigger
from django_apscheduler.jobstores import DjangoJobStore
from Registrations.tasks import send_reminder_emails_12h, send_reminder_emails_fixed
from datetime import datetime, timedelta
import pytz
import time

class Command(BaseCommand):
    help = 'Starts scheduler: (1) every hour for 12h-after-reg, (2) once at a fixed time.'

    def handle(self, *args, **kwargs):
        tz = pytz.timezone("Asia/Kolkata")
        scheduler = BackgroundScheduler(timezone=tz)
        scheduler.add_jobstore(DjangoJobStore(), "default")
        
        # Clear any existing jobs to avoid conflicts
        scheduler.remove_all_jobs()

        # (1) Run every hour => 12h-after-reg logic
        # COMMENTED OUT FOR TESTING - uncomment when ready for production
        # scheduler.add_job(
        #     send_reminder_emails_12h,
        #     # trigger=IntervalTrigger(minutes=3),#from 3 minutes for testing
        #     trigger=IntervalTrigger(hours=1),  # for production
        #     id="send_reminder_emails_12h",
        #     replace_existing=True,
        #     misfire_grace_time=7200,  # 2 hours
        #     max_instances=1,
        # )

        # (2) One-time blast => MODIFIED FOR IMMEDIATE TESTING
        # scheduled_time = tz.localize(datetime(2025, 8, 2, 1, 0, 0))  # Example: August 2, 2025, 01:00 IST
        scheduled_time = tz.localize(datetime.now() + timedelta(seconds=3))  # Run in 3 seconds for testing
        
        try:
            scheduler.add_job(
                send_reminder_emails_fixed,
                trigger=DateTrigger(run_date=scheduled_time),
                id="send_reminder_emails_fixed_test",
                replace_existing=True,
                misfire_grace_time=3600,  # 1 hour
                max_instances=1,
            )
            print(f"✅ Job scheduled successfully for {scheduled_time}")
        except Exception as e:
            print(f"❌ Failed to schedule job: {e}")
            return

        scheduler.start()
        print("✅ Scheduler started. Press Ctrl+C to exit.")
        print("⏳ Waiting for job to execute...")
        
        try:
            # Wait for the job to complete
            time.sleep(8)  # Wait 8 seconds for the job to run
            print("✅ Job execution time completed. You can now stop the scheduler with Ctrl+C")
            
            while True:
                time.sleep(60)
        except (KeyboardInterrupt, SystemExit):
            scheduler.shutdown()
            print("🛑 Scheduler stopped.")