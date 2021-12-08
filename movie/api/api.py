from re import U
from sqlalchemy.sql.expression import false
from sqlalchemy.sql.functions import user
from db import Movie,app, User, db
from sqlalchemy import func
from flask import jsonify,request,json
from flask_jwt_extended import create_access_token
import bcrypt
import os

salt=bcrypt.gensalt()

def check_user(email):
    exists = db.session.query(User.user_Id).filter_by(email=email).first() is not None
    return exists



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

    password = request.json.get("password",None)
    
    #query db to see if a user id that has the passed email exists
    exists=check_user(email)
    print("User exists: ", exists)
    
    if exists==False:
        print("User does not exist")
        return jsonify({"msg": "An account with this email does not exist!"}), 401

    hash=db.session.query(User.password).filter_by(email=email).one()
    print("Hash: ", hash)

    #if given password does not match hash password on db then return error
    #password from front end has to be encoded because cryptographic functions only work on byte strings
    #running a SELECT returns a tuple, so hash[0] is needed because I only want the first element of the tuple
    if not bcrypt.checkpw(password.encode('utf-8'),hash[0]):
        print("Password is wrong")
        return jsonify({"msg": "Incorrect password!"}), 401
        
    #print("Salt",bcrypt.gensalt(12))

    access_token = create_access_token(identity=email)
    print("token: "+access_token)
    return jsonify(access_token=access_token)

@app.route('/register',methods=['POST'])
def register():
    print("In api.register()")

    #convert to python dictionary 
    request_data = json.loads(request.data)
    print("loaded json")
    
    print("Passed pw: ",request_data['password'])

    #Check if user exists
    exists = check_user(request_data['email'])

    #validation
    if exists:
        print("email already exists ")
        return jsonify({"msg": "User with this email already exists!"}), 401

    if not request_data['fname'] or not request_data['lname'] :
        return jsonify({"msg": "Name is not valid!"}), 401

    if not request_data['email'] :
        return jsonify({"msg": "Email is not valid!"}), 401

    if '@' not in request_data['email'] or '.com' not in request_data['email'] :
        return jsonify({"msg": "Email must contain an '@' sign!"}), 401

    if not request_data['password'] :
        return jsonify({"msg": "Password is not valid!"}), 401


    #find the latest user's id
    biggest_id=db.session.query(func.max(User.user_Id)).scalar()
    if biggest_id == None:
        biggest_id=-1

    #set the next id to be id+1
    id= biggest_id+1

    # Hash a password for the first time, with a randomly-generated salt
    hashed = bcrypt.hashpw(request_data['password'].encode('utf-8'), salt)
    print("Password hashed: ",hashed)

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
    