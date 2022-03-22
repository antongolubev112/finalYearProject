import numpy as np 
import pandas as pd
import ast
import os
from flask import json
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from queries import get_data
cv = CountVectorizer(stop_words='english')

def movie_vector(df):
    return cv.fit_transform(df['tags']).toarray()

def get_similarity_matrix(vector):
    return cosine_similarity(vector)

# recommender function which will return 8 similar movies based on given input movie
def recommender(liked_movie,similarity_matrix,df):
    mov_indx = df[df['title']==liked_movie].index[0] #getting index of given movie
    dist = similarity_matrix[mov_indx] #passing movie index to similarity matrix
    similar_movies = sorted(list(enumerate(dist)),reverse=True,key=lambda x:x[1])[1:5]

    #array to return
    likes=[]
    
    #get top 8 most similar movies
    for i in similar_movies:
        likes.append(df.iloc[i[0]].title)
        print(df.iloc[i[0]].title) #out of tupple we want index i.e 0th index

    return likes

def recommend_movies(likes):
    df=get_data()
    vector=movie_vector(df)
    #print(vector)
    matrix=get_similarity_matrix(vector)

    #make a dictionary
    recs=dict()
    for x in likes:
        #store the original movie as the key and the recommendations as the values
        recs.setdefault(x['title'],(recommender(x['title'],matrix,df)))
        
    return recs

    
#df=prepare_data()
#similarity_matrix=get_similarity_matrix()

    


    

