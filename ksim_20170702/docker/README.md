## Running the container

With docker installed and the docker daemon running, execute the following from inside the repo:

```bash
docker build . -t ml4a
```

Once the container has successfully built, you can launch it with:

```bash
./run.sh
```

A Jupyter Notebook should now be running inside of the docker container, accessible from your host machine at `http://localhost:8888`.

If that port is already occupied, you may receive an error from the `run.sh` script. You can easily switch the port published to the docker instance like so:

```bash
JUPYTER_PORT=1337 ./run.sh # visit at http://localhost:1337 instead
```

## Running the notebook

1. Before you run the notebook, you'll need to populate the `source_images` folder with all the photos you'll want in the collage. These can be nested in arbitrary sub-folders; the notebook will scrape through and harvest anything with a .jpg, .jpeg, or .png suffix.
2. From the Jupyter page in your browser, click on `hedgehog_collage.ipynb` to open the notebook.
3. Change the collage parameters as desired.
4. Run through the notebook a cell at a time, or select `Run All` from the `Cell` menu.

