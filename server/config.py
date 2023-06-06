# Standard library imports
import os

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# Local imports

# Instantiate app, set attributes
def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = 'yjekwsjrfy826592grhkljsdghfkuseygioebfoliwecvrg33p948576cnloutqovn'
    app.json.compact = False

    # Define metadata, instantiate db
    metadata = MetaData(naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    })
    db = SQLAlchemy(metadata=metadata)
    migrate = Migrate(app, db)
    db.init_app(app)

    # Instantiate REST API
    api = Api(app)

    # Instantiate CORS
    CORS(app)

    # Store db, api, and migrate as attributes of the app object
    app.db = db
    app.api = api
    app.migrate = migrate

    return app

