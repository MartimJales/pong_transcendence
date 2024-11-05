from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, auth
from django.contrib import messages
from . forms import UserCreateForm
from django.views.decorators.csrf import csrf_exempt

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import Match
from django.contrib.auth.models import User
import json
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login
from django.views.decorators.http import require_http_methods
from django.db import IntegrityError

# Create your views here.

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('userName')
            email = data.get('email')
            password = data.get('pass')
            password_conf = data.get('passconf')

            try:
                User.objects.create_user(
                    username=username,
                    email=email,
                    password=password
                )
                return JsonResponse({
                    'success': 'Account created successfully, please login to computaria'
                }, status=201)

            except IntegrityError:
                return JsonResponse({
                    'error': 'Username or email already exists'
                },status=401)

        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Invalid JSON data'
            }, status=400)

        except Exception as e:
            return JsonResponse({
                'error': f'sepa que deu emrda: {str(e)}'
            }, status=500)

    return JsonResponse({
        'error': 'nao é POST nesse carai'
    }, status=405)



@csrf_exempt 
def api_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if username is None or password is None:
            return JsonResponse({'error': 'Please provide username and password'}, status=400)

        user = authenticate(username=username, password=password)

        if user is None:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

        login(request, user)
        return JsonResponse({
            'success': 'User logged in successfully',
            'user_id': user.id,
            'username': user.username,
            })
    return JsonResponse({'deu ruim': 'nao é POST nesse carai'})

@login_required
def get_profile_data(request):
    print("chegou poha")
    try:
        user = request.user
        profile = user.playerprofile
        
        data = {
            'username': user.username,
            'nick': profile.nick,
            'losses': profile.losses,
            'wins': profile.wins,
            'total_points': profile.total_points,
            'image_url': profile.userpic.url if profile.userpic else '/media/profile_pics/default.jpg',
            'friends': [
                {'username': friend.user.username, 'is_online': friend.is_online}
                for friend in profile.friends.all()
            ]
        }
        return JsonResponse(data)
        
    except Exception as e:
        print(f"Error in get_profile_data: {str(e)}")  # Server-side logging
        return JsonResponse({'error': str(e)}, status=500)


def profile_view(request, user_id):
    user = get_object_or_404(User, id=user_id)
    #profile = user.playerprofile - objeto inteiro, we in .hmlt as profile.nick this way
    #context = {
        #'profile': profile,
    #}
    profile = user.playerprofile
    friends = profile.friends.all() # checar pk na pora do user
    context = {
        'nick': profile.nick,
        'total_points': profile.total_points,
        'wins': profile.wins,
        'losses': profile.losses,
        'friends': friends,
        #'image_url': profile.userpic.url #if profile.userpic else None,
    }
    return render(request, 'profile.html', context)

@login_required
def edit_profile(request, user_id):
    user = get_object_or_404(User, id=user_id)
    profile = user.playerprofile

    if request.method == 'POST':
        new_nick = request.POST.get('nick')
        if new_nick:
            profile.nick = new_nick
            profile.save()
            messages.success(request, 'Your nickname has been updated successfully.')
        else:
            messages.error(request, 'Please provide a valid nickname.')
        return redirect('user_profile', user_id=user.id)

    context = {
        'nick': profile.nick,
    }
    return render(request, 'edit_profile.html', context)

def game_option(request, user_id):
    user = request.user
    return render(request, 'game_option.html', {'user': user})

@csrf_exempt  # Desabilita a verificação CSRF (apenas para desenvolvimento)
# @login_required  # Descomenta essa merde se exigir autenticação   
def game_end(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received data:", data)

            player = User.objects.get(id=data['player_id'])
            player2 = User.objects.get(id=data['player2_id']) if data.get('player2_id') else None

            match = Match.objects.create( 
                player=player, #recebendo o pk mandando de lonjao
                player2=player2, # se pa que chama de outra url aqui
                earned_points=data['earned_points'],
                mode=data['mode'],
                opponent=data['opponent'],
                result=data['result'],
                match_date=datetime.fromisoformat(data['match_date'].replace('Z', '+00:00'))
            )

            return JsonResponse({
                'status': 'success',
                'message': 'Match created successfully',
                'match_id': match.id
            })
        except json.JSONDecodeError as e:
            print("JSON Decode Error:", str(e))
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid JSON data'
            }, status=400)
        except KeyError as e:
            print("KeyError:", str(e))
            return JsonResponse({
                'status': 'error',
                'message': f'Missing required field: {str(e)}'
            }, status=400)
        except User.DoesNotExist:
            print("User DoesNotExist Error")
            return JsonResponse({
                'status': 'error',
                'message': 'User not found'
            }, status=404)
        except Exception as e:
            print("Unexpected Error:", str(e))
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)

    return JsonResponse({
        'status': 'error',
        'message': 'Only POST requests are allowed SEU ARROMBADO'
    }, status=405)

def user_history(request, user_id):
    
    user = request.user
    #user = get_object_or_404(User, id=user_id) 
    user_matches = user.matches_as_player.all() # da para puxar no nome do model suave papai, yesssss só usar o related_name

    context = {'user': user, 'matches': user_matches}

    return render(request, 'profile_history.html', context)

@login_required
def get_friends_list(request):
    user = request.user
    friends = user.playerprofile.friends.all()
    friend_data = [{'username': friend.user.username, 'is_online': friend.is_online} for friend in friends]
    return JsonResponse({'friends': friend_data})

@login_required
def add_friend(request):
    if request.method == 'POST':
        friend_username = request.POST.get('friend_username')
        try:
            friend = User.objects.get(username=friend_username)
            if friend == request.user:
                return JsonResponse({'status': 'error', 'message': "You can't add yourself as a friend."})
            elif request.user.playerprofile.friends.filter(user=friend).exists():
                return JsonResponse({'status': 'error', 'message': f"You are already friends with {friend_username}."})
            else:
                request.user.playerprofile.friends.add(friend.playerprofile)
                friend.playerprofile.friends.add(request.user.playerprofile)
                return JsonResponse({'status': 'success', 'message': f"{friend_username} has been added to your friends list."})
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': f"User {friend_username} not found."})
    
    return JsonResponse({'status': 'error', 'message': "Invalid request method."})

    #def friend_list(request):
    #user_profile = request.user.playerprofile
    #friends = user_profile.friends.all()
    #online_friends = friends.filter(is_online=True)
    #
    #return render(request, 'friend_list.html', {
    #    'friends': friends,
    #    'online_friends': online_friends,
    #}).

@ensure_csrf_cookie
def index(request):
    #if request.path.startswith('/admin/'):
     #   return HttpResponseRedirect('/admin/')  # Redirect to admin if someone tries to access it
    return render(request, 'index.html')

def handle_user_logout(request):
    if request.user.is_authenticated:
        
        profile = request.user.playerprofile
        profile.is_online = False
        profile.save()
        
        request.session.flush()
        
    return HttpResponse(status=200)