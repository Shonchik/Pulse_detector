from flask import Flask
from flask_restful import Api, Resource, reqparse
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

class getPulseApp():

    def __init__(self):
        self.port = 8000
        self.processor = findFaceGetPulse(bpm_limits=[50, 160], data_spike_limit=2500., face_detector_smoothness=10.)

    async def handler(websocket, path):
	    data = await websocket.recv()
	    answer = main_loop(data)
	    await websocket.send(answer)

    def main_loop(self, frame):
        self.processor.frame_in = frame
        self.processor.run(1)
        return str(self.processor.bpm)

    def run(self):
        start_socket = websockets.serve(self.handler, "localhost", self.port)
        asyncio.get_event_loop().run_until_complete(start_socket)
        asyncio.get_event_loop().run_forever()

class Pulse(Resource):
    def get(self, id=0):
        if id == 0:
            AppPulse = getPulseApp()
            AppPulse.run()	
            return AppPulse.port, 200
        return "pulse not found", 404

api.add_resource(Pulse, "/pulse")

if __name__ == '__main__':
    app.run(debug=True)










