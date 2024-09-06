# file backend/server/apps/endpoints/urls.py
from django.urls import path
from django.conf.urls import include
from rest_framework.routers import DefaultRouter

from apps.dashboard.views import GetPerformanceCycles
from apps.dashboard.views import GetSysInfo
from apps.dashboard.views import GetNVIDIAInfo

router = DefaultRouter(trailing_slash=False)


urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("api/v1/widget_get_perf_cycles/", GetPerformanceCycles, name='get_perf_cycles'),
    path("api/v1/widget_get_sys_info/", GetSysInfo, name='get_sys_info'),
    path('api/v1/widget_get_nvidia_info/', GetNVIDIAInfo, name='get_nvidia_info'),
]

