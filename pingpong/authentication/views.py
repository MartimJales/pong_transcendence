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
from .models import Match, PlayerProfile, Friendship
from django.contrib.auth.models import User
import json
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.http import require_http_methods
from django.db import IntegrityError

from PIL import Image
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import uuid

import os

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

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'status': 'CSRF cookie set'})

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
def endTour(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        winner = data['tWinner']
        score = data['fScore']
        print(winner)
        return JsonResponse({
            'success': 'deu bom',
            'score': score,
            'winner': winner
            })
    return JsonResponse({'deu ruim': 'nao é POST nesse carai'})

@login_required
def add_friend(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            friend_name = data.get('friendName')
            
            if not friend_name:
                return JsonResponse({'error': 'Please enter friend name'}, status=400)
            
            # Get current user's profile
            current_profile = request.user.playerprofile
            
            # Try to find the friend's user and profile
            try:
                friend_user = User.objects.get(username=friend_name)
                friend_profile = friend_user.playerprofile
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)
            except PlayerProfile.DoesNotExist:
                return JsonResponse({'error': 'User profile not found'}, status=404)
                
            # Check if trying to add themselves
            if friend_user == request.user:
                return JsonResponse({'error': 'Cannot add yourself as friend'}, status=400)
                
            # Check if already friends
            if Friendship.objects.filter(
                from_playerprofile_id=current_profile,
                to_playerprofile_id=friend_profile
            ).exists():
                return JsonResponse({'error': 'Already friends with this user'}, status=400)
                
            # Create friendship
            Friendship.objects.create(
                from_playerprofile_id=current_profile,
                to_playerprofile_id=friend_profile
            )
            
            return JsonResponse({'success': 'Friend added successfully'})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
       
    return JsonResponse({'deu ruim': 'nao é POST nesse carai'}, status=405)

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
            'image_url': profile.userpic.url if profile.userpic else '/static/images/profile_pics/default.jpg',
            'friends': [
                {'username': friend.user.username, 'is_online': friend.is_online}
                for friend in profile.friends.all()
            ]
        }
        return JsonResponse(data)
        
    except Exception as e:
        print(f"Error in get_profile_data: {str(e)}")  # Server-side logging
        return JsonResponse({'error': str(e)}, status=500)


@login_required
def editNick(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_nick = data.get('nick')
            
            if not new_nick:
                return JsonResponse({
                    'error': 'Please provide a nickname'
                }, status=400)
            
            # Get user's profile and update nick
            profile = request.user.playerprofile
            profile.nick = new_nick
            profile.save()
            
            return JsonResponse({
                'success': True,
                'nick': new_nick
            })
            
        except Exception as e:
            return JsonResponse({
                'error': str(e)
            }, status=500)
    
    return JsonResponse({
        'error': 'Method not allowed'
    }, status=405)

@login_required
def get_match_history(request):
    try:
        user = request.user
        profile = user.playerprofile
        
        # Get matches for the user, ordered by date
        matches = Match.objects.filter(player=user).order_by('-match_date')
        
        matches_data = [{
            'opponent': match.opponent,
            'result': match.result,
            'mode': match.mode,
            'earned_points': match.earned_points,
            'match_date': match.match_date.isoformat()
        } for match in matches]
        
        data = {
            'nick': profile.nick,
            'image_url': profile.userpic.url if profile.userpic else '/media/profile_pics/default.jpg',
            'matches': matches_data
        }
        
        return JsonResponse(data)
        
    except Exception as e:
        print(f"Error in get_match_history: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@login_required  # Descomenta essa merde se exigir autenticação   
def game_local(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received data:", data)

            player = request.user

            match = Match.objects.create( 
                player=player, #recebendo o pk mandando de lonjao
                player2=None, # se pa que chama de outra url aqui
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


@ensure_csrf_cookie
def index(request):
    #if request.path.startswith('/admin/'):
     #   return HttpResponseRedirect('/admin/')  # Redirect to admin if someone tries to access it
    return render(request, 'index.html')

@login_required
def handle_user_logout(request):
    if request.user.is_authenticated:
        
        profile = request.user.playerprofile
        profile.is_online = False
        profile.save()

        logout(request)
        
        request.session.flush()
        
        return JsonResponse({
                    'status': 'success',
                    'message': 'Logged out successfully'
                })
        
    return HttpResponse(status=200)

@login_required
def upload_profile_image(request):
    try:
        # Check if there's a file in the request
        if 'image' not in request.FILES:
            return JsonResponse({'error': 'No image file provided'}, status=400)
        
        image_file = request.FILES['image']
        
        # Validate file type
        allowed_types = ['image/jpeg', 'image/png', 'image/gif']
        if image_file.content_type not in allowed_types:
            return JsonResponse({'error': 'Invalid file type. Please upload a JPEG, PNG or GIF'}, status=400)
        
        # Validate file size (e.g., 5MB max)
        if image_file.size > 5 * 1024 * 1024:
            return JsonResponse({'error': 'File too large. Maximum size is 5MB'}, status=400)
        
        # Generate a unique filename
        file_extension = os.path.splitext(image_file.name)[1]
        new_filename = f"profile_{request.user.id}_{uuid.uuid4().hex[:10]}{file_extension}"
        
        # Define the upload path within MEDIA_ROOT/profile_pics
        upload_path = os.path.join('profile_pics', new_filename)
        
        try:
            # Open the image using Pillow
            img = Image.open(image_file)
            
            # Convert to RGB if necessary (in case of PNG with transparency)
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # Resize image to a maximum size while maintaining aspect ratio
            max_size = (800, 800)
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Create a temporary file to save the processed image
            temp_path = os.path.join('profile_pics', f'temp_{new_filename}')
            with default_storage.open(temp_path, 'wb') as f:
                img.save(f, format='JPEG', quality=85)
            
            # If user already has a profile image that's not the default, delete it
            if request.user.playerprofile.userpic and \
               str(request.user.playerprofile.userpic) != 'profile_pics/default.jpg' and \
               os.path.exists(os.path.join(settings.MEDIA_ROOT, str(request.user.playerprofile.userpic))):
                default_storage.delete(str(request.user.playerprofile.userpic))
            
            # Save the new image path to user's profile
            request.user.playerprofile.userpic = upload_path
            request.user.save()
            
            # Move temp file to final location
            default_storage.save(upload_path, default_storage.open(temp_path))
            default_storage.delete(temp_path)
            
            # Generate the URL for the uploaded image
            image_url = default_storage.url(upload_path)
            
            return JsonResponse({
                'success': True,
                'image_url': image_url
            })
            
        except Exception as e:
            # Clean up any temporary files if they exist
            if 'temp_path' in locals() and default_storage.exists(temp_path):
                default_storage.delete(temp_path)
            return JsonResponse({'error': str(e)}, status=500)
            
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)