from flask_sqlalchemy import SQLAlchemy
import os
from flask import Flask
from flask_jwt_extended import JWTManager

db_user = os.environ.get('DB_USER')
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://' + \
    db_user+':pgadmin4@localhost/recommend'

engine = 'postgresql://'+db_user+':pgadmin4@localhost/recommend'
db = SQLAlchemy(app)

app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY')
jwt = JWTManager(app)


