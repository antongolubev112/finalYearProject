from enum import unique
import os
from flask import Flask, json, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table, Column, Integer, String, MetaData, ForeignKey, Float, Date
from flask_jwt_extended import JWTManager
from sqlalchemy import and_,func
import pandas as pd
from db import db,engine


class User(db.Model):
    __tablename__ = "users"
    user_id = db.Column(db.Integer, unique=True, primary_key=True)
    fname = db.Column(db.String, nullable=False)
    lname = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.LargeBinary, nullable=False)

    likes = db.relationship("Likes", backref=db.backref("users"))
    recommendation = db.relationship(
        "Recommendations", backref=db.backref("users"))
    dislikes = db.relationship("Dislikes", backref=db.backref("users"))

    def __init__(self, user_id, fname, lname, email, password):
        self.user_id = user_id
        self.fname = fname
        self.lname = lname
        self.email = email
        self.password = password
    
    @staticmethod
    def get_user(email):
        id = db.session.query(User.user_id).filter_by(email=email).first()
        user = db.session.query(User).get(id)
        return user
    
    @staticmethod
    def exists(email):
        exists = db.session.query(User.user_id).filter_by(
            email=email).first() is not None
        print(exists)
        return exists

    @staticmethod
    def get_password(email):
        return db.session.query(User.password).filter_by(email=email).one()
    




class Likes(db.Model):
    __tablename__ = "likes"
    movie_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    genres = db.Column(db.String, nullable=False)
    overview = db.Column(db.String, nullable=False)
    keywords = db.Column(db.String, nullable=False)
    cast = db.Column(db.String, nullable=False)
    crew = db.Column(db.String, nullable=False)

    user_id = db.Column(db.Integer, ForeignKey('users.user_id'))

    def __init__(self, movie_id, title, genres, overview, keywords, cast, crew, user_id):
        self.movie_id = movie_id
        self.title = title
        self.genres = genres
        self.overview = overview
        self.keywords = keywords
        self.cast = cast
        self.crew = crew
        self.user_id = user_id

    @staticmethod
    def exists(movie_id, user_id):
        exists = db.session.query(Likes.movie_id).filter(
            (and_(
                user_id == user_id,
                movie_id == Likes.movie_id
            )
            )
        ).first() is not None

        print("exists: ", exists)
        return exists

    @staticmethod
    def delete(movie_id, user_id):
        like = Likes.query.filter(
            (and_(
                movie_id == Likes.movie_id,
                user_id == user_id)
             )
        )
        like.delete()
        db.session.commit()
        print("like deleted")
        return 200

    @staticmethod
    def get_users_likes(user_id):
        return Likes.query.filter_by(user_id=user_id).all()


class Dislikes(db.Model):
    __tablename__ = "dislikes"
    movie_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('users.user_id'))

    def __init__(self, movie_id, title, user_id):
        self.movie_id = movie_id
        self.title = title
        self.user_id = user_id

    @staticmethod
    def exists(title, user_id):
        exists = db.session.query(Dislikes.movie_id).filter(
            (and_(
                title == Dislikes.title,
                user_id == Dislikes.user_id
            )
            )
        ).first() is not None
        print("dislike ", title, " exists: ", exists)
        return exists

    @staticmethod
    def delete_dislike(movie_id, user_id):
        Dislikes.query.filter(
            (and_(
                movie_id == Dislikes.movie_id,
                user_id == user_id)
             )
        ).delete()
        db.session.commit()
        return 200
    
    @staticmethod
    def get_users_dislikes(user_id):
        return Dislikes.query.filter_by(user_id=user_id).all()


class Data(db.Model):
    __tablename__ = "data_for_model"
    movie_id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String, primary_key=True)
    tags = db.Column(db.String, primary_key=True)

    def __init__(self, movie_id, title, tags):
        self.movie_id = movie_id
        self.title = title
        self.tags = tags

    @staticmethod
    def exists(id):
        id=str(id)
        exists = db.session.query(Data.movie_id).filter_by(
            movie_id=id).first() is not None
        print("Movie is in the dataframe: ",exists)
        return exists

    @staticmethod
    def get_data():
        return pd.read_sql("data_for_model", engine)
    

class Recommendations(db.Model):
    __tablename__ = "recommendations"
    movie_id = db.Column(db.Integer, unique=True, primary_key=True)
    title = db.Column(db.String, nullable=False)
    og_movie = db.Column(db.String, nullable=False)

    user_id = db.Column(db.Integer, ForeignKey('users.user_id'))

    def __init__(self, movie_id, title, og_movie, user_id):
        self.movie_id = movie_id
        self.title = title
        self.og_movie = og_movie,
        self.user_id = user_id

    @staticmethod
    def exists(title, user_id):
        exists = db.session.query(Recommendations.movie_id).filter(
            (and_(
                title == Recommendations.title,
                user_id == Recommendations.user_id
            )
            )
        ).first() is not None
        print("recommendation ", title, " exists: ", exists)
        return exists

    staticmethod
    def get_users_recommendations(user_id):
        return Recommendations.query.filter_by(user_id=user_id).all()


    @staticmethod
    def delete(user_id,title):
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
    
    @staticmethod
    def delete_by_original_movie(user_id,og_movie):
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

    @staticmethod
    def original_movie_exists(like,user_id):
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

    @staticmethod
    def get_biggest_id():
        biggest_id=db.session.query(func.max(Recommendations.movie_id)).scalar()
        return biggest_id


#if __name__ == '__main__':
    #app.run(debug=True)
