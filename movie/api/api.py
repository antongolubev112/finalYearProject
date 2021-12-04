from re import U
from sqlalchemy.sql.functions import user
from db import Movie,app, User, db
from sqlalchemy import func
from flask import jsonify,request,json
from flask_jwt_extended import create_access_token
import bcrypt


def movie_serializer(movie):
        return{
            'id':movie.movieId,
            'title':movie.title,
            'posterUrl':movie.posterUrl,
            'rtScore':movie.rtScore,
            'imdbScore':movie.imdbScore,
            'rating':movie.rating,
            'runtime':movie.runtime,
            'studio':movie.studio,
            'boxOffice':movie.boxOffice,
            'releaseDate':movie.releaseDate
        }

@app.route('/movies',methods=['GET'])
def index():
    #unpack
    return jsonify([*map(movie_serializer,Movie.query.all())])

# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@app.route('/token', methods=['POST'])
def create_auth_token():
    email = request.json.get("email")
    password = request.json.get("password")
    if email != "test" or password != "test":
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)

@app.route('/register',methods=['POST'])
def register():

    print("In api.register()")
    #convert to python dictionary 
    request_data = json.loads(request.data)
    print("loaded json")
    
    #find the last user id
    biggest_id=db.session.query(func.max(User.user_Id)).scalar()
    if biggest_id == None:
        biggest_id=-1

    #set the next id to be id+1
    id= biggest_id+1

    # Hash a password for the first time, with a randomly-generated salt
    hashed = bcrypt.hashpw(request_data['password'].encode('utf-8'), bcrypt.gensalt(12))
    print("Password hashed")

    print(request_data)
    
    #map the response from front end to user model
    user= User(user_Id=id,
    fname=request_data['fname'],
    lname=request_data['lname'],
    email=request_data['email'],
    password=hashed)

    #push to database
    db.session.add(user)
    db.session.commit()

    return{'201': 'user created successfully'}

@app.route('/movie/<int:id>')
def show_movie(id):
    #get movie from database based on id number
    print(id)
    return jsonify([*map(movie_serializer,Movie.query.filter_by(movieId=id))])

if __name__=='__main__':
    app.run(debug=True)
    