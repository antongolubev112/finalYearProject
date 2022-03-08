import numpy as np 
import pandas as pd
import ast
import os
from flask import json
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from db import engine

def prepare_likes(dict):
    #turn likes into dict
    if "genres" in dict:
      print("this will execute")

    print("type of dict is: ",type(dict))
    print("type of dict['genres'] is: ",type(dict['genres']))
    print("type of dict['cast'] is: ",type(dict['cast']))
    #print("dict[genres] : ",dict['genres'])
    #print("dict[cast] : ",dict['cast'])
    
    #dict['genres']=json.dumps(dict['genres'])
    #dict['genres']=ast.literal_eval(dict['genres'])

    #extract genres and keywords from python dictionary
    dict['genres'] = convert(dict['genres'])
    print("converted dict[genres] : ",dict['genres'])
    dict['keywords'] = convert(dict['keywords'])
    print("converted dict['keywords'] : ",dict['keywords'])

    #extract names of actors from cast 
    dict['cast'] = convert_like_cast(dict['cast'])
    print("converted dict['cast'] : ",dict['cast'])

    #extract names of director and sound designer fromn cast column
    dict['crew'] = convert_like_crew(dict['crew'])
    print("converted dict['crew'] : ",dict['crew'])
    
    #remove spaces between words from data
    dict['genres'] = remove_space(dict['genres'])
    dict['keywords'] = remove_space(dict['keywords'])
    dict['cast'] = remove_space(dict['cast'])
    dict['crew'] = remove_space(dict['crew'])

    print(dict['overview'])
    #turn str into dict
    dict['overview'] = dict['overview'].split()
    print(dict['overview'])
    
    print("type of dict is: ",type(dict))
    print("type of dict['genres'] is: ",type(dict['genres']))
    print("type of dict['cast'] is: ",type(dict['cast']))
    print("type of dict['keywords'] is: ",type(dict['keywords']))
    print("type of dict['crew'] is: ",type(dict['crew']))
    print("type of dict['overview'] is: ",type(dict['overview']))
    print(dict['overview'])
    
    dict['tags'] = dict['overview'] + dict['genres'] + dict['keywords'] + dict['cast'] + dict['crew']
    keys=['movie_id','title','tags']
    #merge dictionaries into one dictionary
    df={x:dict[x] for x in keys}
    print(df)
    print("df['tags'] type: ",type(df['tags']))

    df['tags'] = " ".join(str(e) for e in df['tags'])
    print("df['tags'] type: ",type(df['tags']))

     #set all values in the tags column to lowercase
    df['tags'] =df['tags'].lower()
    print("df['tags'] type: ",type(df['tags']))

    df['tags']= stem(df['tags'])

    print("df type: ",type(df))

    return df 

def convert(string):
    lst = []
    for i in json.loads(string):
        #print(i)
        #extracts value of 'name' from dataset column
        lst.append(i['name']) 
    return lst

def convert_like_crew(string):
    crew = []
    counter = 0
    for i in json.loads(string):
        if i['job'] == 'Director':
            crew.append(i['name'])
        counter+=1
    return crew 

def convert_like_cast(string):
    cast = []
    counter = 0
    for i in json.loads(string):
        if counter < 5:
            cast.append(i['name'])
        counter+=1
    return cast 
 
'''
remove spaces between words from data. this has to be done to increase accuracy. 
if a movie the actor 'Johnny Depp' in it, and another movie has an actor 'Johnny X'
then the algorithm will be thrown off by this similarity.
'''
def remove_space(string):
    lst = []
    for i in string:
        lst.append(i.replace(" ",""))
    return lst

def stem(txt):
    pos = PorterStemmer()
    lst = []
    for i in txt.split():
        lst.append(pos.stem(i))
    #conv lst to str
    return " ".join(lst)


def push_like_to_data(likes):
    #convert dict to pandas dataframe
    dict=prepare_likes(likes)
    df=pd.DataFrame.from_records(dict,index=[0])
    df.to_sql("data_for_model", con=engine, if_exists='append', index=False)

    return