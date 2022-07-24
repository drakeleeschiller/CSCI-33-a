from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    owner = models.ForeignKey("User", on_delete=models.CASCADE, related_name="post")
    post_body = models.CharField(max_length=280, blank=True)
    timestamp = models.DateField(auto_now_add=True)
    likes = models.IntegerField(default=0)

    def __str__(self):
        return self.text


class Comment(models.Model):
    owner = models.ForeignKey("User", on_delete=models.CASCADE, related_name="comment")
    post = models.ForeignKey("Post", on_delete=models.CASCADE, related_name="post")
    comment_body = models.CharField(max_length=280)

    def __str__(self):
            return self.text