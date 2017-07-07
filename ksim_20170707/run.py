from stat import S_ISREG, ST_CTIME, ST_MODE
import os, sys, time
import math

OUTPUT_SIZE = 400

CHECKPOINT = "~/git/sketchADay/data/multistyle-pastiche-generator-varied.ckpt"
NUM_STYLES = 32

OUTPUT_DIR = "scratch"

os.system("mkdir %s" % OUTPUT_DIR)

SIZE_PARAM = NUM_STYLES

def interpolate(v1, v2, fraction):
  v3 = []
  for i in range(len(v1)):
    if i == SIZE_PARAM:
      # Geometric interpolation
      v3.append(math.exp((math.log(v2[i]) - math.log(v1[i])) * fraction + math.log(v1[i])))
    else:
      # Arithmetic interpolation
      v3.append((v2[i] - v1[i]) * fraction + v1[i])
    
  return v3
  
def morph_between_styles(v1, v2, num_steps, filename, output_dir, frame_number):
  for i in range(0, num_steps):
    v3 = interpolate(v1, v2, 1.0/num_steps * i)
    draw_with_style(v3, filename, output_dir, frame_number + i)
    
def draw_with_style(vector, filename, output_dir, frame_number):
  temp_dir = output_dir + "/tmp"
  
  # Sample to appropriate size
  size = int(vector[SIZE_PARAM])
  if size % 4 != 0:
    print "WARNING: size %d is not a multiple of 4; rounding to nearest 4" % size
    if size % 4 > 1:
      size += 4
    size -= (size % 4)
  print "Using size %d." % size
  os.system("cp %s %s" % (filename, temp_dir))
  oldpath = temp_dir + "/" + filename
  newpath = temp_dir + "/%d_%s" % (size, filename)
  os.system("mv %s %s" % (oldpath, newpath))
  os.system("sips -Z %d %s" % (size, newpath))

  # Apply style
  style = "\"{"
  for i in range(0, NUM_STYLES):
    if vector[i] > 0.0005:
      style += "%d:%f," % (i, vector[i])
  style += "}\""

  print "drawing style: %s" % style

  output_basename = "%d_%s" % (size, filename.split(".")[0])

  command = "image_stylization_transform "
  command += "--num_styles=%d " % NUM_STYLES
  command += "--checkpoint=%s " % CHECKPOINT
  command += "--input_image=%s " % newpath
  command += "--which_styles=%s " % style
  command += "--output_dir=%s " % output_dir
  command += "--output_basename=%s " % output_basename
  
  print command
  
  result = os.system(command)
  
  if result == 256:
    # user sent a SIGINT or something similar
    exit(1)
    
  # Rename file to something more sensible
  os.system("mv %s/%s_* %s/frame_%04d.png" % (output_dir, output_basename, output_dir, frame_number))
  
def rename_files_by_date(dirpath, animation_name):
  # get all entries in the directory w/ stats
  entries = (os.path.join(dirpath, fn) for fn in os.listdir(dirpath))
  entries = ((os.stat(path), path) for path in entries)
  
  # leave only regular files, insert creation date
  entries = ((stat[ST_CTIME], path)
             for stat, path in entries if (S_ISREG(stat[ST_MODE])))
             # and OUTPUT_BASENAME+"_" in os.path.basename(path))  
  #NOTE: on Windows `ST_CTIME` is a creation date 
  #  but on Unix it could be something else
  #NOTE: use `ST_MTIME` to sort by a modification date
  
  num = 0
  for cdate, path in sorted(entries):
    print time.ctime(cdate), os.path.basename(path)
    os.rename(path, os.path.dirname(path) + "/" + animation_name + "_%04d.png" % num)
    num += 1
    
def animate(filename, animation_name, animation_def):
  output_dir = OUTPUT_DIR + "/" + animation_name
  temp_dir = output_dir + "/tmp"
  os.system("mkdir %s" % output_dir)
  os.system("mkdir %s" % temp_dir)

  frame_number = 0

  for i in range(len(animation_def)):
    defn = animation_def[i]
    v1 = defn[0]
    v2 = defn[1]
    frames = defn[2]
    
    morph_between_styles(v1, v2, frames, filename, output_dir, frame_number)
    frame_number += frames
    
  #last_frame = animation_def[len(animation_def)-1][1]
  #draw_with_style(last_frame, filename, output_dir, frame_number)
    
  #rename_files_by_date(output_dir, animation_name)

  ### Downsample
  os.system("mkdir %s/small" % output_dir)
  os.system("cp %s/*.png %s/small" % (output_dir, output_dir))
  os.system("sips -Z %d %s/small/*.png" % (OUTPUT_SIZE, output_dir))

  ### Animate
  os.system("convert -delay 10 -loop 0 %s/small/*.png %s/%s.gif" % (output_dir, OUTPUT_DIR, animation_name))
  os.system("convert -delay 5 -loop 0 %s/small/*.png %s/%s.mp4" % (output_dir, OUTPUT_DIR, animation_name))
#  os.system("mencoder %s/small/*.png -o %s/%s.avi -ovc lavc -lavcopts vcodec=mjpeg" % (output_dir, OUTPUT_DIR, animation_name))

  ### Remove temp directories
  os.system("rm -rf %s/small" % output_dir)
  os.system("rm -rf %s" % temp_dir)

## Styles that are any good
INTERESTING_STYLES = [0, 1, 3, 5, 6, 7, 8, 10, 11, 13, 14, 15, 16, 19, 21, 22, 24, 26, 28, 31]

STYLES = INTERESTING_STYLES
#STYLES = [0, 1, 3, 5]

v = []
for i in range(NUM_STYLES + 1):
  v.append(0)

# Snake
tweens = []
for i in range(0, len(STYLES), 2):
  v1 = v[:]
  v2 = v[:]
  v3 = v[:]
  v4 = v[:]
  v5 = v[:]

  v1[SIZE_PARAM] = 424
  v1[STYLES[i]] = 1

  v2[SIZE_PARAM] = 424
  v2[STYLES[i+1]] = 1

#   v3[SIZE_PARAM] = 40
#   v3[STYLES[i+1]] = 1
# 
#   v4[SIZE_PARAM] = 424
#   v4[STYLES[i+1]] = 1
# 
  v3[SIZE_PARAM] = 424
  v3[STYLES[(i+2) % len(STYLES)]] = 1
  
  tweens.append([v1, v2, 24])
  tweens.append([v2, v3, 24])
#   tweens.append([v3, v4, 24])
#   tweens.append([v4, v5, 24])

animate("tom_eric.jpg", "te_interesting", tweens)

# All styles
# for style in range(32):
#   v1 = []
#   for i in range(NUM_STYLES + 1):
#     v1.append(0)
#   
#   v2 = v1[:]
# 
#   # styles
#   v1[style+1] = 1
#   v2[style+1] = 1
# 
#   # sizes
#   v1[0] = 40
#   v2[0] = 600
# 
#   animate("tom_eric.jpg", "te_back_and_forth_%d" % style, [
#     [v1, v2, 70],
#   ])


