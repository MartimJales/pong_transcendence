from django.contrib import admin
from . models import PlayerProfile, Match, Friendship

admin.site.register(PlayerProfile)
admin.site.register(Match)
admin.site.register(Friendship)