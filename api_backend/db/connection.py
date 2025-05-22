import psycopg2

def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="postgres",
        user="postgres",
        password="1234",
        port=5433,
        options="-c client_encoding=UTF8"  
    )
    return conn
