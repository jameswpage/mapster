# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-07 20:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0002_state'),
    ]

    operations = [
        migrations.RenameField(
            model_name='state',
            old_name='unemployment',
            new_name='population',
        ),
        migrations.AddField(
            model_name='state',
            name='size',
            field=models.FloatField(default=0, verbose_name='size'),
        ),
    ]
