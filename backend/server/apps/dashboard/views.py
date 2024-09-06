from rest_framework import viewsets
from rest_framework import mixins
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import APIException
import psutil, GPUtil, subprocess

from django.shortcuts import render

@api_view(['GET'])
def GetPerformanceCycles(request):
    print("GetPerformanceCycles")
    try:
        # Get the current CPU usage percentage
        cpu_percent = psutil.cpu_percent(interval=1)
    except Exception as e:
        print(f"Error fetching CPU information: {e}")

    try:
        #Get the current GPU usage percentage
        gpus = GPUtil.getGPUs()
        gpu_percent = gpus[0].load * 100 if gpus else None     
    except Exception as e:
        gpu_percent = 'No GPU found'
        print(f"Error fetching GPU information: {e}")
   
    return Response({'cpu_percent': cpu_percent, 'gpu_percent': gpu_percent})


@api_view(['GET'])
def GetNVIDIAInfo(request):
    try:
        output = subprocess.check_output(['nvidia-smi']).decode('utf-8').strip()
    except FileNotFoundError as e:
        print(f"Command not found: {e}")
        output = 'Command not found'
    except subprocess.CalledProcessError as e:
        print(f"Command failed with error: {e}")
        output = 'Error fetching NVIDIA information'
    print('output:', output)
    return Response({'output': output})


@api_view(['GET'])
def GetSysInfo(request):
    print("GetSysInfo")
    try:
        os_output = subprocess.check_output(['lsb_release', '-a']).decode('utf-8').strip()
    except FileNotFoundError as e:
        print(f"Command not found: {e}")
    except subprocess.CalledProcessError as e:
        print(f"Command failed with error: {e}")
    
    try:
        #ram_info = psutil.virtual_memory()
        #ram_output = ram_info.total
        ram_output = subprocess.check_output(['free', '-h']).decode('utf-8').strip()
    except FileNotFoundError as e:
        print(f"Command not found: {e}")
    except subprocess.CalledProcessError as e:
        print(f"Command failed with error: {e}")

    try:
        disk_output = subprocess.check_output(['df', '-h']).decode('utf-8').strip()
        #disk_info = psutil.disk_usage('/')
        #disk_output = disk_info.total
    except FileNotFoundError as e:
        print(f"Command not found: {e}")
    except subprocess.CalledProcessError as e:
        print(f"Command failed with error: {e}")

    try:
        gpu_output = subprocess.check_output(['lshw', '-c', 'display']).decode('utf-8').strip()
    except FileNotFoundError as e:
        print(f"Command not found: {e}")
    except subprocess.CalledProcessError as e:
        print(f"Command failed with error: {e}")

    return Response({'os_output': os_output, 'ram_output': ram_output, 'disk_output': disk_output, 'gpu_output': gpu_output})
    

    