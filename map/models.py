# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import datetime

from django.db import models
        
        
class State(models.Model):
    state_code = models.IntegerField(null = True)
    state_name = models.CharField(max_length = 20, primary_key = True)
    population = models.FloatField(null = True)
    employment = models.IntegerField(null = True)
    size = models.FloatField('size',default = 0)
    
    def __unicode__(self):
        return self.state_name
    
    def get_population(self):
        return self.population
    
    def get_size(self):
        return self.size
    
    def get_code(self):
        return self.code
        
    def get_employment(self):
        return employment
        
# Create your models here.
