import os
import numpy as np
#import tensorflow as tf
import matplotlib.pyplot as plt
from PIL import Image
from glob import glob
from os import rename, listdir


trainset = glob('dataset/display/img/*')

for set in trainset:
    os.rename(set,set+'.png')

trainset = glob('dataset/display/img/*')

count = 0
for set in trainset:
    temp = []
    img = Image.open(set)
    img = np.array(img, dtype=np.float32) # 4 channel (1X4)
    for i in range(28):
        for j in range(28):
            temp.append(img[i][j][0])
            print(img[i][j][0])
    img = np.array(temp, dtype=np.float32)
    textFileName = 'dataset/display/text/' + str(count) + '.txt'
    np.savetxt(textFileName, img)
    count += 1
    
trainset = glob('dataset/display/img/*')
for set in trainset:
    os.remove(set)
#textTrainSets = glob('dataset/display/text/*')

#plt.figure(figsize=(10,10))
#cnt = 0
#for set in textTrainSets:
 #   img = np.loadtxt(set)
  #  img = img.reshape(28,28)
   # plt.subplot(10,11,cnt+1), plt.imshow(img, cmap='gray')
    #cnt += 1






