# file backend/server/apps/endpoints/urls.py
from django.urls import path
from django.conf.urls import include
from rest_framework.routers import DefaultRouter

from apps.endpoints.views import EndpointViewSet
from apps.endpoints.views import MLAlgorithmViewSet
from apps.endpoints.views import MLAlgorithmStatusViewSet
from apps.endpoints.views import MLRequestViewSet
from apps.endpoints.views import PredictView 
from apps.endpoints.views import ABTestViewSet
from apps.endpoints.views import StopABTestView
from apps.endpoints.views import GetGitHubRepo
from apps.endpoints.views import SetGitHubRepo
from apps.endpoints.views import SaveGitHubRepo

router = DefaultRouter(trailing_slash=False)
router.register(r"endpoints", EndpointViewSet, basename="endpoints")
router.register(r"mlalgorithms", MLAlgorithmViewSet, basename="mlalgorithms")
router.register(r"mlrequests", MLRequestViewSet, basename="mlrequests")
router.register(r"mlalgorithmstatuses", MLAlgorithmStatusViewSet, basename="mlalgorithmstatuses")
router.register(r"abtests", ABTestViewSet, basename="abtests")


urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("api/v1/<str:endpoint_name>/predict", PredictView.as_view(), name="predict"),
    path("api/v1/stop_ab_test/<str:ab_test_id>", StopABTestView.as_view(), name="stop_ab"),
    path('api/v1/get_github_info/', GetGitHubRepo.as_view(), name='get_github_info'),
    path('api/v1/set_github_repo/', SetGitHubRepo.as_view(), name='set_github_repo'),
    path('api/v1/save_github_repo/', SaveGitHubRepo.as_view(), name='save_github_repo'),
]