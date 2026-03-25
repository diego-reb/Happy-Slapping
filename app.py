from flask import Flask, request, jsonify, render_template
import psycopg2
from config import DATABASE_URL

app = Flask(__name__)

def get_conn():
    if not DATABASE_URL:
        raise ValueError("No existe DATABASE_URL en variables de entorno")
    return psycopg2.connect(DATABASE_URL)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/guardar', methods=['POST'])
def guardar():
    data = request.json
    respuesta = data.get('respuesta')

    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    user_agent = request.headers.get('User-Agent')

    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO respuestas (respuesta, ip, user_agent)
        VALUES (%s, %s, %s)
    """, (respuesta, ip, user_agent))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"status": "ok"})

@app.route('/ping')
def ping():
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        cur.close()
        conn.close()
        return "ok"
    except:
        return "error"

@app.route('/admin', methods=['POST'])
def admin():
    data = request.json
    password = data.get('password')

    claves = ["dzgr", "1234", "s8v", "pa"]

    if password in claves:
        conn = get_conn()
        cur = conn.cursor()

        cur.execute("SELECT * FROM respuestas ORDER BY fecha DESC")
        datos = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify({"access": True, "data": datos})

    return jsonify({"access": False})

if __name__ == '__main__':
    app.run(debug=True)