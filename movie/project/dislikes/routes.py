from flask import Blueprint
dislikes= Blueprint('dislikes',__name__)

from flask import json,jsonify,request
from flask_jwt_extended import jwt_required, get_jwt_identity
from dislikes.utils import dislike_serializer
from models import Likes,Dislikes, Recommendations,db,User



@dislikes.route('/allDislikes',methods=['POST'])
@jwt_required()
def get_dislikes():
    print("in get dislikes")
    email=get_jwt_identity()
    user=User.get_user(email)
    dislikes=Dislikes.get_users_dislikes(user.user_id)
    
    dislikes_list=[]

    for x in dislikes:
        dislikes_list.append(dislike_serializer(x))
        
    print(dislikes_list)
    return jsonify(dislikes_list)

@dislikes.route('/dislike',methods=['POST'])
#decorator states that you need a jwt token to access this api endpoint
@jwt_required()
def dislike():
    print("In api.dislike()")

    #convert to python dictionary 
    request_data = json.loads(request.data)

    if request_data['movie_id'] is None:
        return jsonify({"msg": "INVALID MOVIE"}), 401
    
    #Gets email of user from the jwt token from the payload of the token.
    #The email was specified as the identity when it was created
    email=get_jwt_identity()

    #fetch user details using the email
    user=User.get_user(email)

    
    #if like already exists then unlike
    if Likes.exists(request_data['movie_id'],user.user_id) :
        Likes.delete(request_data['movie_id'],user.user_id)

    if Dislikes.exists(request_data['title'],user.user_id):
        Dislikes.delete_dislike(request_data['movie_id'],user.user_id)
        print("removed disliked")
        return {'201': 'removed dislike successfully'}

    if Recommendations.exists(request_data['title'],user.user_id):
        Recommendations.delete(user.user_id,request_data['title'])
        
    dislike=Dislikes(movie_id=request_data['movie_id'],
        title=request_data['title'],
        user_id=user.user_id
    )

    db.session.add(dislike)
    db.session.commit()

    print("added dislike")
    
    return{'201': 'added dislike successfully'}