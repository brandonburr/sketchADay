from stat import S_ISREG, ST_CTIME, ST_MODE
import os, sys, time

NUM_STYLES = 32
CHECKPOINT = "~/git/sketchADay/scratch/magenta/multistyle-pastiche-generator-varied.ckpt"
INPUT = "socks_400.jpg"
OUTPUT_DIR = "output"
OUTPUT_BASENAME = "socks_400_varied"

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
  style = "\"{"
  for i in range(0, len(vector)):
    style += "%d:%f" % (i, vector[i])
    if i != len(vector)-1:
      style += ","
  style += "}\""

  print "drawing style: %s" % style

  command = "image_stylization_transform "
  command += "--num_styles=%d " % NUM_STYLES
  command += "--checkpoint=%s " % CHECKPOINT
  command += "--input_image=%s " % INPUT
  command += "--which_styles=%s " % style
  command += "--output_dir=%s " % OUTPUT_DIR
  command += "--output_basename=%s " % OUTPUT_BASENAME
  
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
             for stat, path in entries if (S_ISREG(stat[ST_MODE])) and os.path.basename(path).startswith(OUTPUT_BASENAME+"_"))  
  #NOTE: on Windows `ST_CTIME` is a creation date 
  #  but on Unix it could be something else
  #NOTE: use `ST_MTIME` to sort by a modification date
  
  num = 0
  for cdate, path in sorted(entries):
    print time.ctime(cdate), os.path.basename(path)
    os.rename(path, os.path.dirname(path) + "/" + OUTPUT_BASENAME + "_%04d.png" % num)
    num += 1

v1 = []
for i in range(NUM_STYLES):
  v1.append(0)
  
v2 = v1[:]
v3 = v1[:]
v4 = v1[:]

v1[5] = 1
v2[24] = 1
v3[31] = 1
v4[0] = 1

# draw_with_style(v1)
# morph_between_styles(v1, v2, 24)
# morph_between_styles(v2, v3, 24)
# morph_between_styles(v3, v4, 24)
# morph_between_styles(v4, v1, 24)
# 
# rename_files_by_date(OUTPUT_DIR)

### Downsample
os.system("mkdir %s/tmp_small" % OUTPUT_DIR)
os.system("cp %s/*.png %s/tmp_small" % (OUTPUT_DIR, OUTPUT_DIR))
os.system("sips -Z 400 %s/tmp_small/*.png" % OUTPUT_DIR)

### Animate
#os.system("convert -delay 5 -loop 0 %s/tmp_small/*.png %s/%s.gif" % (OUTPUT_DIR, OUTPUT_DIR, OUTPUT_BASENAME))
os.system("convert -delay 0 -loop 0 %s/tmp_small/*.png %s/%s.mov" % (OUTPUT_DIR, OUTPUT_DIR, OUTPUT_BASENAME))

### Remove tmp_small directory
os.system("rm -rf %s/tmp_small" % OUTPUT_DIR)

