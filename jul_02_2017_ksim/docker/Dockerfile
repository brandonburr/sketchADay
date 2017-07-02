FROM ermaker/keras

RUN conda install -y \
    jupyter \
    matplotlib \
    seaborn 

RUN pip install --ignore-installed --upgrade https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-1.2.0-cp27-none-linux_x86_64.whl

RUN conda install -y scikit-learn

RUN conda install -c anaconda -y pillow=3.4.1

RUN conda install -c conda-forge librosa

RUN conda install -c mutirri -y blessings=1.6

RUN conda install -c conda-forge tqdm=4.14.0


# Commands we might need to run to fix some stupid issue.
# Error message:
#   Intel MKL FATAL ERROR: Cannot load libmkl_avx2.so or libmkl_def.so
RUN conda install nomkl numpy scipy scikit-learn numexpr
RUN conda remove mkl mkl-service



RUN pip install python-igraph



# Use theano rather than tensorflow backend
#RUN sed -i 's/tensorflow/theano/g' $HOME/.keras/keras.json



# Convert t-SNE points to a grid using RasterFairy
RUN git config --global http.sslVerify false && \
    pip install git+https://github.com/Quasimondo/RasterFairy && \
    git config --global http.sslVerify true
