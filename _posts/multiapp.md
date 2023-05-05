<center>multiapps</center>

# atuo_diff_auto_scaling

***

main.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 10
	ny = 10
[]

[Variables]
	[u]
	[]
[]

[Kernels]
	[diff]
		type = ADDiffusion
		variable = u
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = right
		value = 0
	[]
	[right]
		type = FunctionDirichletBC
		variable = u
		boundary = right
		function = 't'
	[]
[]

[Precondtioning]
	[smp]
		type = SMP
		full = true
	[]
[]

[Executioner]
	type = Transient
	num_steps = 2
	solve_type = 'Newton'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
	automatic_scaling = true
	verbose = true
[]

[Outputs]
	exodus = true
[]

[MultiApps]
	[sub_app]
		type = TransientMultiApp
		app_type = MooseTestApp
		input_files = 'sub.i'
		positiosn = '0 0 0'
	[]
[]
```

Sub.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 10
	ny = 10
[]

[Variables]
	[u]
	[]
[]

[Kernels]
	[diff]
		type = ADDiffusion
		variable = u
	[]
[]

[BCs]
	[left]
		type = ADDiffusion
		variable = u
	[]
	[right]
		type = FunctionDirichletBC
		variable = u
		boundary = right
		function = 't'
	[]
[]

[Preconditioning]
	[smp]
		type = SMP
		full = true
	[]
[]

[Exectutioner]
	type = Transient
	num_steps = 2
	solve_tyep = 'Newton'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
	automaic_scaling = true
	verbose = true
[]

[Outputs]
	exodus = true
[]
```

只是计算两个不同的app，没有数据之间的传递。