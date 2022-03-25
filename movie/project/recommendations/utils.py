def recommender_serializer(like):
    return{
        'movie_id':like.movie_id,
        'title':like.title,
    }

def recommendation_serializer(recommendation):
    return{
        'recommendation':recommendation.title,
        'og_movie':recommendation.og_movie
    }

