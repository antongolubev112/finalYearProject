from db import Movie, app, User, db, Likes
from sqlalchemy import and_


def check_user(email):
    exists = db.session.query(User.user_Id).filter_by(
        email=email).first() is not None
    print(exists)
    return exists


def get_user_details(email):
    id = db.session.query(User.user_Id).filter_by(email=email).first()
    user = db.session.query(User).get(id)
    print(user)
    return user


def get_password(email):
    return db.session.query(User.password).filter_by(email=email).one()


def checkLikes(movie_id, user_id):
    exists = db.session.query(Likes.movieId).filter(
        (and_(
            user_id==user_id,
            movie_id==Likes.movieId
        )
        )
    ).first() is not None

    print("exists: ",exists)
    return exists


def get_all_likes(user_id):
    return Likes.query.filter_by(user_id=user_id).all()

def delete_like(id, user_id):
    Likes.query.filter(
        (and_(
            id==Likes.movieId,
            user_id==user_id)
        )
    ).delete()
    db.session.commit()
    return 200