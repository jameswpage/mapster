# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-07 20:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='State',
            fields=[
                ('state_name', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('unemployment', models.FloatField(null=True)),
            ],
        ),
    ]
