import psycopg2
from psycopg2.extras import RealDictCursor
from db.connection import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash

#################### UTILs #######################

def convert_to_arabic(char):
    latin_to_arabic = {
        'a': 'أ', 'b': 'ب', 
        'ch': 'ش', 'd': 'د',
        'h': 'ه', 'w': 'و'
    }
    return latin_to_arabic.get(char, char) 

#################### ADDING ######################

def add_plate(data):
    required_fields = [
        'entite_emetrice', 'site_objet', 'personne_autorise', 'nom_prestataire',
        'cin_prestat', 'date_arrivée', 'date_depart', 'objet_visite',
        'agent_bam_accuelle', 'num_vehicule1', 'num_vehicule2', 'num_vehicule3'
    ]
    for field in required_fields:
        if not data.get(field):
            return {"success": False, "message": f"Champ requis manquant: {field}"}, 400

    entite_emetrice = data.get('entite_emetrice')
    site_objet = data.get('site_objet')
    personne_autorise = data.get('personne_autorise')
    nom_prestataire = data.get('nom_prestataire')
    cin_prestat = data.get('cin_prestat')
    date_arrivée = data.get('date_arrivée')
    date_depart = data.get('date_depart')
    objet_visite = data.get('objet_visite')
    agent_bam_accuelle = data.get('agent_bam_accuelle')
    num_vehicule1 = data.get('num_vehicule1')
    num_vehicule2 = convert_to_arabic(data.get('num_vehicule2'))
    num_vehicule3 = data.get('num_vehicule3')

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT * FROM plates WHERE entite_emetrice = %s AND site_objet = %s AND personne_autorise = %s AND nom_prestataire = %s AND cin_prestat = %s AND date_arrivée = %s AND date_depart = %s AND objet_visite = %s AND agent_bam_accuelle = %s AND num_vehicule1 = %s AND num_vehicule2 = %s AND num_vehicule3 = %s
        ''', (entite_emetrice, site_objet, personne_autorise, nom_prestataire, cin_prestat, date_arrivée, date_depart, objet_visite, agent_bam_accuelle, num_vehicule1, num_vehicule2, num_vehicule3))
        
        existing_plate = cursor.fetchone()
        if existing_plate:
            return {"success": False, "message": "Enregistrement déjà existant!"}, 400

        cursor.execute('''
            INSERT INTO plates (entite_emetrice, site_objet, personne_autorise, nom_prestataire, cin_prestat, date_arrivée, date_depart, objet_visite, agent_bam_accuelle, num_vehicule1, num_vehicule2, num_vehicule3)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (entite_emetrice, site_objet, personne_autorise, nom_prestataire, cin_prestat, date_arrivée, date_depart, objet_visite, agent_bam_accuelle, num_vehicule1, num_vehicule2, num_vehicule3))
        
        conn.commit()
        return {"success": True, "message": "Plaque ajoutée avec succès"}, 200

    except psycopg2.Error as e:
        conn.rollback()
        return {"success": False, "message": f"Erreur de base de données: {e}"}, 500
    finally:
        cursor.close()
        conn.close()

def add_user(data):
    nom = data.get('nom')
    email = data.get('email')
    password = generate_password_hash(data.get('password'))
    matricule = data.get('matricule')
    role = data.get('role')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT * FROM users WHERE matricule = %s', (matricule,))
        existing_user = cursor.fetchone()

        if existing_user:
            response = {"success": False, "message": "Un utilisateur avec ce matricule existe déjà."}
        else:
            cursor.execute('''
                INSERT INTO users (nom, email, mdp, matricule, role)
                VALUES (%s, %s, %s, %s, %s)
            ''', (nom, email, password, matricule, role))
            conn.commit()
            response = {"success": True, "message": "Utilisateur ajouté avec succès."}
    except psycopg2.Error as e:
        conn.rollback()
        response = {"success": False, "message": f"Erreur de base de données: {e}"}
    finally:
        cursor.close()
        conn.close()
    return response

#################### DELETEING ###################

def delete_user(data):
    user_id = data.get('id')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('DELETE FROM users WHERE id = %s', (user_id,))
        conn.commit()

        if cursor.rowcount > 0:
            response = {"success": True, "message": "Utilisateur supprimé avec succès."}
        else:
            response = {"success": False, "message": "Erreur lors de la suppression de l'utilisateur."}
    except psycopg2.Error as e:
        conn.rollback()
        response = {"success": False, "message": f"Erreur de base de données: {e}"}
    finally:
        cursor.close()
        conn.close()
    return response

def delete_plate(data):
    plate_id = data.get('id')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('DELETE FROM plates WHERE id = %s', (plate_id,))
        conn.commit()

        if cursor.rowcount > 0:
            response = {"success": True, "message": "Plaque supprimée avec succès."}
        else:
            response = {"success": False, "message": "Erreur lors de la suppression de la plaque."}
    except psycopg2.Error as e:
        conn.rollback()
        response = {"success": False, "message": f"Erreur de base de données: {e}"}
    finally:
        cursor.close()
        conn.close()
    return response

#################### GETTING #####################

def get_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('SELECT id, nom, email, matricule, role FROM users')
        users = cursor.fetchall()
        return [
            {
                'id': user[0],
                'nom': user[1],
                'email': user[2],
                'matricule': user[3],
                'role': user[4]
            } for user in users
        ] if users else {"error": "Aucun utilisateur trouvé"}
    except psycopg2.Error as e:
        return {"error": f"Erreur de base de données: {e}"}
    finally:
        cursor.close()
        conn.close()

def get_plates():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT * FROM plates')
        plates = cursor.fetchall()
        return [
            {   
                'id': plate[0],
                'entite_emetrice': plate[1],
                'site_objet': plate[2],
                'personne_autorise': plate[3],
                'nom_prestataire': plate[4],
                'cin_prestat': plate[5],
                'date_arrivée': plate[6],
                'date_depart': plate[7],
                'objet_visite': plate[8],
                'agent_bam_accuelle': plate[9],
                'num_vehicule1': plate[10],
                'num_vehicule2': plate[11] ,
                'num_vehicule3': plate[12]
            } for plate in plates
        ] if plates else {"error": "Aucune plaque trouvée"}
    except psycopg2.Error as e:
        return {"error": f"Erreur de base de données: {e}"}
    finally:
        cursor.close()
        conn.close() 

def get_plate(matricule):
    try:
        num_vehicule1, num_vehicule2, num_vehicule3 = matricule.split('|')
        num_vehicule1 = num_vehicule1.strip()
        num_vehicule2 = convert_to_arabic(num_vehicule2.strip())
        num_vehicule3 = num_vehicule3.strip()

        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute('''
                    SELECT * FROM plates 
                    WHERE num_vehicule1 = %s AND num_vehicule2 = %s AND num_vehicule3 = %s
                ''', (num_vehicule1, num_vehicule2, num_vehicule3))
                plate = cursor.fetchone()  
                if plate:
                    return {
                        'id': plate['id'],
                        'Entitée émetrice': plate['entite_emetrice'],
                        'Site objet': plate['site_objet'],
                        'Personne autorisée': plate['personne_autorise'],
                        'Nom du prestataire': plate['nom_prestataire'],
                        'Cin du prestataire': plate['cin_prestat'],
                        "Date d'arrivée": plate['date_arrivée'],
                        'Date de départ': plate['date_depart'],
                        'Objet de la visite': plate['objet_visite'],
                        "Agent BKAM d'accueille": plate['agent_bam_accuelle'],
                        'Num véhicule 1': plate['num_vehicule1'],
                        'Num véhicule 2': plate['num_vehicule2'],
                        'Num véhicule 3': plate['num_vehicule3']
                        }
                else:
                    return {"error": "Plaque non trouvée"}
    except Exception as e:
        print(f"Erreur: {e}")
        return {"error": "Une erreur est survenue lors de la récupération de la plaque"}

#################### UPDATING ####################

def update_user(data):
    matricule = data.get('matricule')
    password = data.get('password')

    if not matricule or not password:
        return {"success": False, "message": "Le matricule et le mot de passe sont obligatoires."}

    hashed_password = generate_password_hash(password)

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT * FROM users WHERE matricule = %s', (matricule,))
        existing_user = cursor.fetchone()

        if existing_user:
            cursor.execute('''
                UPDATE users SET mdp = %s WHERE matricule = %s
            ''', (hashed_password, matricule))
            conn.commit()
            response = {"success": True, "message": "Mot de passe mis à jour avec succès."}
        else:
            response = {"success": False, "message": "Utilisateur non trouvé."}
    except psycopg2.Error as e:
        conn.rollback()
        response = {"success": False, "message": f"Erreur de base de données: {e}"}
    finally:
        cursor.close()
        conn.close()
    return response

#################### LOGIN #######################

def authenticate_user(matricule, password):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT * FROM users WHERE matricule = %s', (matricule,))
        user = cursor.fetchone()

        if user is None:
            return {"success": False, "message": "Utilisateur non trouvé.", "role": None}

        hashed_password = user[3]
        role = user[5]

        if hashed_password is None:
            return {"success": False, "message": "Mot de passe non trouvé pour l'utilisateur.", "role": None}

        if check_password_hash(hashed_password, password):
            return {"success": True, "message": "Authentification réussie.", "role": role}
        else:
            return {"success": False, "message": "Échec de la vérification du mot de passe.", "role": None}
    except psycopg2.Error as e:
        return {"success": False, "message": f"Erreur de base de données: {e}", "role": None}
    finally:
        cursor.close()
        conn.close()
