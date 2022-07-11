from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime, timedelta


class User(AbstractUser):
    # TO-DO: Implement this class
    pass

class Product(models.Model):
    # TO-DO: Implement this class
    title = models.CharField(max_length=64)
    description = models.CharField(max_length=64)

    def __str__(self):
        return f"{self.title}: {self.description}"

class Listing(models.Model):
    # TO-DO: Implement this class
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")
    product_id = models.OneToOneField(Product, on_delete=models.CASCADE, primary_key=True)

    current_bid = models.IntegerField()
    num_bids = models.IntegerField()
    active = models.BooleanField()
    # # Duration in days
    # duration = models.IntegerField()
    # start_time = models.DateTimeField()
    # end_time = start_time + timedelta(days = duration)

class Bid(models.Model):
    # TO-DO: Implement this class
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bids")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="bids")


class Comment(models.Model):
    # TO-DO: Implement this class
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
