from django.contrib import admin
from .models import Registration
from .views import export
from django.utils.html import format_html
from datetime import datetime

# admin.site.register(Registration)

# class RegistrationAdmin(admin.ModelAdmin):
#     list_display = ['token', 'fullname', 'isNew']


class NewRegistrations(admin.ModelAdmin):
    list_display = ['token', 'fullname', 'registration_date', 'isNew']
    list_filter = ['isNew']  # Adds a filter for isNew field
    ordering = ['fullname']  # Default sorting by fullname
    search_fields = ['fullname']  # Adds search functionality
    actions = ['export_data']
    readonly_fields = ['token']

    def registration_date(self, obj):
        if obj.registration_timestamp:
            return obj.registration_timestamp.strftime('%Y-%m-%d')
        return '-'
    registration_date.short_description = 'Registration Date'
    registration_date.admin_order_field = 'registration_timestamp'  # Enables sorting by date

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        if fieldsets is None:
            fieldsets = []
        
        # Find the fieldset containing preference fields
        for fieldset in fieldsets:
            if 'preference_' in str(fieldset[1]['fields']):
                # Keep only one preference field at a time
                fields = list(fieldset[1]['fields'])
                preference_fields = [f for f in fields if f.startswith('preference_')]
                other_fields = [f for f in fields if not f.startswith('preference_')]
                
                # Add preference fields with better labels
                fieldset[1]['fields'] = other_fields + preference_fields
                fieldset[1]['description'] = 'Select only one preference option'
                break
        
        return fieldsets

    def get_queryset(self, request):
        return super().get_queryset(request)  # Shows all registrations
    
    def export_data(self, request, queryset):
        response = export(request)
        return response

    # export_data.short_description = 'Export Selected Registrations'
    
admin.site.register(Registration, NewRegistrations)