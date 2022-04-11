from flask import Flask, request
from flask_cors import CORS
from flaskext.mysql import MySQL
import json
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, verify_jwt_in_request
from datetime import timedelta

app = Flask(__name__)

mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'bhx20166_Lexa070301'
app.config['MYSQL_DATABASE_PASSWORD'] = ';Bmfr9m7.I36'
app.config['MYSQL_DATABASE_DB'] = 'bhx20166_kis'
app.config['MYSQL_DATABASE_HOST'] = '91.219.194.19'
app.config['JWT_SECRET_KEY'] = 'fj234%$@ptj\34j\4390Q%)%ufv=19414_@*231i)(&0r-'
mysql.init_app(app)
conn = mysql.connect()
default_path = '/api/'

jwt = JWTManager(app)
CORS(app, supports_credentials=True)


def query_db(query, add=[], args=(), one=False):
    cursor = conn.cursor()
    cursor.execute(query, args)
    r = [dict((cursor.description[i][0], value) \
              for i, value in enumerate(row)) for row in cursor.fetchall()]
    cursor.close()
    result = (r[0] if r else None) if one else r
    if add != []:
        result += add
    return json.dumps(result, ensure_ascii=False, default=str)


@app.route(default_path + 'users', methods=['GET'])
def users():
    response = app.response_class(
        response=query_db('SELECT * FROM User'),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route(default_path + 'organisations', methods=['GET'])
def organisations():
    response = app.response_class(
        response=query_db('SELECT * FROM Organisation'),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route(default_path + 'agents', methods=['GET'])
def agents():
    response = app.response_class(
        response=query_db('SELECT Name, FullName, Email, Organisation.Title AS Office FROM Employee \
        INNER JOIN Position ON Employee.Position_id = Position.id \
        INNER JOIN Organisation ON Employee.Organisation_id = Organisation.id \
        WHERE Position.Title = "Агент";'),
        status=200,
        mimetype='application/json'
    )

    return response


@app.route(default_path + 'auth/login', methods=['POST'])
def login():
    if request.method == 'POST':
        cursor = conn.cursor()
        cursor.execute('SELECT Password, id FROM Employee WHERE Email = "' + str(request.json['email']) + '";')
        data = cursor.fetchone()
        password = data[0]
        userid = str(data[1])
        cursor.close()
        if password == request.json['password']:
            token = create_access_token(identity=userid, expires_delta=timedelta(24))
            response = app.response_class(
                response=query_db('SELECT Position.Title FROM Employee INNER JOIN Position ON Employee.Position_id = \
                Position.id  WHERE Employee.id = "' + userid + '";', [{'jwtToken': token}]),
                status=200,
                mimetype='application/json'
            )
        else:
            response = app.response_class(
                response='error',
                status=200,
                mimetype='text/plain'
            )
    else:
        response = app.response_class(
            response='Wrong method',
            status=400,
            mimetype='text/plain'
        )
    return response


@app.route(default_path + 'check_auth', methods=['POST'])
def check_auth():
    verify_jwt_in_request()
    userid = str(get_jwt_identity())
    response = app.response_class(
        response=query_db('SELECT Position.Title FROM Employee INNER JOIN Position ON Employee.Position_id = \
                    Position.id  WHERE Employee.id = "' + userid + '";'),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route(default_path + 'countries', methods=['GET'])
def countries():
    response = app.response_class(
        response=query_db('SELECT * FROM Country;'),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route(default_path + 'cities', methods=['GET'])
def cities():
    response = app.response_class(
        response=query_db('SELECT City.Name AS City, Country.Name AS Country FROM City \
        INNER JOIN Country ON City.Country_id = Country.id;'),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route(default_path + 'hotels', methods=['GET'])
def hotels():
    response = app.response_class(
        response=query_db('SELECT Hotel.Name AS Hotel, Address, City.Name AS City, Country.Name AS Country \
        FROM Hotel INNER JOIN City ON Hotel.City_id = City.id INNER JOIN Country ON City.Country_id = Country.id;'),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route(default_path + 'clients', methods=['GET'])
def clients():
    response = app.response_class(
        response=query_db('SELECT Name, FullName, Sex, DateOfBirth, PlaceOfBirth, Status, Series, Number, \
        IssuanceDate, EndDate, IssuedAt FROM User INNER JOIN Passport ON User.Passport_id = Passport.id \
        INNER JOIN Status On User.Status_id = Status.id;'),
        status=200,
        mimetype='application/json'
    )
    return response


if __name__ == '__main__':
    app.run()
