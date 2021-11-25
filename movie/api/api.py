from db import Movie,app
from flask import jsonify

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


if __name__=='__main__':
    app.run(debug=True)
    