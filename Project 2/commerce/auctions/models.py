from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # TO-DO: Implement this class
    def __str__(self):
        return f"{self.get_full_name()}"

class Listing(models.Model):
    # TO-DO: Implement this class
    title = models.CharField(max_length=64)
    description = models.CharField(max_length=64)
    start_bid = models.IntegerField()

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_listings")

    def __str__(self):
        return f"{self.title}: {self.description}"


class Bid(models.Model):
    # TO-DO: Implement this class
    pass

class Comment(models.Model):
    # TO-DO: Implement this class
    pass
