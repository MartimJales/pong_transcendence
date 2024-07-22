from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect



# Create your views here.

def mama_eu(request):
    return render(request, 'try.html', {'name' : 'armando pinto'})

def viadinho(request):
    return render(request, 'viadin.html')

def homerender(request):
    return render(request, 'index.html')

def loginrender(request):
    return render(request, 'login.html')