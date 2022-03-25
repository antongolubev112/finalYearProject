from flask import Blueprint,request,jsonify,json
users= Blueprint('users',__name__)
from db import db
from models import User
import bcrypt
from flask_jwt_extended import create_access_token
from auth.utils import user_serializer
from sqlalchemy import func

#generate salt for bcrypt
salt=bcrypt.gensalt()

@users.route('/token', methods=['POST'])
def create_auth_token():
    #get email from the request data
    email = request.json.get("email")

    #get password from the request data
    password = request.json.get("password",None)
    
    #query db to see if a user id that has the passed email exists
    exists=User.exists(email)
    print("User exists: ", exists)
    
    if exists==False:
        print("User does not exist")
        return jsonify({"msg": "An account with this email does not exist!"}), 401

    user= User.get_user(email)
    
    #retrieve hash password from db
    hash= User.get_password(email)

    print("Hash: ", hash)

    #if given password does not match hash password on db then return error
    #password from front end has to be encoded because cryptographic functions only work on byte strings
    #running a SELECT returns a tuple, so hash[0] is needed because I only want the first element of the tuple
    if not bcrypt.checkpw(password.encode('utf-8'),hash[0]):
        print("Password is wrong")
        return jsonify({"msg": "Incorrect password!"}), 401
    

    #create access token
    access_token = create_access_token(identity=email,expires_delta=False)
    
    print("token: "+access_token)

    #serialize data into json format and append the access token onto it
    data=user_serializer(user,access_token)
    
    return jsonify(data)

@users.route('/register',methods=['POST'])
def register():
    print("In api.register()")

    #convert request data to python dictionary 
    request_data = json.loads(request.data)
    print("loaded json")
    
    print("Passed pw: ",request_data['password'])

    #Check if user exists
    exists = User.exists(request_data['email'])

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
    biggest_id=db.session.query(func.max(User.user_id)).scalar()
    if biggest_id == None:
        biggest_id=-1

    #set the next id to be id+1
    id= biggest_id+1

    # Hash a password for the first time, with a randomly-generated salt
    hashed = bcrypt.hashpw(request_data['password'].encode('utf-8'), salt)
    print("Password hashed: ",hashed)

    print(request_data)
    
    #map the response from front end to user model
    user= User(user_id=id,
    fname=request_data['fname'],
    lname=request_data['lname'],
    email=request_data['email'],
    password=hashed)

    #push to database
    db.session.add(user)
    db.session.commit()

    return{'201': 'user created successfully'}
