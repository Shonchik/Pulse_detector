from flask import Flask
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

app = Flask(__name__)
api = Api(app)

sessions = []

class getPulseApp():

    def __init__(self):
        self.processor = findFaceGetPulse(bpm_limits=[50, 160], data_spike_limit=2500., face_detector_smoothness=10.)

    def run(self, frame):
        self.processor.frame_in = frame
        self.processor.run(1)

    def get_bpm(self):
        return str(self.processor.bpm)
            
AppPulse = getPulseApp()

class Session(Resource):
    def get(self):
        id = len(sessions)
        app = getPulseApp()
        sessions.append(app)
        return id, 200

class NewData(Resource):
    def get(self, id=-1, frame = ""):
        app = sessions[id]
        app.run(frame)
        return "All good", 200

class BPM(Resource):
    def get(self, id=0):
        app = sessions[id]
        print(app.get_bpm())
        return app.get_bpm(), 200

api.add_resource(Session, "/new_session")
api.add_resource(NewData, "/new_data/<int:id>/<string:frame>")
api.add_resource(BPM, "/get_bpm/<int:id>")

if __name__ == '__main__':
    app.run(debug=True)










