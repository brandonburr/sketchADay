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
    

v1_frames_dir = "../ksim_20170708/scratch/video1_frames"
v2_frames_dir = "../ksim_20170708/scratch/video2_frames"
output_frames_dir = "scratch/output_frames"
os.system("mkdir %s" % output_frames_dir)

def tween(box1, box2, fraction):
  x = (box2[0] - box1[0]) * fraction + box1[0]
  y = (box2[1] - box1[1]) * fraction + box1[1]
  w = (box2[2] - box1[2]) * fraction + box1[2]
  h = (box2[3] - box1[3]) * fraction + box1[3]
  return (int(x), int(y), int(w), int(h))

# keyframe_spec should be of the form:
#   [box1, num_frames, box2, num_frames, box3, ..., boxN]
def get_tween_list(keyframe_spec):
  inset_specs = []
  for i in range(0, len(keyframe_spec)-1, 2):
    keyframe1 = keyframe_spec[i]
    keyframe2 = keyframe_spec[i+2]
    num_frames = keyframe_spec[i+1]
    for j in range(num_frames):
      inset_specs.append(tween(keyframe1, keyframe2, (j+0.0)/num_frames))
  return inset_specs

def make_inset_animation():
  framerate = 24
  keyframe_spec = [
    (70, 50, 120, 150), framerate, 
    (224, 30, 150, 190), framerate, 
    (200, 224, 100, 150), framerate, 
    (30, 210, 150, 120), framerate, 
    (70, 50, 120, 150), framerate, 
    (50, 224, 180, 120), framerate, 
    (224, 30, 130, 170), framerate, 
    (200, 224, 100, 150), framerate, 
  ]
  keyframe_spec.append(keyframe_spec[0])
    
  return get_tween_list(keyframe_spec)
    
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
