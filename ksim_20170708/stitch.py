from stat import S_ISREG, ST_CTIME, ST_MODE
import os, sys, time
import math
import random
from PIL import Image, ImageDraw

OUTPUT_SIZE = 424

OUTPUT_DIR = "scratch"
os.system("mkdir %s" % OUTPUT_DIR)

# temp_dir = OUTPUT_DIR + "/tmp"
# os.system("mkdir %s" % temp_dir)
    

v1_frames_dir = "scratch/video1_frames"
v2_frames_dir = "scratch/video2_frames"
output_frames_dir = "scratch/output_frames"
os.system("mkdir %s" % output_frames_dir)

def tween(box1, box2, fraction):
  x = (box2[0] - box1[0]) * fraction + box1[0]
  y = (box2[1] - box1[1]) * fraction + box1[1]
  w = (box2[2] - box1[2]) * fraction + box1[2]
  h = (box2[3] - box1[3]) * fraction + box1[3]
  return (int(x), int(y), int(w), int(h))

def make_inset_animation():
  k1 = (50, 50, 150, 150)
  k2 = (224, 50, 150, 150)
  k3 = (224, 224, 150, 150)
  k4 = (50, 224, 150, 150)
  
  inset_specs = []

  for i in range(24):
    inset_specs.append(tween(k1, k2, i/24.0))
  for i in range(24):
    inset_specs.append(tween(k2, k3, i/24.0))
  for i in range(24):
    inset_specs.append(tween(k3, k4, i/24.0))
  for i in range(24):
    inset_specs.append(tween(k4, k1, i/24.0))
    
  return inset_specs
    
inset_animation = make_inset_animation()
for i in range(len(inset_animation)):
  v1f = "%s/frame_%04d.png" % (v1_frames_dir, i)
  v2f = "%s/frame_%04d.png" % (v2_frames_dir, i)

  i1 = Image.open(v1f)
  i2 = Image.open(v2f)
  
  # Crop to insets
  inset = inset_animation[i]
  inset_image = i2.crop((inset[0], inset[1], inset[0]+inset[2], inset[1]+inset[3]))

  out = Image.new('RGBA', (424, 424), (255, 255, 255, 255))
  out.paste(i1, (0, 0))
  out.paste(inset_image, (inset[0], inset[1]))
  
  # Draw bounding rect
  draw = ImageDraw.Draw(out)
  draw.rectangle([inset[0], inset[1], inset[0]+inset[2], inset[1]+inset[3]], fill=None, outline=(255, 255, 255))
  
  out.save("%s/frame_%04d.png" % (output_frames_dir, i))
  
animation_name = "movie"
os.system("convert -delay 10 -loop 0 %s/frame_*.png %s/%s.gif" % (output_frames_dir, OUTPUT_DIR, animation_name))
os.system("convert -delay 5 -loop 0 %s/frame_*.png %s/%s.mp4" % (output_frames_dir, OUTPUT_DIR, animation_name))
