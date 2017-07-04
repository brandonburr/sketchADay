#!/bin/bash

# Using (magenta) environment

CKPT=~/git/magenta_files/multistyle-pastiche-generator-varied.ckpt
INPUT=~/git/magenta_files/paul.jpg
OUT_DIR=~/git/magenta_files/output/paul_0_24
OUT_BASE="paul_varied"

### Stylize
#for i in 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31
for i in 0.001 0.05 0.1 0.15 0.2 0.25 0.3 0.35 0.4 0.45 0.5 0.55 0.6 0.65 0.7 0.75 0.8 0.85 0.9 0.95 0.999
do
    STYLE="{0:$i,24:`echo '1-'$i | bc`}"
    echo $STYLE
    image_stylization_transform \
        --num_styles=32 \
        --checkpoint=$CKPT \
        --input_image=$INPUT \
        --which_styles=$STYLE \
        --output_dir=$OUT_DIR \
        --output_basename=$OUT_BASE
done

### Downsample
mkdir $OUT_DIR/small
cp $OUT_DIR/*.png $OUT_DIR/small
sips -Z 250 $OUT_DIR/small/*.png

### Animate
convert -delay 5 -loop 0 -reverse -duplicate 1,-2-1 $OUT_DIR/small/*.png $OUT_DIR/small/animated.gif

