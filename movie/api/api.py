from db import Movie,app
from flask import jsonify,request
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

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
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email != "test" or password != "test":
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)

if __name__=='__main__':
    app.run(debug=True)
    