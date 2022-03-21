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
        'movie_id':like.movieId,
        'title':like.title,
    }

def like_serializer(like):
    return{
        'id':like.movieId,
    }

def recommendation_serializer(recommendation):
    return{
        'recommendation':recommendation.title,
        'og_movie':recommendation.og_movie
    }