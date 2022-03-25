from flask import Blueprint,jsonify
rec= Blueprint('recommendations',__name__)
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Likes,Dislikes, Recommendations,db,User
from recommendations.utils import recommendation_serializer, recommender_serializer
from recommendations.recommender import recommend_movies




@rec.route('/recommend',methods=['POST'])
@jwt_required()
def recommend():
    email=get_jwt_identity()
    user=User.get_user(email)
    likes=Likes.get_users_likes(user.user_id)

    likes_list=[]

    #loop through the list of likes, and check if every movie in that list has recommendations 
    # if not, add it to the array to send to the recommender
    for x in likes:
        if not Recommendations.original_movie_exists(x,user.user_id):
            likes_list.append(recommender_serializer(x))
        else:
            continue
    
    print("list of likes to send to algorithm:",likes_list)
    if len(likes_list)>0:
        recommendations=recommend_movies(likes_list)
    else:
        return show_recommendations()
    print("recs:", recommendations)

    #find the latest recommendations id
    biggest_id=Recommendations.get_biggest_id()

    if biggest_id == None:
        biggest_id=-1

    #cast to int
    biggest_id=int(biggest_id)
    print("biggest id:",biggest_id)
    
    #set the next id to be id+1
    id= biggest_id+1

    #extract key and value from dictionary
    for original,recommended in recommendations.items():
        print("og: ",original)
        print("recommendation: ", recommended)

        #remove duplicates if there are any
        #turns list into dictionary which cannot have duplicates, then turns it back into a list
        recommended=list(dict.fromkeys(recommended))
        #loop over recommendations list
        for i in recommended:
            #if i isn't already in the recommendation table
            if not Recommendations.exists(i,user.user_id):
                #if i isn't a disliked movie
                if not Dislikes.exists(i,user.user_id):
                    movie_rec=Recommendations(movie_id=id,title=i,og_movie=original,user_id=user.user_id)
                    id+=1
                    db.session.add(movie_rec)
                    db.session.commit()
                    print("pushed recommendation to db")

    return show_recommendations()

@rec.route('/recommendations',methods=['POST'])
@jwt_required()
def show_recommendations():
    print("In /recommendations")
    email=get_jwt_identity()
    user=User.get_user(email)
    recommendations=Recommendations.get_users_recommendations(user.user_id)

    recommendations_list=[]

    for x in recommendations:
        recommendations_list.append(recommendation_serializer(x))

    print(recommendations_list)
    return jsonify(recommendations_list)