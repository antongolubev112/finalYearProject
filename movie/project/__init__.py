import os
from db import app
from flask import Flask, json, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager


def create_app():  
    from auth.routes import users
    from likes.routes import likes
    from dislikes.routes import dislikes
    from recommendations.routes import rec

    app.register_blueprint(users)
    app.register_blueprint(likes)
    
    app.register_blueprint(rec)
    app.register_blueprint(dislikes)

    #db.create_all()

    return app

if __name__ == '__main__':
    app=create_app()
    app.run(debug=True)

