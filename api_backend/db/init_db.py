from db.connection import get_db_connection

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        mdp VARCHAR(255) NOT NULL,
        matricule INTEGER NOT NULL UNIQUE,
        role VARCHAR(50) NOT NULL
    );
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS plates (
        id SERIAL PRIMARY KEY,
        entite_emetrice VARCHAR(255) NOT NULL,
        site_objet VARCHAR(255) NOT NULL,
        personne_autorise VARCHAR(255) NOT NULL,
        nom_prestataire VARCHAR(255) NOT NULL,
        cin_prestat VARCHAR(20) NOT NULL,
        date_arrivée TIMESTAMP NOT NULL,
        date_depart TIMESTAMP NOT NULL,
        objet_visite TEXT NOT NULL,
        agent_bam_accuelle VARCHAR(255) NOT NULL,
        num_vehicule1 VARCHAR(5) NOT NULL,
        num_vehicule2 VARCHAR(255) NOT NULL,
        num_vehicule3 VARCHAR(2) NOT NULL
    );
    ''')

    conn.commit()
    cursor.close()
    conn.close()
