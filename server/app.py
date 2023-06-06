#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session, abort, jsonify
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import create_app
app, db, api = create_app()
from models import User, Character, JobStats, Monster, MonsterStats, Inventory

# Views go here!

class SignUp(Resource):

    def post(self):
        data = request.get_json()
        try:
            new_user = User(
                fname=data['fname'],
                lname=data['lname'],
                username=data['username'],
                email=data['email'],
                dob=data['dob'],
                password=data['password']
            )
            db.session.add(new_user)
            db.session.commit()

            session['user_id'] = new_user.id

            response_dict = new_user.to_dict()
            response = jsonify(response_dict)
            response.status_code = 201
            return response
        
        except ValueError as e:
            abort(422, e.args[0])
        except IntegrityError as e:
            db.session.rollback()
            abort(422, "Email already exists.")

api.add_resource(SignUp, '/signup')

class Login(Resource):

    def post(self):
        data = request.get_json()
        check_user = User.query.filter(User.username == data['username']).first()

        if check_user and check_user.authenticate(data['password']):
            session['user_id'] = check_user.id
            return make_response(check_user.to_dict(), 200)
        return {'error': 'Unauthorized'}, 401
    
api.add_resource(Login, '/login')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None 
        response = make_response('',204)
        return response
    
api.add_resource(Logout, '/logout')

class AuthorizedSession(Resource):

    def get(self):
        try:
            user = User.query.filter_by(id=session['user_id']).first()
            response = make_response(
                user.to_dict(),
                200
            )
            return response
        except:
            abort(401, "Unauthorized")

api.add_resource(AuthorizedSession, '/authorized')

class CharacterCreation(Resource):

    def post(self):
        data = request.get_json()
        
        new_character = Character(
            character_name=data['character_name'],
            pronouns=data['pronouns'],
            sex=data['sex'],
            job_stats_id=data['job_stats_id'],
            region=data['region']        )
        db.session.add(new_character)
        db.session.commit()

        response_dict = new_character.to_dict()
        response = make_response(
            response_dict,
            201
        )
        return response

api.add_resource(CharacterCreation, '/new_character')

class CharacterByID(Resource):

    def patch(self, id):
        character = Character.query.filter_by(id=id).first()
        data = request.get_json()

        for attr in data:
            setattr(character, attr, data[attr])
    
        try:
            db.session.add(character)
            db.session.commit()
        except ValueError as e:
            abort(422, e.args[0])

    def delete(self, id):
        character = Character.query.filter_by(id=id).first()

        db.session.delete(character)
        db.session.commit()



api.add_resource(CharacterByID, '/new_character/<int:id>')

class Characters(Resource):

    def get(self):
        character = [c.to_dict(rules=('job_stats', '-job_stats.character', '-user')) for c in Character.query.all()]
        return make_response(jsonify(character), 200)

api.add_resource(Characters, '/character')

class LoadFile(Resource):

    def post(self):
        data = request.get_json()
        check_load_file = Character.query.filter(Character.id == data['id']).first()

        if check_load_file:
            session['character_id'] = check_load_file.id
            return make_response(check_load_file.to_dict(), 200)
        return {'error': 'Unauthorized'}, 401

api.add_resource(LoadFile, '/load_file')


class JobStatistics(Resource):

    def get(self):
        job_stat = [j.to_dict() for j in JobStats.query.all()]
        return make_response(jsonify(job_stat), 200)
    
api.add_resource(JobStatistics, '/job_stats')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
