from stat import S_ISREG, ST_CTIME, ST_MODE
import os, sys, time

INPUT = "paul2.jpg"
OUTPUT_SIZE = 400

CHECKPOINT = "~/git/sketchADay/data/multistyle-pastiche-generator-varied.ckpt"
NUM_STYLES = 32

OUTPUT_DIR = "scratch"
TEMP_DIR = "scratch/tmp"

os.system("mkdir %s" % OUTPUT_DIR)
os.system("mkdir %s" % TEMP_DIR)

OUTPUT_BASENAME = INPUT.split(".")[0]

def interpolate(v1, v2, fraction):
  v3 = []
  for i in range(len(v1)):
    v3.append((v2[i] - v1[i]) * fraction + v1[i])
    
  return v3
  
def morph_between_styles(v1, v2, num_steps):
  for i in range(1, num_steps+1):
    v3 = interpolate(v1, v2, 1.0/num_steps * i)
    draw_with_style(v3)
    
def draw_with_style(vector):
  # Sample to appropriate size
  size = int(vector[0])
  if size % 4 != 0:
    print "WARNING: size %d is not a multiple of 4; rounding to nearest 4" % size
    if size % 4 > 1:
      size += 4
    size -= (size % 4)
  os.system("cp %s %s" % (INPUT, TEMP_DIR))
  oldpath = TEMP_DIR + "/" + INPUT
  newpath = TEMP_DIR + "/%d_%s" % (size, INPUT)
  os.system("mv %s %s" % (oldpath, newpath))
  os.system("sips -Z %d %s" % (size, newpath))

  # Apply style
  style = "\"{"
  for i in range(1, len(vector)):
    if vector[i] > 0.0005:
      style += "%d:%f," % (i-1, vector[i])
  style += "}\""

  print "drawing style: %s" % style

  output_basename = "%d_%s" % (size, OUTPUT_BASENAME)

  command = "image_stylization_transform "
  command += "--num_styles=%d " % NUM_STYLES
  command += "--checkpoint=%s " % CHECKPOINT
  command += "--input_image=%s " % newpath
  command += "--which_styles=%s " % style
  command += "--output_dir=%s " % OUTPUT_DIR
  command += "--output_basename=%s " % output_basename
  
  print command
  
  result = os.system(command)
  
  if result == 256:
    # user sent a SIGINT or something similar
    exit(1)
  
def rename_files_by_date(dirpath):
  # get all entries in the directory w/ stats
  entries = (os.path.join(dirpath, fn) for fn in os.listdir(dirpath))
  entries = ((os.stat(path), path) for path in entries)
  
  # leave only regular files, insert creation date
  entries = ((stat[ST_CTIME], path)
             for stat, path in entries if (S_ISREG(stat[ST_MODE])) and OUTPUT_BASENAME+"_" in os.path.basename(path))  
  #NOTE: on Windows `ST_CTIME` is a creation date 
  #  but on Unix it could be something else
  #NOTE: use `ST_MTIME` to sort by a modification date
  
  num = 0
  for cdate, path in sorted(entries):
    print time.ctime(cdate), os.path.basename(path)
    os.rename(path, os.path.dirname(path) + "/" + OUTPUT_BASENAME + "_%04d.png" % num)
    num += 1

v1 = []
for i in range(NUM_STYLES + 1):
  v1.append(0)
  
v2 = v1[:]
v3 = v1[:]
v4 = v1[:]

# styles
v1[25] = 1
v2[25] = 1
# v3[4] = 1
# v4[4] = 1

# sizes
v1[0] = 40
v2[0] = 744
# v3[0] = 700
# v4[0] = 400

draw_with_style(v1)
morph_between_styles(v1, v2, 88)
# morph_between_styles(v2, v3, 24)
# morph_between_styles(v3, v4, 24)
# morph_between_styles(v4, v1, 24)

rename_files_by_date(OUTPUT_DIR)

### Downsample
os.system("mkdir %s/small" % TEMP_DIR)
os.system("cp %s/*.png %s/small" % (OUTPUT_DIR, TEMP_DIR))
os.system("sips -Z %d %s/small/*.png" % (OUTPUT_SIZE, TEMP_DIR))

### Animate
os.system("convert -delay 10 -loop 0 %s/small/*.png %s/%s.gif" % (TEMP_DIR, OUTPUT_DIR, OUTPUT_BASENAME))
os.system("convert -delay 5 -loop 0 %s/small/*.png %s/%s.mp4" % (TEMP_DIR, OUTPUT_DIR, OUTPUT_BASENAME))
os.system("mencoder %s/small/*.png -o %s/%s.avi -ovc lavc -lavcopts vcodec=mjpeg" % (TEMP_DIR, OUTPUT_DIR, OUTPUT_BASENAME))

### Remove tmp/small directory
os.system("rm -rf %s/small" % TEMP_DIR)

