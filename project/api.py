from flask import Flask, jsonify, request
from flask_restful import Api, Resource, reqparse
from flask_socketio import SocketIO, emit
from lib.device import Camera
from lib.processors_noopenmdao import findFaceGetPulse
from lib.interface import plotXY, imshow, waitKey, destroyWindow
from cv2 import moveWindow
import argparse
import numpy as np
import datetime
#TODO: work on serial port comms, if anyone asks for it
#from serial import Serial
import socket
import sys
import asyncio
import websockets
import base64
import cv2

app = Flask(__name__)
api = Api(app)

sessions = []

class getPulseApp():

    def __init__(self):
        self.processor = findFaceGetPulse(bpm_limits=[50, 160], data_spike_limit=2500., face_detector_smoothness=10.)
        self.data = []
        self.count = 0

    def run(self):
        while len(self.data) != 0:
            im_bytes = base64.b64decode(self.data[0])
            im_arr = np.frombuffer(im_bytes, dtype=np.uint8)
            frame = cv2.imdecode(im_arr, 1)
            self.processor.frame_in = frame
            # print(self.data[0])
            self.data.pop(0)
            self.processor.run(1)

    def run_if_nedeed(self):
        self.run()
        if self.count > 10 and self.processor.find_faces :
            self.processor.find_faces_toggle()
            return

    def get_bpm(self):
        return str(self.processor.text_output)

class Session(Resource):
    def get(self):
        id = len(sessions)
        app = getPulseApp()
        sessions.append(app)
        return id, 200

class NewData(Resource):
    def post(self, id=-1):
        if id == -1:
            return "Not found", 404
        json_data = request.get_json(force=True)
        frame = json_data['frame']
        sessions[id].data.append(frame)
        sessions[id].count = sessions[id].count + 1
        sessions[id].run_if_nedeed()
        return "All good", 200

class BPM(Resource):
    def get(self, id=-1):
        if id == -1:
            return "Not found", 404
        app = sessions[id]
        return app.get_bpm(), 200

class CloseSession(Resource):
    def get(self, id=-1):
        if id == -1:
            return "Not found", 404
        sessions[id] = ""
        return "Close session: " + str(id), 200

api.add_resource(Session, "/new_session")
api.add_resource(NewData, "/new_data/<int:id>")
api.add_resource(BPM, "/get_bpm/<int:id>")
api.add_resource(CloseSession, "/close_session/<int:id>")

if __name__ == '__main__':
    app.run(debug=True)










