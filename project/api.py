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
        self.port = 8001
        self.processor = findFaceGetPulse(bpm_limits=[50, 160], data_spike_limit=2500., face_detector_smoothness=10.)
        # self.loop = asyncio.get_event_loop()

    async def handler(self, websocket, path):
        while True:
            data = await websocket.recv()
            answer = self.main_loop(data)
            await websocket.send(answer)

    async def main_loop(self, frame):
        self.processor.frame_in = frame
        self.processor.run(1)
        return str(self.processor.bpm)

    async def run(self):
        # start_socket = websockets.serve(self.handler, "localhost", self.port)
        # self.loop.run_until_complete(start_socket)
        # self.loop.run_forever()
        print("kek")
        async with websockets.serve(self.handler, "localhost", self.port):
            await asyncio.Future()
        
AppPulse = getPulseApp()
            
class Pulse(Resource):
    def get(self, id=0):
        if id == 0:
            return AppPulse.port, 200
        return "pulse not found", 404

api.add_resource(Pulse, "/pulse")

if __name__ == '__main__':
    app.run(debug=True)
    asyncio.run(AppPulse.run())










