from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post")
    post_body = models.CharField(max_length=280, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    users_that_liked = models.ManyToManyField(User, related_name="liked_posts")

    def serialize(self):
        return {
            "post_id": self.id,
            "owner": self.owner.username,
            "post_body": self.post_body,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": self.likes,
        }

class Follow(models.Model):
    user = models.ForeignKey(User, related_name="following", on_delete=models.CASCADE)
    following_user = models.ForeignKey(User, related_name="followers", on_delete=models.CASCADE)

class Account(models.Model):
    account_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="account")
    balance = models.IntegerField(default=10000)
    current_stock = models.CharField(default="NFLX", max_length=4)
