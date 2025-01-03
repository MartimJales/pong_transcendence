# Generated by Django 3.2.25 on 2024-09-16 18:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0007_auto_20240913_1141'),
    ]

    operations = [
        migrations.AlterField(
            model_name='friendship',
            name='from_playerprofile_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friendships', to='authentication.playerprofile'),
        ),
        migrations.AlterField(
            model_name='friendship',
            name='to_playerprofile_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friend_requests', to='authentication.playerprofile'),
        ),
    ]
