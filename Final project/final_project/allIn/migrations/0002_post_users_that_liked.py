# Generated by Django 4.0.6 on 2022-08-05 23:41

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('allIn', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='users_that_liked',
            field=models.ManyToManyField(related_name='liked_posts', to=settings.AUTH_USER_MODEL),
        ),
    ]