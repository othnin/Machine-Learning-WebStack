from django.contrib import admin

from .models import *

# Register your models here.
class EndpointAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'created_at')

class MLAlgorithmAdmin(admin.ModelAdmin):
    #prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'description', 'version', 'owner', 'parent_endpoint' )


class MLAlgorithmStatusAdmin(admin.ModelAdmin):
    #prepopulated_fields = {'slug': ('name',)}
    list_display = ('status', 'active', 'created_by', 'created_at', 'parent_mlalgorithm')


class MLRequestAdmin(admin.ModelAdmin):
    #prepopulated_fields = {'slug': ('title',)}
    list_display = ('input_data', 'full_response', 'response', 'parent_mlalgorithm')

class ABTestAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'summary')


admin.site.register(Endpoint, EndpointAdmin)
admin.site.register(MLAlgorithm, MLAlgorithmAdmin)
admin.site.register(MLAlgorithmStatus, MLAlgorithmStatusAdmin)
admin.site.register(MLRequest, MLRequestAdmin)
admin.site.register(ABTest, ABTestAdmin)

'''
admin.site.register(Endpoint)
admin.site.register(MLAlgorithm)
admin.site.register(MLAlgorithmStatus)
admin.site.register(MLRequest)
admin.site.register(ABTest)
'''