---
title: "Running CESM1.2.1 on SNOW at UAlbany"
layout: post
use_math: true
---

This is based on [Brian Rose's tutorial for ATM 623](http://www.atmos.albany.edu/facstaff/brose/classes/ATM623_Spring2017/2017/03/16/CESM-tutorial.html), as well as [Yuan-Jen Lin's notes](https://hackmd.io/@yuanjenlin/CESM_on_SNOW).
## Environment setup

Log into the head node:

```
ssh <NetID>@headnode7.arcc.albany.edu
```
  
Add the following line to the `.cshrc` file in your home directory (if this file does not exist, create it). You will only need to do this once:

```
setenv CCSMROOT /network/rit/home/br546577/roselab_rit/cesm/cesm1_2_1
```

The environment variable `$CCSMROOT` now points to CESM source code.

Create a directory that will hold the case directories and `cd` into it.

## Case setup

Running the following line (with a descriptive name replacing `<casename>`) will
create the case directory for a CESM run with
- the `E_1850_CAM5_CN` compset (slab ocean, pre-industrial conditions, CAM5 physics, carbon-nitrogen biogeochemistry) and 
- the `f19_g16` resolution (2º finite volume for the atmosphere, 1º displaced-pole grid for the ocean and sea ice).

```
/network/rit/lab/roselab_rit/cesm/cesm1_2_1/scripts/create_newcase -mach snow -compset E_1850_CAM5_CN -res f19_g16 -case <casename>
```

For other configurations, see the lists of supported [compsets](https://www.cesm.ucar.edu/models/cesm1.2/cesm/doc/modelnl/compsets.html) and 
[grids](https://www.cesm.ucar.edu/models/cesm1.2/cesm/doc/modelnl/grid.html)

Now `cd` into `<casename>`. To change the number of nodes that the job will run on, 
change `NTASKS` for each component in `env_mach_pes.xml` such that 
$\mathrm{NTASKS}=32\times\mathrm{NODES}$. For example, if you want to run on 4 nodes, use:

```
./xmlchange NTASKS_ATM=128
./xmlchange NTASKS_LND=128
./xmlchange NTASKS_ICE=128
./xmlchange NTASKS_OCN=128
./xmlchange NTASKS_CPL=128
./xmlchange NTASKS_GLC=128
./xmlchange NTASKS_ROF=128
./xmlchange NTASKS_WAV=128
```

The default is 64 (2 nodes). Then run 

```
./cesm_setup
```

More details on case setup can be found in [chapter 2 of the CESM1.2 User's Guide](https://www2.cesm.ucar.edu/models/cesm1.2/cesm/doc/usersguide/c513.html).

## Runtime options

The settings that control how the model runs are found in the file `env_run.xml`.
You can either edit the file directly or use `./xmlchange`. Use `./xmlquery` to see 
the current setting.

One common thing to change is the simulation length. For example:

```
./xmlchange STOP_OPTION=nyears
./xmlchange STOP_N=2
./xmlchange RESUBMIT=9
```

This runs the model for $\mathrm{STOP_N}(1+\mathrm{RESUBMIT})=20$ years in 
`STOP_N`-year chunks. If the cluster is busy, this allows others to run their jobs
between our resubmissions. SNOW has a 12-hour time limit, so make sure each job does not
go over that. See the benchmarking at the end of this document. 
If you use another compset, you may want to do some benchmarking yourself.

The output files are monthly by default, so running the model for less than a month won't write any output. To change the 
output frequency, [see this section of the User's Guide](https://www2.cesm.ucar.edu/models/cesm1.2/cesm/doc/usersguide/x2172.html).

Optionally change CO$_2$ and other stuff in `user_nl_cam` or the other `user_nl`
files. For example, add the following line to `user_nl_cam` for a 2xCO2 
(from pre-industrial) experiment:

```
co2vmr = 569.4e-6
```

You may want to uncomment and edit the email notification lines in `<casename>.run`
to be notified when the job ends.

### Slab ocean model

If you are running the SOM (as in compset E), copy the forcing file into `/data/rose_scr/cesm_inputdata/ocn/docn7/SOM`,
and back in the case directory run

```
./xmlchange DOCN_SOM_FILENAME=<forcingfilename>.nc
```

There are many SOM forcing files already there, so for example, if you want a piControl run, you can use 

```
./xmlchange DOCN_SOM_FILENAME=pop_frc.b.e11.B1850C5CN.f19_g16.130429.nc
```

### Additional required changes

In `<casename>.run`, change the value of `--mem` from `MaxMemPerNode` to some value
(the max seems to be 128G). 

If you did not change `NTASKS` (because you wanted to use 2 nodes), 
you may notice in `<casename>.run` that `--nodes=1`. Change it to 2 and remove the
`-O` option that should be under the two `--mail` lines. As far as I know,
that enables [hyper-threading](https://en.wikipedia.org/wiki/Hyper-threading),
allowing one node (core) to be treated as two. I don't recommend this (see below)
unless you do some benchmarking and find that it works better for you.

For now, you also need to add the following line to `env_mach_specific` for the Intel
compiler to work:

```
source /network/rit/lab/snowclus/modules/latest.csh
```

## Building the model

### Users outside the Rose group

First you need to decide where to keep the executable files. 
If you look in `env_build.xml`, you will find the following line:

```
<entry id="EXEROOT"   value="/data/rose_scr/$CCSMUSER/cesmruns/$CASE/bld"  />
```

This variable `EXEROOT` determines where the model will be built. 
By default it will look for a directory within `/data/rose_scr/`. 
This will only work if you have write access to `/data/rose_scr/`, 
which is probably only true if you are part of the Rose research group. 
If not, you will need to set this to somewhere within your own group's scratch
space.

For example, if you are part of the Zhou group, you could do this:

```
./xmlchange EXEROOT=/data/zhou_scr/$CCSMUSER/cesmruns/$CASE/bld
```

At the same time you should also set the run directory `RUNDIR` (where the output
files will be written). Usually this would be another subdirectory alongside the
build:

```
./xmlchange RUNDIR=/data/zhou_scr/$CCSMUSER/cesmruns/$CASE/run
```

### All users

Change the short-term archive directory (in `env_run.xml`) to somewhere 
you know you have write permissions with

```
./xmlchange DOUT_S_ROOT=<directory>
```

This is where you will access the output. By default, the directory is

```
/network/rit/lab/roselab_rit/cesm_archive/<casename>
```

but, for example, I did not have write permissions there and had to change it to
somewhere I did:

```
/network/rit/lab/roselab_rit/rford/cesm_archive/<casename>
```

Then build the model with the following line:

```
srun -p snow ./<casename>.build
```

This will take some time: about 20 and 30 minutes for the E and B compsets I ran. 
If the build time is very quick (i.e. a few seconds), then the run 
configuration is probably messed up, and the job will not be able to be submitted. 

## Submit the job

Finally, submit the job with

```
./<casename>.submit
```

You can check the queue, see node info, or cancel the job with 

```
squeue
sinfo
scancel <JOBID>
```

## Benchmarking

| Compset        | Grid    | NTASKS | Nodes  | Sim length | Run time (h:mm) |
|----------------|---------|--------|--------|------------|-----------------|
| E_1850_CAM5_CN | f19_g16 | 64     | 2      | 1 year     | 5:13            |
| E_1850_CAM5_CN | f19_g16 | 128    | 4      | 1 year     | 3:24            |
| E_1850_CAM5_CN | f19_g16 | 256    | 8      | 1 year     | 2:10            |
| B_1850         | f19_g16 | 64     | 1 (HT) | 1 month    | 7:46 (!)        |
| B_1850         | f19_g16 | 64     | 2      | 1 month    | 0:14            |
| B_1850         | f19_g16 | 128    | 4      | 1 month    | 0:11            |

Run times vary for each resubmission, though not by much. 
The times in this table are generally the maximum.
I'm pretty sure run time is proportional to simulation length,
so to compare runs of different length, multiply accordingly.
