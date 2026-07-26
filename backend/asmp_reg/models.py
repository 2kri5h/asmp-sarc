from django.db import models
from .options import *
import uuid
import json
from django.utils import timezone

class Registration(models.Model):
    def default_dept_mentees():
        return json.dumps(['No_preference_as_such'])
    
    id = models.AutoField(primary_key=True)
    token = models.CharField(max_length=8, unique=True)
    fullname = models.CharField(max_length=255)
    department = models.CharField(max_length=255, choices=BRANCH_CHOICES, default='default_value')
    department_other = models.CharField(max_length=255, blank=True, null=True)
    degree = models.CharField(max_length=255, choices=DEGREE_CHOICES)
    degree_other = models.CharField(max_length=255, blank=True, null=True)
    hostel = models.CharField(max_length=255, choices=HOSTEL_CHOICES, default='default_value')
    year = models.CharField(max_length=255, choices=YEAR_CHOICES, null=True)
    other_year = models.CharField(max_length=255, blank=True, null=True, default='Your Default Value')
    contact = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    linkedin = models.CharField(max_length=255, default='default_value')
    city = models.CharField(max_length=255, default='Your Default Value')
    country = models.CharField(max_length=100, default='Your Default Value', choices=COUNTRY_CHOICES)
    # dept_mentees = models.CharField(
    #     max_length=255, choices=DEPT_MENTEES_FIELDS, default='Your Default Value'
    # )
    
    dept_mentees = models.TextField(default=default_dept_mentees, blank=True)
    
    def get_dept_mentees(self):
        return json.loads(self.dept_mentees)
    
    designation = models.CharField(max_length=255, null=True)
    company_name = models.CharField(max_length=255, null=True)
    work_profile = models.CharField(max_length=255, null=True)
    pref = models.CharField(max_length=255, choices=FIELDS, default='default_value')
    field_other = models.CharField(max_length=255, blank=True, null=True)
    mentees = models.CharField(max_length=255, choices=MENTEES, default='Your Default Value')
    buddy = models.CharField(max_length=255, default='Your Default Value')
    isNew = models.BooleanField(default=False)
    registration_timestamp = models.DateTimeField(default=timezone.now)
    mentee_preference = models.CharField(max_length=255, choices=MENTEE_PREFERENCE_CHOICES, default='no_preference')

    def __str__(self):
        return self.fullname
    
    def save(self, *args, **kwargs):
        if not self.token:
            self.token = "Mentor-" + str(uuid.uuid4().hex)[:8]
        super().save(*args, **kwargs)