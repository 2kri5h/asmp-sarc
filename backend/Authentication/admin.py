from django.contrib import admin
from .models import User, Profile, Token


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    search_fields = ('ldap', 'fullname')


admin.site.register(Profile)
admin.site.register(Token)