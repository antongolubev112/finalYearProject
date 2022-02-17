from db import Movie,app, User, db

def check_user(email):
    exists = db.session.query(User.user_Id).filter_by(email=email).first() is not None
    print(exists)
    return exists

def get_user_details(email):
    id= db.session.query(User.user_Id).filter_by(email=email).first()
    user=db.session.query(User).get(id)
    print(user)
    return user

def get_password(email):
    return db.session.query(User.password).filter_by(email=email).one()