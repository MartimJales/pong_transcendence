# Generated by Django 4.2.17 on 2024-12-04 21:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0008_auto_20240916_1828'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playerprofile',
            name='userpic',
            field=models.ImageField(default='profile_pics/default.jpg', upload_to='static/media/profile_pics/'),
        ),
    ]
