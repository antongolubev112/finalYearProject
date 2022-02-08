from enum import unique
import os;
from flask import Flask,json,jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table, Column, Integer, String, MetaData, ForeignKey, Float, Date
from flask_jwt_extended import JWTManager

db_user=os.environ.get('DB_USER')
db_password=os.environ.get('DB_PASS')
app= Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://'+db_user+':pgadmin4@localhost/fyp'
engine='postgresql://'+db_user+':pgadmin4@localhost/fyp'
db=SQLAlchemy(app)

app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY')  
jwt = JWTManager(app)

#many to many bidirectional relationship
#junction table
movieGenre=db.Table('movieGenre',
    db.Column('movie_id',db.Integer, ForeignKey('movies.movieId')),
    db.Column('genre_id',db.Integer, ForeignKey('genre.genreId'))
)

class User(db.Model):
    __tablename__="users"
    user_Id=db.Column(db.Integer,unique=True, primary_key=True)
    fname=db.Column(db.String, nullable= False)
    lname=db.Column(db.String, nullable= False)
    email= db.Column(db.String, unique=True, nullable=False)
    password= db.Column(db.LargeBinary, nullable=False)

class Movie(db.Model):
    __tablename__="movies"
    movieId= db.Column(db.Integer, unique=True, primary_key=True)
    title= db.Column(db.String(100), unique=True, nullable=False)
    posterUrl= db.Column(db.String,unique=True, nullable=False)
    rtScore=db.Column(db.Float)
    imdbScore=db.Column(db.Float)
    rating=db.Column(db.String)
    runtime=db.Column(db.Integer)
    studio=db.Column(db.String, nullable=False)
    boxOffice=db.Column(db.String, nullable=False)
    releaseDate=db.Column(db.String(12), nullable=False)

    #define relationship/ link movies and genres
    genres = db.relationship(
        #Association with Genre table
        "Genre",
        #name of junction table
        secondary=movieGenre,
        #adds movies attribute to genres table
        backref=db.backref('movies'),
        lazy='dynamic')

    
    def __init__(self,movieId,title,posterUrl,rtScore,imdbScore,rating,runtime,studio,boxOffice,releaseDate):
        self.movieId=movieId
        self.title=title
        self.posterUrl=posterUrl
        self.rtScore=rtScore
        self.imdbScore=imdbScore
        self.rating=rating
        self.runtime=runtime
        self.studio=studio
        self.boxOffice=boxOffice
        self.releaseDate=releaseDate
        
        
 
class Genre(db.Model):
    __tablename__="genre"
    genreId=db.Column(db.Integer,unique=True, primary_key=True, nullable=False)
    name=db.Column(db.String, unique=True, nullable=False)

    def __init__(self,genreId,name):
        self.genreId=genreId
        self.name=name



if __name__=='__main__':
    app.run(debug=True)
    