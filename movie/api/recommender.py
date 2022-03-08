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
    top_8_movies = sorted(list(enumerate(dist)),reverse=True,key=lambda x:x[1])[1:9]
    
    for i in top_8_movies:
        print(df.iloc[i[0]].title) #out of tupple we want index i.e 0th index
    return

def recommend_movies(likes):
    df=get_data()
    vector=movie_vector(df)
    matrix=get_similarity_matrix(vector)
    for x in likes:
        recommender(x['title'],matrix,df)
    return

    
#df=prepare_data()
#similarity_matrix=get_similarity_matrix()

    


    

