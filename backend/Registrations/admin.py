from django.contrib import admin
from .models import Registration, WishList
from .views import export_csv, export_csv_wishlist


# Register your models here.
def export_selected_to_csv(modeladmin, request, queryset):
    return export_csv(request)

export_selected_to_csv.short_description = "Export selected registrations to CSV"

class RegistrationAdmin(admin.ModelAdmin):
    actions = [export_selected_to_csv]

admin.site.register(Registration, RegistrationAdmin)

def export_selected_to_csv_wishlist(modeladmin, request, queryset):
    return export_csv_wishlist(request, queryset)

export_selected_to_csv_wishlist.short_description = "Export selected wishlist to CSV"

class WishListAdmin(admin.ModelAdmin):
    actions = [export_selected_to_csv_wishlist]

admin.site.register(WishList, WishListAdmin)