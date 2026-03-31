"""
Авторизация Яримплиграмм.
POST / { action: 'register', username, name, password } -> { token, user }
POST / { action: 'login', username, password }          -> { token, user }
GET  / header X-Token                                   -> { user }
"""
import json, os, hashlib, secrets, random
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Token',
}

AVATARS = ['👨‍💻','👩‍🎨','🎸','🚀','🌸','🦊','🐯','🦁','🐬','🦋','🎯','🌊','🔥','⚡','🎪']

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def make_token(user_id: int) -> str:
    return f"{user_id}:{secrets.token_hex(32)}"

def parse_token(token: str):
    try:
        return int(token.split(':', 1)[0])
    except Exception:
        return None

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}

    # GET / — проверка токена
    if method == 'GET':
        token = headers.get('x-token', '')
        user_id = parse_token(token)
        if not user_id:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Unauthorized'})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute('SELECT id, username, name, avatar FROM yamp_users WHERE id = %s', (user_id,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'User not found'})}
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
            'user': {'id': row[0], 'username': row[1], 'name': row[2], 'avatar': row[3]}
        })}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action', '')

    # register
    if action == 'register':
        username = (body.get('username') or '').strip().lower()
        name = (body.get('name') or '').strip()
        password = body.get('password') or ''

        if not username or len(username) < 3:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Username минимум 3 символа'})}
        if not name:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Введите имя'})}
        if len(password) < 6:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Пароль минимум 6 символов'})}

        avatar = random.choice(AVATARS)
        conn = get_conn()
        cur = conn.cursor()
        try:
            cur.execute(
                'INSERT INTO yamp_users (username, name, password_hash, avatar) VALUES (%s, %s, %s, %s) RETURNING id',
                (username, name, hash_password(password), avatar)
            )
            user_id = cur.fetchone()[0]
            conn.commit()
        except psycopg2.errors.UniqueViolation:
            conn.rollback()
            conn.close()
            return {'statusCode': 409, 'headers': CORS, 'body': json.dumps({'error': 'Username уже занят'})}
        finally:
            if not conn.closed:
                conn.close()

        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
            'token': make_token(user_id),
            'user': {'id': user_id, 'username': username, 'name': name, 'avatar': avatar}
        })}

    # login
    if action == 'login':
        username = (body.get('username') or '').strip().lower()
        password = body.get('password') or ''

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            'SELECT id, username, name, avatar, password_hash FROM yamp_users WHERE username = %s',
            (username,)
        )
        row = cur.fetchone()
        conn.close()

        if not row or row[4] != hash_password(password):
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Неверный username или пароль'})}

        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
            'token': make_token(row[0]),
            'user': {'id': row[0], 'username': row[1], 'name': row[2], 'avatar': row[3]}
        })}

    return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Unknown action'})}
