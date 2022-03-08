from db import Movie, app, User, db, Likes, Data,engine
from sqlalchemy import and_
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


def checkLikes(movie_id, user_id):
    exists = db.session.query(Likes.movieId).filter(
        (and_(
            user_id==user_id,
            movie_id==Likes.movieId
        )
        )
    ).first() is not None

    print("exists: ",exists)
    return exists

def get_data():
    return pd.read_sql("data_for_model", engine)

def check_df(id):
    exists = db.session.query(Data.movie_id).filter_by(
        movie_id=id).first() is not None
    print("Movie is in the dataframe: ",exists)
    return exists

def get_all_likes(user_id):
    return Likes.query.filter_by(user_id=user_id).all()

def delete_like(id, user_id):
    Likes.query.filter(
        (and_(
            id==Likes.movieId,
            user_id==user_id)
        )
    ).delete()
    db.session.commit()
    return 200