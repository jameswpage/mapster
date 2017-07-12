import os 
import requests
from dicts import state_list, statesToCode


#API key provided by census bureau
apiKey = 'fc7d67bf8c0753b0f7311d3b72ce91efd37e4e26'


def populate():
    for state in state_list:
        area = get_area(state)
        pop = get_pop(state)
        emp = get_employment(state)
        code = statesToCode[state]
        s = State(state_code = code, state_name = state, population = pop, 
        size = area, employment = emp)
        s.save()
     

def get_area(state_name):
    '''this is a method that gets the state area from its name using the census
    API'''
    #retrieve data from censes database
    code = statesToCode[state_name] 
    url = 'http://api.census.gov/data/2000/sf1?get=AREALAND,AREAWATR&for=state:' + code + '&key=' + apiKey
    page = requests.get(url)
    content_string = page.content 
    content_list = make_list(content_string)
    total_area = int(content_list[1][0])+int(content_list[1][1])
    #convert to square miles
    total_area = total_area*3.86102e-7
    return total_area

def get_employment(state_name):
    '''this is a method that gets the state emplyment rate from its name'''
    code = statesToCode[state_name]
    url = 'http://api.census.gov/data/bds/firms?get=emp&for=state:' + code + '&time=2014&key=' + apiKey
    page = requests.get(url)
    #print page.status_code
    content_string = page.content 
    content_list = make_list(content_string)
    return content_list[1][0]
    
    
    
def get_pop(state_name):
    '''this is a method that gets the state population from its name using the census
    API'''
    #retrieve data from census database
    code = statesToCode[state_name] 
    url = 'http://api.census.gov/data/2016/pep/population?get=POP,GEONAME&for=state:' + code + '&key=' + apiKey
    page = requests.get(url)
    content_string = page.content
    
    #convert string to a list
    content_list = make_list(content_string)
    population = int(content_list[1][0])
    return population

def make_list(content_string):
    '''this is a method that returns a list from a string that resembles a list
    it uses basic stack-like algorithms
    I just realized that this is basically the same thing as json.loads for 
    lists'''
    #strip quotations from string
    content_string = content_string.replace("\"",'')
    #initialize list object
    content_list = []
    
    #two additional lists keep track of current list when traversing string
    working_list = content_list
    prev_list = working_list
    
    #4 trackers, pop and push store relevant indices, count is position of stack
    #and previous is the previous level of the stack
    pop = 0
    push = 0
    count = 0
    previous = 0
    #iterate accross string
    for index, char in enumerate(content_string):
        if char == "[":
            push = index
            if count > previous:
                working_list.append([])
                prev_list = working_list
                working_list = working_list[-1]
            previous = count
            count += 1
        if char == "]":
            if pop < push:
                pop = index
                working_list.append(content_string[push+1:pop].split(","))
            else:
                working_list = prev_list  
            previous = count
            count -= 1
    #return finalized list (algorithm adds 1 too many level of list)               
    return content_list[0]


# Start execution
if __name__ == '__main__':
    print "Starting State population script..."
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mapsite.settings')
    import django
    django.setup()
    from map.models import State
    populate()
