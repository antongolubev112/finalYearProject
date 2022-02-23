from re import U
from sqlalchemy.sql.expression import false
from sqlalchemy.sql.functions import user
from db import Movie, app, User, db, Likes
from sqlalchemy import func
from flask import jsonify,request,json
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt
import os
from queries import check_user,get_user_details,get_password,checkLikes,get_all_likes
from serializers import user_serializer, movie_serializer,like_serializer

#generate salt for bcrypt
salt=bcrypt.gensalt()

@app.route('/movies',methods=['GET'])
def index():
    #unpack
    return jsonify([*map(movie_serializer,Movie.query.all())])

# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@app.route('/token', methods=['POST'])
def create_auth_token():
    #get email from the request data
    email = request.json.get("email")

    #get password from the request data
    password = request.json.get("password",None)
    
    #query db to see if a user id that has the passed email exists
    exists=check_user(email)
    print("User exists: ", exists)
    
    if exists==False:
        print("User does not exist")
        return jsonify({"msg": "An account with this email does not exist!"}), 401

    user= get_user_details(email)
    
    #retrieve hash password from db
    hash=get_password(email)

    print("Hash: ", hash)

    #if given password does not match hash password on db then return error
    #password from front end has to be encoded because cryptographic functions only work on byte strings
    #running a SELECT returns a tuple, so hash[0] is needed because I only want the first element of the tuple
    if not bcrypt.checkpw(password.encode('utf-8'),hash[0]):
        print("Password is wrong")
        return jsonify({"msg": "Incorrect password!"}), 401
    

    #create access token
    access_token = create_access_token(identity=email)
    
    print("token: "+access_token)

    #serialize data into json format and append the access token onto it
    data=user_serializer(user,access_token)
    
    return jsonify(data)

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

    elif not request_data['fname'] or not request_data['lname'] :
        return jsonify({"msg": "Name is not valid!"}), 401

    elif not request_data['email'] or '@' not in request_data['email'] or '.com' not in request_data['email'] :
        return jsonify({"msg": "Email is not valid!"}), 401

    elif not request_data['password'] :
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

@app.route('/like',methods=['POST'])
#decorator states that you need a jwt token to access this api endpoint
@jwt_required()
def add_like():
    print("In api.like()")
    #convert to python dictionary 
    request_data = json.loads(request.data)
    print(request.headers)
    print(request_data)

    if request_data['id'] is None:
        return jsonify({"msg": "INVALID MOVIE"}), 401
    

    
    #Gets email of user from the jwt token from the payload of the token.
    #The email was specified as the identity when it was created
    email=get_jwt_identity()
    print("email :",email)

    #fetch user details using the email
    user=get_user_details(email)
    print("User id",user.user_Id)

    #if like already exists then return an error
    if checkLikes(request_data['id'],user.user_Id) :
        return jsonify({"msg": "Movie is already liked"}), 400

    request_data['keywords']=list(map(lambda x: json.dumps(x), request_data['keywords']))
    request_data['cast']=list(map(lambda x: json.dumps(x), request_data['cast']))
    request_data['crew']=list(map(lambda x: json.dumps(x), request_data['crew']))

    like=Likes(movieId=request_data['id'],
        title=request_data['title'],
        overview=request_data['overview'],
        keywords=request_data['keywords'],
        cast=request_data['cast'],
        crew=request_data['crew'],
        user_id=user.user_Id
    )

    db.session.add(like)
    db.session.commit()
    
    return{'201': 'added like successfully'}


@app.route('/movie/<int:id>')
def show_movie(id):
    #get movie from database based on id number
    print(id)
    return jsonify([*map(movie_serializer,Movie.query.filter_by(movieId=id))])

@app.route('/getLikes',methods=['POST'])
@jwt_required()
def get_likes():
    email=get_jwt_identity()
    user=get_user_details(email)
    likes=get_all_likes(user.user_Id)
    
    likes_list=[]

    for x in likes:
        likes_list.append(like_serializer(x))

    print(likes_list)
    return jsonify(likes_list)

if __name__=='__main__':
    app.run(debug=True)
    