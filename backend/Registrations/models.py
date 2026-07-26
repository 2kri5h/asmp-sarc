from django.db import models
from Authentication.models import User
from Mentors.models import Mentor

# Create your models here.
class Registration(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    pref1 = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='pref1')
    pref2 = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='pref2')
    pref3 = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='pref3')
    pref4 = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='pref4')
    pref5 = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='pref5')
    
    def __str__(self):
        return self.user.ldap+" "+self.pref1.fullname

class WishList(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    mentors = models.ManyToManyField(Mentor, related_name='wishlist', max_length=15)
    
    def __str__(self):
        return self.user.ldap+" "+self.user.fullname