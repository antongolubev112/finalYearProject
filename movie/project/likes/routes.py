from flask import Blueprint
likes= Blueprint('likes',__name__)

from flask import jsonify,request,json
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Likes,Dislikes, Recommendations,db,User,Data
from likes.prepare_like import push_like_to_data
from likes.utils import like_serializer





@likes.route('/like',methods=['POST'])
#decorator states that you need a jwt token to access this api endpoint
@jwt_required()
def add_like():
    print("In api.like()")
    #convert to python dictionary 
    request_data = json.loads(request.data)
    #print(request.headers)
    #print(request_data)

    if request_data['movie_id'] is None:
        return jsonify({"msg": "INVALID MOVIE"}), 401
    
    #Gets email of user from the jwt token from the payload of the token.
    #The email was specified as the identity when it was created
    email=get_jwt_identity()
    print("email :",email)

    #fetch user details using the email
    user=User.get_user(email)
    print("User id",user.user_id)

    #if like already exists then unlike
    if Likes.exists(request_data['movie_id'],user.user_id) :
        Likes.delete(request_data['movie_id'],user.user_id)
        Recommendations.delete_by_original_movie(user.user_id,request_data['title'])
        return jsonify({"msg": "Movie unliked"}), 200

    request_data['keywords']=json.dumps(request_data['keywords'])
    request_data['cast']=json.dumps(request_data['cast'])
    request_data['crew']=json.dumps(request_data['crew'])
    request_data['genres']=json.dumps(request_data['genres'])

    like=Likes(movie_id=request_data['movie_id'],
        title=request_data['title'],
        genres=request_data['genres'],
        overview=request_data['overview'],
        keywords=request_data['keywords'],
        cast=request_data['cast'],
        crew=request_data['crew'],
        user_id=user.user_id
    )

    #add the users like to the dataframe on the database
    if not Data.exists(request_data['movie_id']):
        push_like_to_data(request_data)


    db.session.add(like)
    db.session.commit()
    
    return{'201': 'added like successfully'}

@likes.route('/getLikes',methods=['POST'])
@jwt_required()
def get_likes():
    email=get_jwt_identity()
    user=User.get_user(email)
    likes=Likes.get_users_likes(user.user_id)
    
    likes_list=[]

    for x in likes:
        likes_list.append(like_serializer(x))
        
    print(likes_list)
    return jsonify(likes_list)