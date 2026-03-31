"""
Друзья в Яримплиграмм.
GET  / ?action=list          — список друзей
GET  / ?action=search&q=...  — поиск пользователей
GET  / ?action=requests      — входящие заявки
POST / { action:'add', username }     — отправить заявку
POST / { action:'accept', user_id }   — принять заявку
POST / { action:'decline', user_id }  — отклонить заявку
"""
import json, os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Token',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def get_user_id(token: str):
    try:
        return int(token.split(':', 1)[0])
    except Exception:
        return None

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
    token = headers.get('x-token', '')
    me = get_user_id(token)

    if not me:
        return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Unauthorized'})}

    params = event.get('queryStringParameters') or {}
    conn = get_conn()
    cur = conn.cursor()

    if method == 'GET':
        action = params.get('action', 'list')

        if action == 'search':
            q = params.get('q', '').lower().strip()
            if len(q) < 2:
                conn.close()
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'users': []})}
            cur.execute(
                """SELECT u.id, u.username, u.name, u.avatar,
                          COALESCE((SELECT f.status FROM yamp_friendships f
                            WHERE (f.requester_id=%s AND f.addressee_id=u.id)
                               OR (f.requester_id=u.id AND f.addressee_id=%s) LIMIT 1), 'none') as fstatus
                   FROM yamp_users u
                   WHERE u.id != %s AND (LOWER(u.username) LIKE %s OR LOWER(u.name) LIKE %s) LIMIT 20""",
                (me, me, me, f'%{q}%', f'%{q}%')
            )
            rows = cur.fetchall()
            conn.close()
            users = [{'id': r[0], 'username': r[1], 'name': r[2], 'avatar': r[3], 'friendship_status': r[4]} for r in rows]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'users': users})}

        if action == 'requests':
            cur.execute(
                """SELECT u.id, u.username, u.name, u.avatar
                   FROM yamp_friendships f
                   JOIN yamp_users u ON u.id = f.requester_id
                   WHERE f.addressee_id = %s AND f.status = 'pending'""",
                (me,)
            )
            rows = cur.fetchall()
            conn.close()
            requests = [{'id': r[0], 'username': r[1], 'name': r[2], 'avatar': r[3]} for r in rows]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'requests': requests})}

        # list friends
        cur.execute(
            """SELECT u.id, u.username, u.name, u.avatar
               FROM yamp_friendships f
               JOIN yamp_users u ON (
                 CASE WHEN f.requester_id = %s THEN u.id = f.addressee_id
                      ELSE u.id = f.requester_id END
               )
               WHERE (f.requester_id = %s OR f.addressee_id = %s) AND f.status = 'accepted'""",
            (me, me, me)
        )
        rows = cur.fetchall()
        conn.close()
        friends = [{'id': r[0], 'username': r[1], 'name': r[2], 'avatar': r[3]} for r in rows]
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'friends': friends})}

    # POST
    body = json.loads(event.get('body') or '{}')
    action = body.get('action', '')

    if action == 'add':
        username = (body.get('username') or '').strip().lower()
        cur.execute('SELECT id FROM yamp_users WHERE username = %s', (username,))
        row = cur.fetchone()
        if not row:
            conn.close()
            return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Пользователь не найден'})}
        target_id = row[0]
        if target_id == me:
            conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Нельзя добавить себя'})}
        cur.execute(
            'SELECT id, status FROM yamp_friendships WHERE (requester_id=%s AND addressee_id=%s) OR (requester_id=%s AND addressee_id=%s)',
            (me, target_id, target_id, me)
        )
        existing = cur.fetchone()
        if existing:
            conn.close()
            status_map = {'pending': 'Заявка уже отправлена', 'accepted': 'Вы уже друзья'}
            return {'statusCode': 409, 'headers': CORS, 'body': json.dumps({'error': status_map.get(existing[1], 'Уже существует')})}
        cur.execute(
            'INSERT INTO yamp_friendships (requester_id, addressee_id, status) VALUES (%s, %s, %s)',
            (me, target_id, 'pending')
        )
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    if action == 'accept':
        requester_id = body.get('user_id')
        cur.execute(
            "UPDATE yamp_friendships SET status='accepted' WHERE requester_id=%s AND addressee_id=%s AND status='pending'",
            (requester_id, me)
        )
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    if action == 'decline':
        requester_id = body.get('user_id')
        cur.execute(
            "UPDATE yamp_friendships SET status='declined' WHERE requester_id=%s AND addressee_id=%s AND status='pending'",
            (requester_id, me)
        )
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    conn.close()
    return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Unknown action'})}
