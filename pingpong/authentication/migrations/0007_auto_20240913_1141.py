# Generated by Django 3.2.25 on 2024-09-13 11:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('authentication', '0006_alter_playerprofile_userpic'),
    ]

    operations = [
        migrations.AddField(
            model_name='playerprofile',
            name='is_online',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='Friendship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('from_playerprofile_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friendships', to=settings.AUTH_USER_MODEL)),
                ('to_playerprofile_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friend_requests', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='playerprofile',
            name='friends',
            field=models.ManyToManyField(through='authentication.Friendship', to='authentication.PlayerProfile'),
        ),
    ]
