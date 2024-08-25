# Generated by Django 4.2.14 on 2024-08-23 15:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_playerprofile_image_alter_playerprofile_nick'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playerprofile',
            name='image',
            field=models.ImageField(default='default.jpg', upload_to='profile_pics/'),
        ),
        migrations.AlterField(
            model_name='playerprofile',
            name='nick',
            field=models.CharField(default='Please choose a nick', max_length=50),
        ),
    ]
