from db import db 
import pandas as pd

def loadCsv():
    engine = db.get_engine()  # db is the one from the question
    csv_file_path = './data/genres.csv'

    # Read CSV with Pandas
    with open(csv_file_path, 'r') as file:
        df = pd.read_csv(file)

    # Insert to DB
    df.to_sql('genre',
            con=engine,
            index=False,
            index_label='id',
            if_exists='append')

#def createRelationship():


if __name__=='__main__':
    loadCsv()
