from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render, redirect

from . forms import UserCreateForm



# Create your views here.

def mama_eu(request):
    return render(request, 'try.html', {'name' : 'armando pinto'})

def signup(request):

    form = UserCreateForm()

    if request.method == 'POST':

        form = UserCreateForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('landing')

    context = {'registerform':form}
    return render(request, 'signup.html', context=context)

def homerender(request):
    return render(request, 'index.html')

def loginrender(request):
    return render(request, 'login.html')