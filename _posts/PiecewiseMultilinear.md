# PiecewiseMultilinear

提供一个多维的线性插值函数。数据需要从**data_file**中进行读取，

1. 空行和开头为#的将被忽略。
2. 所有的其他的都认为是有用信息。
3. 文件开头应该是网格文件关键字，比如AXIS X; AXIS  Z; 或者是AXIS T。
4. 要求以上数据是单调递增的，在所有的网格节点被设置好之后，最后一行必须是数据DATA。

```
AXIS X
AXIS Y
AXIS Z
AXIS T
DATA
```



```
# PiecewiseMultilinear function test in 3D with function depending on time

# This test  uses a function on the unit cube.
# For t<=3 the function is unity at (x,y,z)=(0,0,0) and zero elsewhere
# For t>=7 the function is unity at (x,y,z)=(1,1,1) and zero elsewhere

[Mesh]]
	type = GeneratedMesh
	dim = 3
	xmin = 0
	xmax = 1
	nx = 2
	ymin = 0
	ymax = 1
	ny = 2
	zmin = 0
	zmax = 1
	nz = 2
[]

[Variabels]
	[dummy]
	[]
[]

[Kernels]
	[dummy_kernels]
		type = TimeDerivative
		variable = dummy
	[]
[]

[AuxVariables]
	[f]
	[]
[]

[AuxKernels]
	[f_AuxK]
		type = FunctionAux
		functio = fourDa
		variable = f
	[]
[]

[Functions]
	[fourDa]
		type = PiecewiseMultilinear
		data_file = fourDa.txt
	[]
[]

[Executioner]
	type = Transient
	dt = 1
	end_time = 10
[]

[Outputs]
	file_base = fourDa
	exodus = true
	hide = dummy
[]
```

## except1.i

```C++
# PiecewiseMultilinear function exception test
# Data file does not exist

[Mesh]
	type = GeneratedMesh
	dim = 1
	xmin = 0
	xmax = 2
	nx = 1
[]

[Variables]
	[dummy]
	[]
[]

[Kernels]
	[dummy_u]
		type = TimeDerivative
		variable = dummy
	[]
[]

[AuxVaraialbes]
	[f]
	[]
[]

[AuxKernels]
	[f_auxK]
		type =.FunctionAux
		variabel = f
		function = execpt1_fcn
	[]
[]

[Functions]
	[except1_fn]
		type = PiecewiseMultilinear
		data_file = except1.txt
	[]
[]

[Executioner]
	type = Transient
	dt = 1
	end_time = 1
[]

[Outputs]
	execute_on = 'timestep_end'
	file_base = except1
	hide = dummy
	csv = true
[]
```

## except2.i

```C++
# PiecewiseMultiliner function exception test
# Grid is not monotonic

[Mesh]
	type = GeneratedMesh
	dim = 1
	xmin = 0
	xmax = 2
	nx = 1
[]

[Variables]
	[dummy]
	[]
[]

[kernels]
	[dummy_u]
		type = TimeDerivative
		variable = dummy
	[]
[]

[AuxVariables]
	[f]
	[]
[]

[AuxKernels]
	[f_auxK]
		type = FunctionAux
		variable = f
		function = except_fcn
	[]
[]

[Functions]
	[except_fn]
		type = PiecewiseMultilinear
		data_file = except2.txt
	[]
[]

[Executioner]
	type = Transient
	dt = 1
	end_time = 1
[]

[Outputs]
	execute_on = 'timestep_end'
	hide = dummy
[]
```

用于处理某一个轴的变量是不是递增的

## except3.i

```C++
#PiecewiseMultilinear function exception test
# Incorrect number of data pointts

[Mesh]
	type = GeneratedMesh
	dim = 1
	xmin = 0
	xmax = 2
	nx = 1
[]

[Variables]
	[dummy]
	[]
[]

[Kernels]
	[dummy_u]
		type = TimeDerivative
		variable = dummy
	[]
[]

[AuxVariables]
	[f]
	[]
[]

[AuxKernels]
	[f_auxK]
		type = FunctionAux
		variable = f
		function = except3_fcn
	[]
[]

[Functions]
	[except3_fcn]
		type = PiecewiseMultilinear
		data_file = except3.txt
	[]
[]

[Executioner]
  type = Transient
  dt = 1
  end_time = 1
[]
    
[Outputs]
   execute_on = 'timestep_end'
   hide = dummy
[]
```

用于测试Data数量多于输入点。

## except4.i

```C++
#PiecewiseMultilinear fuction exception test
# AXIS X encountered more than once

[Mesh]
	type = GeneratedMesh
	dim = 1
	xmin = 0
	xmax = 2
	nx = 1
[]

[Variables]
	[dummy]
	[]
[]

[Kernels]
	[dummy_u]
		type = TimeDerivative
		variable = dummy
	[]
[]

[AuxVariables]
	[f_auxK]
		type = FunctionAux
		variable = f
		function = except4_fcn
	[]
[]

[Functions]
	[except4_fcn]
		type = PiecewiseMultilinear
		data_file = except4.txt
	[]
[]

[Executioner]
	type = Transient
	dt = 1
	end_time = 1
[]

[Outputs]
	execute_on = 'timeste_end'
	hide = dummy
[]
```

用于测试X轴方向的输入多于一个。

## except5.i

```
# PiecewiseMultilinear function exception test
# NO valid AXIS lines in the data_file

[Mesh]
	type = GeneratedMesh
	dim = 1
	xmin = 0
	xmax = 2
	nx = 1
[]

[Variables]
	[dummy]
	[]
[]

[Kernels]
	[dummy_u]
		type = TimeDerivative
		variable = dummy
	[]
[]

[AuxVariables]
	[f]
	[]
[]

[AuxKernels]
	[f_auxK]
		type = FunctionAux
		variable = f
		function = except5_fcn
	[]
[]

[Functions]
	[except5_fcn]
		type = PiecewiseMultilinear
		data_file = except5.txt
	[]
[]
```

用于测试，如果输入不对的轴的命名。

## oneDa.i

```C++
# PiecewiseMultilinear function tests in 1D
# See [Functions] block for a description of the tests
# All tests yield variable = 1 everywhere, so they are compared using postprocessors

[Mesh]
	type = GeneratedMesh
	dim = 1
	xmin = 0
	xmax = 2
	nx = 10
[]

[Variables]
	[dummy]
	[]
[]

[Kernels]
	[dummy_u]
		type = TimeDerivative
		variable = dummy
	[]
[]

[AuxVariables]
	[end1_var]
	[]
	
	[end2_var]
	[]
	
	[end3_var]
	[]
	
	[end4_var]
	[]
	
	[one_pt1_var]
	[]
	
	[one_pt2_var]
	[]
	
	[one_pt3_var]
	[]
	
	[other_axis1_var]
	[]
	
	[other_axis2_var]
	[]
	
	[other_axis3_var]
	[]
[]


[AuxKernels]
	[end1_auxK]
		type = FunctionAux
		variable = end1_var
		function = end1_fcn
	[]
	
	[end2_auxK]
		type = FunctionAux
		variable = end2_var
		function = end2_fcn
	[]
	
	[end3_auxK]
		type = FunctionAux
		variable = end3_var
		function = end3_fcn
	[]

	[end4_auxK]
		type = FunctionAux
		variable = end4_var
		function = end4_fcn
	[]
	
	[one_pt1_auxK]
		type = FunctionAux
		variable = one_pt1_var
		function = one_pt1_fcn
	[]
	
	[one_pt2_auxK]
		type = FunctionAux
		variable = one_pt2_var
		function = one_pt2_fcn
	[]
	
	[one_pt3_auxK]
		type = FunctionAux
		variable = one_pt3_var
		function = one_pt3_fcn
	[]
	
	[other_axis1_auxK]
		type = FunctionAux
		variable = other_axis11_var
		function = other_axis1_fcn
	[]
	
	[other_axis2_auxK]
		type = FunctionAux
		varaible = other_axis2_var
		function= other_axis2_fcn
	[]
[]

[Functions]
	# the result (which is unity) that all the functions should yiels
	[answer_fcn]
		type = ConstantFunction
		value = 1
	[]
	# Function that is 1 for all x>0, due to data only being defined on x<0
	[end1_fcn]
		type = PiecewiseMultilinear
		data_file = end1.txt
	[]
	
	# Function that 1 for all x>=0, due to data only being defined on x<=0
	[end2_fcn]
		type = PiecewiseMultilinear
		data_file = end2.txt
	[]
	
	# Function that is 1 for all x<=2, due to data only being defined on x>2
	[end3_fcn]
		type = PiecewiseMulitilinear
		data_file = end3.txt
	【】
	
	# Function that is 1 for all x<=2, due to data only being defined on x>=2
	[end4_fcn]
		type = PiecewiseMultilinear
		data_file = end4.txt
	[]
	
	# Function that is 1 for all x, due to only one point being defined on X at x=2
	[one_pt1_fcn]
		type = PiecewiseMultilinear
		data_file = one_pt1_fcn
	[]
	
	# Function that is 1 for all x, due to only one point being defined on X at x= 1
	[one_pt2_fcn]
		type = PiecewiseMultilinear
		data_file = one_pt2_fcn
	[]
	
	# Function that is 1 for all x, due to only one point being defined on X at x= -1
	[one_pt3_fcn]
		type = PiecewiseMultilinear
		data_file = one_pt3_fcn
	[]
	
	# Function that is 1 for all x, and data is defined on Y axis only
	[other_axis1_fcn]
		type = PiecewiseMultilinear
		data_file = other_axis1.txt
	[]
	
	# Function that is 1 for all x, and data is denfined on T axis only for t>=1
	[other_axis2_fcn]
		type = PiecewiseMultilinear
		data_file = other_axis2.txt
	[]
	
	#Function that is 1 for all x, and data taht is unity and defined on T axis for -1<=t<=1
	[other_axis3_fcn]
		type = PiecewiseMultilinear
		data_file = other_axis3.txt
	[]
[]

[Postprcoessors]
	[end1_pp]
		type = NodaulL2Error
		function = answer_fcn
		variable = end1_var
	[]
	
	[end2_pp]
		type = NodaulL2Error
		function = answer_fcn
		varaible = end2_var
	[]
	
	[end3_pp]
		type = NodaulL2Error
		function = anser_fcn
		variable = end3_var
	[]
	
	[one_pt1_pp]
		type = NodaulL2Error
		function = answer_fcn
		variable = one_pt1_var
	[]
	
	[ont_pt2_pp]
		type = NodalL2Error
		function = answer_fcn
		variable = one_pt2_var
	[]
	
	[ont_pt3_pp]
		type = NodalL2Error
		function = answer_fcn
		varaible = one_pt3_var
	[]
	[other_axis1_pp]
		type = NodalL2Error
		function = answer_fcn
		varaible = other_axis1_var
	[]
	
	[other_axis2_pp]
		type = NodalL2Error
		function = answer_fcn
		varaible = other_axis2_var
	[]
	[other_axis3_pp]
		type = NodalL2Error
		function = answer_fcn
		variable = other_aixs3_var
	[]
[]

[Executioner]
	type = Transient
	dt = 0.5
	end_time = 1
[]

[Outputs]
	execute_on = 'timestep_end'
	file_base = oneDa
	hide = dummy
	exodus = false
	csv = true
[]
```

