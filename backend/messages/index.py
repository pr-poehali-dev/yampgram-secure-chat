"""
Сообщения Яримплиграмм.
GET  / ?action=history&with=ID  — история переписки
GET  / ?action=unread            — кол-во непрочитанных по чатам
POST / { action:'send', to_id, text }   — отправить сообщение
POST / { action:'read', from_id }       — пометить прочитанными
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
        action = params.get('action', 'history')

        if action == 'unread':
            cur.execute(
                "SELECT from_id, COUNT(*) FROM yamp_messages WHERE to_id=%s AND read_at IS NULL GROUP BY from_id",
                (me,)
            )
            rows = cur.fetchall()
            conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'unread': {str(r[0]): r[1] for r in rows}})}

        # history
        with_id = params.get('with')
        if not with_id:
            conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Missing with param'})}
        with_id = int(with_id)
        cur.execute(
            """SELECT id, from_id, to_id, text,
                      to_char(created_at AT TIME ZONE 'Europe/Moscow', 'HH24:MI') as t,
                      read_at IS NOT NULL
               FROM yamp_messages
               WHERE (from_id=%s AND to_id=%s) OR (from_id=%s AND to_id=%s)
               ORDER BY created_at ASC LIMIT 100""",
            (me, with_id, with_id, me)
        )
        rows = cur.fetchall()
        cur.execute(
            "UPDATE yamp_messages SET read_at=NOW() WHERE from_id=%s AND to_id=%s AND read_at IS NULL",
            (with_id, me)
        )
        conn.commit()
        conn.close()
        msgs = [{'id': r[0], 'from_id': r[1], 'to_id': r[2], 'text': r[3], 'time': r[4], 'read': r[5]} for r in rows]
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'messages': msgs})}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action', '')

    if action == 'send':
        to_id = body.get('to_id')
        text = (body.get('text') or '').strip()
        if not to_id or not text:
            conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Missing to_id or text'})}
        # проверка дружбы
        cur.execute(
            "SELECT id FROM yamp_friendships WHERE ((requester_id=%s AND addressee_id=%s) OR (requester_id=%s AND addressee_id=%s)) AND status='accepted'",
            (me, to_id, to_id, me)
        )
        if not cur.fetchone():
            conn.close()
            return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Сначала добавьте друг друга'})}
        cur.execute(
            "INSERT INTO yamp_messages (from_id, to_id, text) VALUES (%s, %s, %s) RETURNING id, to_char(created_at AT TIME ZONE 'Europe/Moscow', 'HH24:MI')",
            (me, to_id, text)
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
            'message': {'id': row[0], 'from_id': me, 'to_id': to_id, 'text': text, 'time': row[1], 'read': False}
        })}

    if action == 'read':
        from_id = body.get('from_id')
        cur.execute(
            "UPDATE yamp_messages SET read_at=NOW() WHERE from_id=%s AND to_id=%s AND read_at IS NULL",
            (from_id, me)
        )
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    conn.close()
    return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Unknown action'})}
