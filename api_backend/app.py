from flask import Flask, redirect, request, jsonify, render_template
from PIL import Image
import cv2
import arabic_reshaper
import numpy as np
from model.detection import PlateDetector
from model.ocr import PlateReader
import os
from flask_cors import CORS
from db.init_db import init_db
from db.queries import *

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './model/received/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

class lpdr:
    def __init__(self, path):
        self.image_path = path

    def apply_ocr(self):
        self.reader = PlateReader()
        self.reader.load_model("./model/weights/ocr/yolov3-ocr_final.weights", "./model/weights/ocr/yolov3-ocr.cfg")
        
        image, height, width, channels = self.reader.load_image('./model/tmp/plate_box.jpg')
        blob, outputs = self.reader.read_plate(image)
        boxes, confidences, class_ids = self.reader.get_boxes(outputs, width, height, threshold=0.3)
        segmented, plate_text = self.reader.draw_labels(boxes, confidences, class_ids, image)
        cv2.imwrite('./model/tmp/plate_segmented.jpg', segmented)
        return arabic_reshaper.reshape(plate_text)

    def process_image(self):
        self.detector = PlateDetector()
        self.detector.load_model("./model/weights/detection/yolov3-detection_final.weights", "./model/weights/detection/yolov3-detection.cfg")

        if (self.image_path == ""):
            return
        
        image, height, width, channels = self.detector.load_image(self.image_path)
        blob, outputs = self.detector.detect_plates(image)
        boxes, confidences, class_ids = self.detector.get_boxes(outputs, width, height, threshold=0.3)
        plate_img, LpImg = self.detector.draw_labels(boxes, confidences, class_ids, image)
        if len(LpImg):
            cv2.imwrite('./model/tmp/car_box.jpg', plate_img)
            cv2.imwrite('./model/tmp/plate_box.jpg', LpImg[0])
            return self.apply_ocr()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_uploaded_image(path):
    try:
        image = Image.open(path)
        image_np = np.array(image)
        print(image_np)
        cv2.imwrite(path, image_np)
        plate = lpdr(path)
        result = plate.process_image()  
        print("result: ", result)
        return redirect(f"/get_plate?matricule={result}")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#################### ROOT ####################

@app.route('/')
def index():
    init_db()
    return "API is running."

#################### UPLOAD IMAGE ####################

@app.route('/upload', methods=['POST'])
def upload_file():   
    file = request.files['file']
    if 'file' not in request.files or file.filename == '':
        return jsonify({"error": "No image provided"}), 400
    
    if file and allowed_file(file.filename):
        path = os.path.join(app.config['UPLOAD_FOLDER'], f'received_img.jpg')
        file.save(path)
        
        if not os.path.exists(path):
            return jsonify({"error": "Failed to save image"}), 500
        
        return process_uploaded_image(path)
    
    return jsonify({"error": "Invalid file format"}), 400

#################### ADDING #######################

@app.route('/add_plate', methods=['POST'])
def handle_add_plate():
    response = add_plate(request.form)
    return jsonify(response)

@app.route('/add_user', methods=['POST'])
def handle_add_user():
    response = add_user(request.form)
    return jsonify(response)

#################### DELETEING #######################

@app.route('/delete_user', methods=['DELETE'])
def handle_delete_user():
    response = delete_user(request.form)
    return jsonify(response)

@app.route('/delete_plate', methods=['DELETE'])
def handle_delete_plate():
    response = delete_plate(request.form)
    return jsonify(response)

#################### GETTING #########################

@app.route('/get_users', methods=['GET'])
def handle_get_users():
    response = get_users()
    return jsonify(response)

@app.route('/get_plates', methods=['GET'])
def handle_get_plates():
    response = get_plates()
    return jsonify(response)

@app.route('/get_plate', methods=['GET'])
def handle_get_plate():
    matricule = request.args.get("matricule")
    response = get_plate(matricule)
    return jsonify(response)

#################### UPDATING #######################

@app.route('/update_user', methods=['PUT'])
def update_user_route():
    response = update_user(request.form)
    return jsonify(response)

#################### LOGIN ###########################

@app.route('/login', methods=['POST'])
def handle_login():
    matricule = request.form.get("matricule", request.args.get("matricule"))   
    password = request.form.get("password", request.args.get("password"))
    response = authenticate_user(matricule, password)
    return jsonify(response)

######################################################

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)