'''
映射函数：将x从[in_min,inmax]映射到[out_min,out_max]
'''
def numberMap(x, in_min, in_max, out_min, out_max):
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min

'''
将十进制数转为5位二进制数组，用于对应五个手指的收展
'''
def dec2bin(dec_num, bit_wide=5):
    bin_list = []
    _, bin_num_abs = bin(dec_num).split('b')
    if len(bin_num_abs) > bit_wide:
        raise ValueError
    else:
        if dec_num >= 0:
            bin_num = bin_num_abs.rjust(bit_wide,'0')
        else:
            _, bin_num = bin(2**bit_wide+dec_num).split('b')

    for index in range(bit_wide-1,-1,-1):
        bin_list.append(int(bin_num[index]))
    return bin_list

'''
将5位二进制数组，合成一个十进制数
'''
def bin2dec(bin_list):
    bin_list_r = bin_list[::-1]
    dec_str = ''
    for i in bin_list_r:
        dec_str +=str(i)
    return (int(dec_str,2))