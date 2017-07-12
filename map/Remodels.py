#James Page
#6/30/2017
#these are the models for the new database, which uses SQLite
#it has a one to many relationship for state to metrics


# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
        
        
class State(models.Model):
    state_name = models.CharField(max_length = 20, primary_key = True)
    state_code = models.IntegerField(null = True)
    size = models.FloatField('size',default = 0)
    population = models.IntegerField(null=True)
    
    def __unicode__(self):
        return self.state_name
    
    def get_size(self):
        return self.size
    
    def get_population(self):
        return self.population
    
    def get_code(self):
        return self.code


class Metric(models.Model):
    pState = models.ForeignKey(State, on_delete=models.CASCADE)
    metric_name = models.CharField(max_length=200)
    metric_id = models.IntegerField(null = True)
    value = models.FloatField('value', default = 0)
    opacity = models.FloatField('opacity',default = 0)
    
    def __unicode__(self):
        return self.pState + " " + self.metric_name
    
    def get_value(self):
        return self.value
    
    def get_opacity(self):
        return self.opacity


