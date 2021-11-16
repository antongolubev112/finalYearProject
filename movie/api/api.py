from enum import unique
import os;
from flask import Flask,json,request
from flask_sqlalchemy import SQLAlchemy
from flask import jsonify
from sqlalchemy import Table, Column, Integer, String, MetaData

db_user=os.environ.get('DB_USER')
db_password=os.environ.get('DB_PASS')
app= Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://'+db_user+':pgadmin4@localhost/flaskMovie'
db=SQLAlchemy(app)

class Movie(db.Model):
    __tablename__="movies"
    id= db.Column(db.Integer, unique=True, primary_key=True)
    title= db.Column(db.String(100), unique=True, nullable=False)
    image= db.Column(db.String,unique=True, nullable=False)
    overview=db.Column(db.String, nullable=False)
    genre=db.Column(db.String(120), unique=True, nullable=False)
    releaseDate=db.Column(db.String(12), nullable=False)
    runtime=db.Column(db.Integer)
    rating=db.Column(db.Float)
    
    def __init__(self,id,title,image,overview,genre,releaseDate,runtime,rating):
        self.id=id
        self.title=title
        self.image=image
        self.overview=overview
        self.genre=genre
        self.releaseDate=releaseDate
        self.runtime=runtime
        self.rating=rating
 

def todo_serializer(todo):
        return{
            'id':todo.id,
            'content':todo.content
        }

if __name__=='__main__':
    app.run(debug=True)
    