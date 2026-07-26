from django.db import models
from .options import *

class Mentor(models.Model):
    fullname = models.CharField(max_length=100)
    dept = models.CharField(max_length=100, choices=(BRANCH_CHOICES))
    degree = models.CharField(max_length=100, choices=(DEGREE_CHOICES))
    other_dept = models.CharField(max_length=100, blank=True, null=True)
    other_degree = models.CharField(max_length=100, blank=True, null=True)
    year = models.CharField(choices=(YEAR_CHOICES), default='2014', max_length=4)
    email = models.EmailField(max_length=100)
    contact = models.CharField(max_length=10)
    hostel = models.CharField(max_length=100, choices=(HOSTEL_CHOICES))
    linkedin = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, choices=(COUNTRY_CHOICES))
    designation = models.CharField(max_length=100)
    company_name = models.CharField(max_length=100)
    work_profile = models.CharField(max_length=4000)
    pref = models.CharField(max_length=100, choices=(FIELDS))
    otherPref = models.CharField(max_length=100, blank=True, null=True)
    preferred_mentees = models.IntegerField()
    should_show = models.BooleanField(default=True)
    popularity = models.IntegerField(default=0)
    
    def __str__(self):
        return str(self.id) + " " + self.fullname+" "+self.designation