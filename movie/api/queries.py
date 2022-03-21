from db import Movie, app, User, db, Likes, Data,engine,Recommendations
from sqlalchemy import and_,func
import pandas as pd



def check_user(email):
    exists = db.session.query(User.user_Id).filter_by(
        email=email).first() is not None
    print(exists)
    return exists


def get_user_details(email):
    id = db.session.query(User.user_Id).filter_by(email=email).first()
    user = db.session.query(User).get(id)
    print(user)
    return user


def get_password(email):
    return db.session.query(User.password).filter_by(email=email).one()


def check_likes(movie_id, user_id):
    exists = db.session.query(Likes.movieId).filter(
        (and_(
            user_id==user_id,
            movie_id==Likes.movieId
        )
        )
    ).first() is not None

    print("exists: ",exists)
    return exists

def check_rec(title,user_id):
    exists=db.session.query(Recommendations.title).filter(
        (and_(
            title==title,
            user_id==user_id
        ))
    ).first() is not None
    return exists

def get_data():
    return pd.read_sql("data_for_model", engine)

def check_df(id):
    id=str(id)
    exists = db.session.query(Data.movie_id).filter_by(
        movie_id=id).first() is not None
    print("Movie is in the dataframe: ",exists)
    return exists

def get_all_likes(user_id):
    return Likes.query.filter_by(user_id=user_id).all()

def get_all_recommendations(user_id):
    return Recommendations.query.filter_by(user_id=user_id).all()

def delete_like(id, user_id):
    Likes.query.filter(
        (and_(
            id==Likes.movieId,
            user_id==user_id)
        )
    ).delete()
    db.session.commit()
    return 200

def get_rec_id():
    biggest_id=db.session.query(func.max(Recommendations.movie_id)).scalar()
    return biggest_id
#def check_recommendation()
