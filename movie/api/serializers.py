
#serialize user into json format and append a the token
def user_serializer(user,token):
    return{
        'fname':user.fname,
        'lname':user.lname,
        'email':user.email,
        'token':token
    }

def recommender_serializer(like):
    return{
        'movie_id':like.movie_id,
        'title':like.title,
    }

def like_serializer(like):
    return{
        'id':like.movie_id,
    }

def recommendation_serializer(recommendation):
    return{
        'recommendation':recommendation.title,
        'og_movie':recommendation.og_movie
    }