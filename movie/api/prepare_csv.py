import numpy as np 
import pandas as pd
import ast
import os
from flask import json
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from db import Data, app,db ,engine


path="./tmdb_5000_"
movies = pd.read_csv(path+'movies.csv')
credits = pd.read_csv(path+'credits.csv')


def prepare_data():
    global movies,credits
    #merge movies
    movies = movies.merge(credits,on='title')

    #specify relevant columns
    movies = movies[['movie_id','title','overview','genres','keywords','cast','crew']]
    
    #drop rows with null values
    movies.dropna(inplace=True)

    #converts keywords object into a dictionary
    ast.literal_eval(movies['keywords'][0])
    	
    print("working....")
    #extract genres and keywords from python dictionary
    movies['genres'] = movies['genres'].apply(convert)
    movies['keywords'] = movies['keywords'].apply(convert)  

    print("working 2....")
    #extract names of actors from cast column
    movies['cast'] = movies['cast'].apply(convert_cast)

    print("working 3....")
    #extract names of director and sound designer fromn cast column
    movies['crew'] = movies['crew'].apply(convert_crew)
    
    print("working 4....")
    #remove spaces between words from data
    movies['genres'] = movies['genres'].apply(remove_space)
    movies['keywords'] = movies['keywords'].apply(remove_space)
    movies['cast'] = movies['cast'].apply(remove_space)
    movies['crew'] = movies['crew'].apply(remove_space)

    print("working 5....")
    #in order to append the overview column, which is a string, to the rest of the relevant columns which are lists, 
    #I have to change it into a list
    movies['overview'] = movies['overview'].apply(lambda x:x.split())

    print("working 6....")
    #merge all columns into one for easier conversion 
    movies['tags'] = movies['overview'] + movies['genres'] + movies['keywords'] + movies['cast'] + movies['crew']
    df = movies[['movie_id','title','tags']]
    
    #change tags into a string
    df['tags'] = df['tags'].apply(lambda x: " ".join(x))
    
    #set all values in the tags column to lowercase
    df['tags'] = df['tags'].apply(lambda x:x.lower())

    df['tags']= df['tags'].apply(stem)

    return df

def convert(string):
    lst = []
    for i in ast.literal_eval(string):
        #print(i)
        #extracts value of 'name' from dataset column
        lst.append(i['name']) 
    return lst

#extract names of actors from cast column
def convert_cast(string):
    cast = []
    counter = 0
    for i in ast.literal_eval(string):
        if counter < 5:
            cast.append(i['name'])
        counter+=1
    return cast 

def convert_crew(string):
    crew = []
    for i in ast.literal_eval(string):
        if i['job'] == 'Director':
            crew.append(i['name'])
    return crew 

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

def push_to_db():
    df=prepare_data()
    
    df.to_sql("data_for_model", con=engine, if_exists='append', index=False)


    return

if __name__=='__main__':
    push_to_db()
    print("finished")

