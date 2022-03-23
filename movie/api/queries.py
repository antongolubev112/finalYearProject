from multiprocessing import synchronize
from re import L
from db import app, User, db, Likes, Data,engine,Recommendations, Dislikes
from sqlalchemy import and_,func
import pandas as pd



def check_user(email):
    exists = db.session.query(User.user_id).filter_by(
        email=email).first() is not None
    print(exists)
    return exists


def get_user_details(email):
    id = db.session.query(User.user_id).filter_by(email=email).first()
    user = db.session.query(User).get(id)
    print(user)
    return user


def get_password(email):
    return db.session.query(User.password).filter_by(email=email).one()


def check_likes(movie_id, user_id):
    exists = db.session.query(Likes.movie_id).filter(
        (and_(
            user_id==user_id,
            movie_id==Likes.movie_id
        )
        )
    ).first() is not None

    print("exists: ",exists)
    return exists

def check_rec(title,user_id):
    exists=db.session.query(Recommendations.movie_id).filter(
        (and_(
            title==Recommendations.title,
            user_id==Recommendations.user_id
        )
        )
    ).first() is not None
    print("recommendation ",title," exists: ",exists)
    return exists

def check_dislikes(title,user_id):
    exists=db.session.query(Dislikes.movie_id).filter(
        (and_(
            title==Dislikes.title,
            user_id==Dislikes.user_id
        )
        )
    ).first() is not None
    print("dislike ",title," exists: ",exists)
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

def get_all_dislikes(user_id):
    return Dislikes.query.filter_by(user_id=user_id).all()

def get_all_recommendations(user_id):
    return Recommendations.query.filter_by(user_id=user_id).all()

def delete_like(id, user_id):
    like=Likes.query.filter(
        (and_(
            id==Likes.movie_id,
            user_id==user_id)
        )
    )
    like.delete()
    db.session.commit()
    print("like deleted")
    return 200

def delete_dislike(id, user_id):
    Dislikes.query.filter(
        (and_(
            id==Dislikes.movie_id,
            user_id==user_id)
        )
    ).delete()
    db.session.commit()
    return 200

def delete_recommendations_by_og_movie(user_id,og_movie):
    recs=db.session.query(Recommendations).filter(
        (and_(
            og_movie==Recommendations.og_movie,
            user_id==Recommendations.user_id
        )
        )
    ).delete()
    print(recs)
    db.session.commit()
    print("deleted")
    return

def delete_recommendations(user_id,title):
    recs=db.session.query(Recommendations).filter(
        (and_(
            title==Recommendations.title,
            user_id==Recommendations.user_id
        )
        )
    ).delete()
    print("in delete recs, recs are:",recs)
    db.session.commit()
    print("deleted")
    return

def get_rec_id():
    biggest_id=db.session.query(func.max(Recommendations.movie_id)).scalar()
    return biggest_id

def compare_likes_to_recs(like,user_id):
    title=like.title
    exists=db.session.query(Recommendations.movie_id).filter(
        (and_(
            title==Recommendations.og_movie,
            user_id==Recommendations.user_id
        )
        )
    ).first() is not None
    print("recommendations for ",title," exist: ",exists)
    return exists
#def check_recommendation()
