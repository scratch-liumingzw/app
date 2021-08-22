# 导入库
from Manipulator import *   # 机械手相关操作
from MathTools import *      # 自定义的一些数学计算函数

h = manipulator('/dev/ttyUSB0')   # 创建建机械手对象，传入一个参数-串口地址
h.start()     # 启动机械手

while True:
    for i in range(32):
        s.set_binary(dec2bin(i))
        time.sleep(1)