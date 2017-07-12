# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, get_object_or_404
from django.template import loader
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views import generic
from PIL import Image
import numpy as np
import json
from django.core.serializers.json import DjangoJSONEncoder
from django.core.serializers import serialize


from .models import State
# Create your views here.

    
def index(request):
    state_list = State.objects.all()
    template = loader.get_template('map/display.html')
    state_json_2 = serialize('json', state_list, cls = DjangoJSONEncoder)
    context = {
        #'state_list': state_list,
        #'state_array': state_array,
        #'state_json': state_json,
        'state_json_2': state_json_2,
    }
    return HttpResponse(template.render(context, request))

def image(request):

    # ... create/load image here ...
    image = Image.new("RGB", (800, 600), np.random.randint(256*256*256))

    # serialize to HTTP response
    response = HttpResponse(content_type="image/png")
    image.save(response, "PNG")
    return response
#
#class IndexView(generic.ListView):
#    template_name = 'map/index.html'
#    context_object_name = 'latest_question_list'
#    
#    def get_queryset(self):
#        """Return the last five published questions"""
#        return Question.objects.order_by('-pub_date')[:5]
#    
#class DetailView(generic.DetailView):
#    model = Question
#    template_name = 'map/detail.html'
#
#class ResultsView(generic.DetailView):
#    model = Question
#    template_name = 'map/results.html'
#    
#
#
#def vote(request, question_id):
#    question = get_object_or_404(Question, pk=question_id)
#    try:
#        selected_choice = question.choice_set.get(pk=request.POST['choice'])
#    except (KeyError, Choice.DoesNotExist):
#        # Redisplay the question voting form.
#        return render(request, 'map/detail.html', {
#            'question': question,
#            'error_message': "You didn't select a choice.",
#        })
#    else:
#        selected_choice.votes += 1
#        selected_choice.save()
#        # Always return an HttpResponseRedirect after successfully dealing
#        # with POST data. This prevents data from being posted twice if a
#        # user hits the Back button.
#        return HttpResponseRedirect(reverse('map:results', args=(question.id,)))