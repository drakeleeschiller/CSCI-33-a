# Generated by Django 4.0.6 on 2022-07-11 05:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0002_listing_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='category',
            field=models.CharField(blank=True, choices=[('TOY', 'Toys'), ('TEC', 'Tech'), ('FRT', 'Furniture'), ('CLT', 'Clothes'), ('MIS', 'Other')], default='MISC', max_length=64),
        ),
        migrations.AlterField(
            model_name='listing',
            name='image',
            field=models.URLField(blank=True, null=True),
        ),
    ]
