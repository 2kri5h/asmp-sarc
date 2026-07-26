from import_export import resources
from .models import Mentor

class MentorResource(resources.ModelResource):
    class meta:
        model= Mentor