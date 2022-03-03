import numpy as np 
import pandas as pd
import ast
import os

def read_file():
    path="./tmdb_5000_"
    movies = pd.read_csv(path+'movies.csv')
    credits = pd.read_csv(path+'credits.csv')

    print(movies.sample(7))
    return

if __name__=='__main__':
    read_file()
    

