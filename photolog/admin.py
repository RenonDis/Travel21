from django.contrib import admin

# Register your models here.

from .models import *


class AdmArticle(admin.ModelAdmin):
    list_display = ('creationDate','title')
    fieldsets = [
                 ('Date ajout', {'fields': ['creationDate']}),
                 ('Title', {'fields': ['title']}),
                 ('Photo(s)', {'fields': ['relatedPhotos']}),
                 ('Country', {'fields': ['relatedCountries']}),
                 ('Misc', {'fields': ['textContent']}),
                 ]
    
    list_filter = ['creationDate']
    
class AdmPhoto(admin.ModelAdmin):
    fieldsets = [
             ('Title', {'fields': ['title']}),
             ('Misc', {'fields': ['is_dark','file']}),
             ]


admin.site.register(Article, AdmArticle)
admin.site.register(Photo, AdmPhoto)
admin.site.register(Country)
admin.site.register(Location)