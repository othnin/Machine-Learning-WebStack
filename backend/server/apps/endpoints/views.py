# backend/server/apps/endpoints/views.py file
from rest_framework import viewsets
from rest_framework import mixins
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.exceptions import APIException

from apps.endpoints.models import Endpoint
from apps.endpoints.serializers import EndpointSerializer
from apps.endpoints.models import MLAlgorithm
from apps.endpoints.serializers import MLAlgorithmSerializer
from apps.endpoints.models import MLAlgorithmStatus
from apps.endpoints.serializers import MLAlgorithmStatusSerializer
from apps.endpoints.models import MLRequest
from apps.endpoints.serializers import MLRequestSerializer
from apps.endpoints.models import ABTest
from apps.endpoints.serializers import ABTestSerializer

import datetime, os, shutil, git, json
from numpy.random import rand
from django.utils import timezone
from datetime import datetime

from apps.ml.registry import MLRegistry
from server.load_algorithm import registry
from django.db import transaction
from django.db.models import F



class EndpointViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = EndpointSerializer
    queryset = Endpoint.objects.all()


class MLAlgorithmViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = MLAlgorithmSerializer
    queryset = MLAlgorithm.objects.all()


def deactivate_other_statuses(instance):
    old_statuses = MLAlgorithmStatus.objects.filter(parent_mlalgorithm = instance.parent_mlalgorithm,
                                                        created_at__lt=instance.created_at, active=True)

    for i in range(len(old_statuses)):
        old_statuses[i].active = False
    MLAlgorithmStatus.objects.bulk_update(old_statuses, ["active"])



class MLAlgorithmStatusViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet,
    mixins.CreateModelMixin):

    serializer_class = MLAlgorithmStatusSerializer
    queryset = MLAlgorithmStatus.objects.all()
    def perform_create(self, serializer):
        try:
            with transaction.atomic():
                instance = serializer.save(active=True)
                deactivate_other_statuses(instance)

        except Exception as e:
            raise APIException(str(e))          

class MLRequestViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet,
    mixins.UpdateModelMixin):

    serializer_class = MLRequestSerializer
    queryset = MLRequest.objects.all()



'''
View for predictions that can accept POST requests w/JSON data and forward it to the correct ML Algorithm
'''
class PredictView(views.APIView):
    def post(self, request, endpoint_name, format=None):

        algorithm_status = self.request.query_params.get("status", "production")
        algorithm_version = self.request.query_params.get("version")

        algs = MLAlgorithm.objects.filter(parent_endpoint__name = endpoint_name, status__status = algorithm_status, status__active=True)

        if algorithm_version is not None:
            algs = algs.filter(version = algorithm_version)

        if len(algs) == 0:
            return Response(
                {"status": "Error", "message": "ML algorithm is not available"},
                status=status.HTTP_400_BAD_REQUEST,)
        if len(algs) != 1 and algorithm_status != "ab_testing":
            return Response(
                {"status": "Error", "message": "ML algorithm selection is ambiguous. Please specify algorithm version."},
                status=status.HTTP_400_BAD_REQUEST,)
        alg_index = 0
        if algorithm_status == "ab_testing":
            alg_index = 0 if rand() < 0.5 else 1

        algorithm_object = registry.endpoints[algs[alg_index].id]
        prediction = algorithm_object.compute_prediction(request.data)


        label = prediction["label"] if "label" in prediction else "error"
        ml_request = MLRequest(
            input_data=json.dumps(request.data),
            full_response=prediction,
            response=label,
            feedback="",
            parent_mlalgorithm=algs[alg_index],)
        ml_request.save()

        prediction["request_id"] = ml_request.id

        return Response(prediction)


class ABTestViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet,
    mixins.CreateModelMixin, mixins.UpdateModelMixin):

    serializer_class = ABTestSerializer
    queryset = ABTest.objects.all()

    def perform_create(self, serializer):
        try:
            with transaction.atomic():
                instance = serializer.save()
                # update status for first algorithm

                status_1 = MLAlgorithmStatus(status = "ab_testing",
                                created_by=instance.created_by,
                                parent_mlalgorithm = instance.parent_mlalgorithm_1,
                                active=True)
                status_1.save()
                deactivate_other_statuses(status_1)
                # update status for second algorithm
                status_2 = MLAlgorithmStatus(status = "ab_testing",
                                created_by=instance.created_by,
                                parent_mlalgorithm = instance.parent_mlalgorithm_2,
                                active=True)
                status_2.save()
                deactivate_other_statuses(status_2)

        except Exception as e:
            raise APIException(str(e))



class StopABTestView(views.APIView):
    def post(self, request, ab_test_id, format=None):

        try:
            ab_test = ABTest.objects.get(pk=ab_test_id)
            if ab_test.ended_at is not None:
                return Response({"message": "AB Test already finished."})

            date_now = datetime.datetime.now()
            # alg #1 accuracy
            all_responses_1 = MLRequest.objects.filter(parent_mlalgorithm=ab_test.parent_mlalgorithm_1, created_at__gt = ab_test.created_at, created_at__lt = date_now).count()
            correct_responses_1 = MLRequest.objects.filter(parent_mlalgorithm=ab_test.parent_mlalgorithm_1, created_at__gt = ab_test.created_at, created_at__lt = date_now, response=F('feedback')).count()
            accuracy_1 = correct_responses_1 / float(all_responses_1)

            # alg #2 accuracy
            all_responses_2 = MLRequest.objects.filter(parent_mlalgorithm=ab_test.parent_mlalgorithm_2, created_at__gt = ab_test.created_at, created_at__lt = date_now).count()
            correct_responses_2 = MLRequest.objects.filter(parent_mlalgorithm=ab_test.parent_mlalgorithm_2, created_at__gt = ab_test.created_at, created_at__lt = date_now, response=F('feedback')).count()
            accuracy_2 = correct_responses_2 / float(all_responses_2)

            # select algorithm with higher accuracy
            alg_id_1, alg_id_2 = ab_test.parent_mlalgorithm_1, ab_test.parent_mlalgorithm_2
            # swap
            if accuracy_1 < accuracy_2:
                alg_id_1, alg_id_2 = alg_id_2, alg_id_1

            status_1 = MLAlgorithmStatus(status = "production",
                            created_by=ab_test.created_by,
                            parent_mlalgorithm = alg_id_1,
                            active=True)
            status_1.save()
            deactivate_other_statuses(status_1)
            # update status for second algorithm
            status_2 = MLAlgorithmStatus(status = "testing",
                            created_by=ab_test.created_by,
                            parent_mlalgorithm = alg_id_2,
                            active=True)
            status_2.save()
            deactivate_other_statuses(status_2)


            summary = "Algorithm #1 accuracy: {}, Algorithm #2 accuracy: {}".format(accuracy_1, accuracy_2)
            ab_test.ended_at = date_now
            ab_test.summary = summary
            ab_test.save()

        except Exception as e:
            return Response({"status": "Error", "message": str(e)},
                            status=status.HTTP_400_BAD_REQUEST
            )
        return Response({"message": "AB Test finished.", "summary": summary})
    

class GetGitHubRepo(views.APIView):
    def post(self, request, format=None):
        try:
            data = request.data
            if 'url' not in data:
                return Response({"status": "Error", "message": "URL not provided in request data"},
                                status=status.HTTP_400_BAD_REQUEST)

            repo_url = data['url']
            repo_name = repo_url.split('/')[-1]
            local_path = os.path.join("/home/achilles/Documents/Machine-Learning-WebStack/backend/server/apps/ml", repo_name) #TODO: Fix hard coded path

            if os.path.isdir(local_path):
                print(f'Repository already exists at location: {local_path}')
                shutil.rmtree(local_path)
                print(f'Repository at {local_path} has been removed.')

            # Clone the repository
            repo = git.Repo.clone_from(repo_url, local_path)

            # Dictionary to hold the branch and commit information
            response_data = {}
            commits_seen = set()

            # Function to process commits
            def process_commits(branch_name):
                branch_commits = []
                for commit in repo.iter_commits(branch_name):
                    if commit.hexsha not in commits_seen:
                        commit_info = {
                            'commit_number': commit.hexsha,
                            'author': commit.author.name,
                            'message': commit.message,
                            'date': timezone.make_aware(datetime.fromtimestamp(commit.committed_date)).isoformat(),
                        }
                        branch_commits.append(commit_info)
                        commits_seen.add(commit.hexsha)
                return branch_commits

            # List of branches to process with priority to the "HEAD" branch
            branches = repo.branches
            priority_branches = ['HEAD']

            repo.remotes.origin.fetch()
            other_branches = [branch.name for branch in repo.remote().refs if branch not in priority_branches]

            # Process main or master branch first
            for priority_branch in priority_branches:
                if priority_branch in [branch.name for branch in branches]:
                    repo.git.checkout(priority_branch)
                    response_data[priority_branch] = process_commits(priority_branch)
                    break

            # Process the rest of the branches
            for branch_name in other_branches:
                repo.git.checkout(branch_name)
                response_data[branch_name] = process_commits(branch_name)

            return Response({"status": "Repository processed successfully.", "data": response_data})

        except Exception as e:
            return Response({"status": "Error", "message": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)
        

class SetGitHubRepo(views.APIView):
    def post(self, request, format=None):
        try:
            data = request.data
            print(data)
            repo_url = data['url']
            repo_name = repo_url.split('/')[-1]
            local_path = os.path.join("/home/achilles/Documents/Machine-Learning-WebStack/backend/server/apps/ml", repo_name)
            repo = git.Repo(local_path) 
            repo.git.checkout(data['commit_number'])
            '''
            if 'url' not in data:
                return Response({"status": "Error", "message": "URL not provided in request data"},
                                status=status.HTTP_400_BAD_REQUEST)
            print("0")
            repo_url = data['url']
            repo_name = repo_url.split('/')[-1]
            local_path = os.path.join("/home/achilles/Documents/Machine-Learning-WebStack/backend/server/apps/ml", repo_name) #TODO: Fix hard coded path
            print("1")
            if not os.path.isdir(local_path):
                return Response({"status": "Error", "message": "Repository does not exist at the specified location."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Load the algorithm from the repository
            #registry.load_algorithm(local_path)
            print("Return ok")
            '''
            return Response({"message": "Algorithm loaded successfully."})

        except Exception as e:
            return Response({"status": "Error", "message": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)