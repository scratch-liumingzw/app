#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
AI_Manipulator.py

This Module drive the Manipulator by Serial Port.
'''
import time

import pyfirmata
from MathTools import numberMap

class manipulator():
    def __init__(self,serial_port):
        self.port = serial_port
        self.board = pyfirmata.Arduino(self.port)
        self.iter8 = pyfirmata.util.Iterator(self.board)
        # self.iter8.start()
        self.init()

    def init(self):
        self.pinThumb = self.board.get_pin('d:2:s')
        self.pinIndex = self.board.get_pin('d:3:s')
        self.pinMiddle = self.board.get_pin('d:4:s')
        self.pinRing = self.board.get_pin('d:5:s')
        self.pinPinky = self.board.get_pin('d:6:s')
        self.pinThumb_e = self.board.get_pin('d:7:s')
        self.pinPlam = self.board.get_pin('d:8:s')
        self.thumb_angle = 100
        self.index_angle = 100
        self.middle_angle = 100
        self.ring_angle = 100
        self.pinky_angle = 100
        self.plam_angle = 90
        self.set_thumb(self.thumb_angle)
        self.set_index(self.index_angle)
        self.set_middle(self.middle_angle)
        self.set_ring(self.ring_angle)
        self.set_pinky(self.pinky_angle)
        self.set_plam(self.plam_angle)

    def start(self):
        self.iter8.start()

    def stop(self):
        self.iter8.stop()

    def set_thumb(self, angle):
        _angle = numberMap(angle,0,100,155,105)
        _angle_e = numberMap(angle,0,100,75,105)
        self.pinThumb.write(_angle)
        self.pinThumb_e.write(_angle_e)

    def set_index(self, angle):
        _angle = numberMap(angle,0,100,135,55)
        self.pinIndex.write(_angle)

    def set_middle(self, angle):
        _angle = numberMap(angle, 0, 100, 140, 60)
        self.pinMiddle.write(_angle)

    def set_ring(self, angle):
        _angle = numberMap(angle, 0, 100, 115, 35)
        self.pinRing.write(_angle)

    def set_pinky(self, angle):
        _angle = numberMap(angle, 0, 100, 50, 130)
        self.pinPinky.write(_angle)

    def set_plam(self, angle):
        self.pinPlam.write(angle)

    def set_angle(self, angle_list):
        self.set_index(angle_list[1])
        self.set_middle(angle_list[2])
        self.set_ring(angle_list[3])
        self.set_pinky(angle_list[4])
        self.set_thumb(angle_list[0])

    def set_binary(self, binary_list):
        self.set_index(binary_list[1]*100)
        self.set_middle(binary_list[2]*100)
        self.set_ring(binary_list[3]*100)
        self.set_pinky(binary_list[4]*100)
        self.set_thumb(binary_list[0]*100)

import time
from MathTools import dec2bin
if __name__ == "__main__":
    s = manipulator('/dev/ttyUSB0')
    s.start()
    for i in range(32):
        s.set_binary(dec2bin(i))
        time.sleep(1)
    # s.set_index(0)
    # s.set_thumb(0)