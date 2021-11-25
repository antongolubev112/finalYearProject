import pandas as pd
import numpy as np
import csv

input = pd.read_csv('output.csv')
output=pd.read_csv('output2.csv')

def add_id():
    input.insert(0, 'id', range(0, 0 + len(input)))
    input.to_csv('output2.csv', index=False)

def remove_nan():
    #remove nan
    input['Genre_1'] = output.fillna("No Genre", inplace = True)
    input['Genre_2'] = output.fillna("No Genre", inplace = True)
    input['Genre_3'] = output.fillna("No Genre", inplace = True)


def unique_genre():
    #unique genres from csv
    x=(np.unique(output[['Genre_1', 'Genre_2','Genre_3']].values))
    #turn to a list
    genres=x.tolist()
    print(genres)

    #turn to a dict
    dict = {'genre': genres}
    df= pd.DataFrame(dict) 
    
    # saving the dataframe 
    df.to_csv('genres.csv') 

add_id()
#remove_nan()
#unique_genre()