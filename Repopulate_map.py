import os 
import sys
import json
import requests
from dicts import state_list, statesToCode


#API key provided by census bureau
apiKey = 'fc7d67bf8c0753b0f7311d3b72ce91efd37e4e26'


def populate():
    for state in state_list:
        pop = get_pop(state)
        area = get_area(state)
        print state, statesToCode[state], get_area(state)
        s = State(state_code = statesToCode[state], state_name = state, 
        population = pop, size = area)
        
        popDen = Metric(pState = s, metric_name = "Population Density", 
        metric_id = 1, value = pop/area)
        
        emp = Metric(pState = s, metric_name = "Employment", metric_id = 2,
        value = get_employment(state))
        
        popDen.save()
        emp.save()
        s.save()
        

def fillOpacities():
    for 
        
        
       # s.save()
     

#get_area and get_pop are state attributs that are used in a number of metrics,
#namely per capita and per unit area metrics
def get_area(state_name):
    '''this is a method that gets the state area from its name using the census
    API'''
    #retrieve data from censes database
    code = statesToCode[state_name] 
    url = 'http://api.census.gov/data/2000/sf1?get=AREALAND,AREAWATR&for=state:' + code + '&key=' + apiKey
    page = requests.get(url)
    content_list = json.loads(page.content)
    total_area = int(content_list[1][0])+int(content_list[1][1])
    #convert to square miles
    total_area = total_area*3.86102e-7
    return total_area


def get_pop(state_name):
    '''this is a method that gets the state population from its name using the census
    API'''
    #retrieve data from census database
    code = statesToCode[state_name] 
    url = 'http://api.census.gov/data/2016/pep/population?get=POP,GEONAME&for=state:' + code + '&key=' + apiKey
    page = requests.get(url)
    content_list = json.loads(page.content)
    population = int(content_list[1][0])
    return population

#######################end of State attribute functions###################

def get_employment(state_name):
    '''this is a method that gets the state emplyment rate from its name'''
    code = statesToCode[state_name]
    url = 'http://api.census.gov/data/bds/firms?get=emp&for=state:' + code + '&time=2014&key=' + apiKey
    page = requests.get(url)
    #print page.status_code
    content_list = json.loads(page.content)
    return content_list[1][0]
    




############################# Start execution #############################3
if __name__ == '__main__':
    '''run with key word "all" to re-make entire db, or specifify metrics'''
    print "Starting State population script..."
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mapsite.settings')
    import django
    django.setup()
    from map.models import State, Metric
    if len(sys.argv) < 2:
        raise SyntaxError("Insufficient arguments.")
    elif sys.argv[1].lower() == "all":
        populate()   
    else:
        for arg in sys.argv[1:]:
            print arg
