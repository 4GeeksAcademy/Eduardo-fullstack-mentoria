"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "test"
    }
    return jsonify(response_body), 200


@api.route('/signup', methods=["POST"])
def handle_signup():
    response = {}
    data = request.json
    required_keys = ["email", "username", "password"]
    for key in required_keys:
        if key not in data or not data[key]:
            response["message"] = f"error, {key} is missing"
            return jsonify(response), 400
    procesed_email = data["email"].strip().lower()
    
    # Hashear la contraseña antes de guardar
    hashed_password = bcrypt.hashpw( # Funcion del propio bcrypt
                        data["password"].encode("utf-8"), # Primer argumento es la contraseña
                        bcrypt.gensalt() # Segundo argumento es el salt generado por bcrypt
                      ).decode("utf-8") # Decodificar a utf-8 para almacenar como string
    """
    Le estamos metiendo la contraseña "test123",
    Despues la encodeamos en utf-8 para que bcrypt pueda procesarla,
    Despues le añadimos la salt generada por bcrypt,
    Y finalmente decodificamos el resultado a utf-8 para almacenarlo como string.
    """
    new_user = User(
        email=procesed_email,
        username=data["username"],
        password=hashed_password, # Almacenamos la contraseña hasheada
        is_active=True
    )
    db.session.add(new_user)
    db.session.commit()
    response["message"] = "User created successfully"
    response["user"] = {
        "id": new_user.id,
        "email": new_user.email,
        "username": new_user.username,
        "is_active": new_user.is_active
    }
    return jsonify(response), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email and password are required"}), 400
    procesed_email = data["email"].strip().lower()
    user = User.query.filter_by(email=procesed_email).first()

    # Verificar la contraseña usando bcrypt
    if not user or not bcrypt.checkpw(data['password'].encode("utf-8"), user.password.encode("utf-8")):
        return jsonify({"message": "Invalid credentials"}), 401
    

    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token, user={
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "is_active": user.is_active
    }), 200


@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "is_active": user.is_active
    }), 200
