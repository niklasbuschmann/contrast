<center>MultiApp</center>
# coord_transform

## both-transformed

### copy

Main-app.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	xmin = 0
	xmax = 1
	ymax = 1
	ymin = -1
	nx = 10
	ny = 10
	alpha_rotation = 90
[]

[Variables]
	[u][]
[]

[AuxVariables]
	[v][]
	[v_elem]
		order = CONSTANT
		family = MONOMIAL
	[]
	[w][]
	[w_elem]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[ICs]
	[w]
		type = FunctionIC
		function = 'cos(x)*sin(y)'
		variable = w
	[]
	[w_elem]
		type = FunctionIC
		function = 'cos(x)*sin(y)'
		variable = w_elem
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
	[force]
		type = CoupledForce
		variable = u
		v = v
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'NEWTON'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomerang'
	verbose = true
[]

[Outputs]
	exodus = true
[]

[MultiApps]
	[sub]
		type = FullSolveMultiApp
		app_type = MooseTestApp
		positions = '0 0 0'
		input_files = 'sub-app.i'
		execute_on = 'timestep_begin'
	[]
[]

[Transfers]
	[from_sub]
		type = MutliAppCopyTransfer
		form_multi_app = sub
		source_variable = v
		variable = v
		execute_on = 'timestep_begin'
	[]
	[from_sub_elem]
		type = MultiAppCopyTransfer
		from_multi_app = sub
		source_variable = v_elem
		variable = v_elem
		execute_on = 'timestep_begin'
	[]
	
	[to_sub]
		type = MultiAppCopyTransfer
		to_multi_app = sub
		source_variable = w
		variable = w
		execute_on = 'timestep_begin'
	[]
	[to_sub_elem]
		type = MultiAppCopyTransfer
		to_multi_app = sub
		source_variable = w_elem
		variable = w_elem
		execute_on = 'timestep_begin'
	[]
[]
```

Sub-app.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	xmin = -1
	xmax = 0
	ymax = 1
	ymin = 0
	nx = 10
	ny = 10
	alpha_rotation = -90
[]

[Variables]
	[v][]
[]

[AuxVariables]
	[v_elem]
		order = CONSTANT
		family = MONOMIAL
	[]
	[w][]
	[w_elem]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[AuxKernels]
	[v_elem]
		type = SelfAux
		v = v
		variable = v_elem
	[]
[]

[Kernels]
	[diff_v]
		type = Diffusion
		variable = v
	[]
[]

[BCs]
	[left_v]
		type = DirichletBC
		variable = v
		boundary = bottom
		value = 0
	[]
	[right_v]
		type = DirichletBC
		variable = v
		boundary = top
		value = 1
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'NEWTON'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]
```

运行出现错误。根据test中提示，错误原因mainApp和subApp不匹配，所以两者不能进行数据传递，需要使用```MooseAppCoordTransform```进行转换。

### interpolation

main-app.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	xmin = 0
	xmax = 1
	ymin = -1
	ymax = 0
	nx = 10
	ny = 10
	alpha_rotation = 90
[]
[Variables/u]
[]

[AuxVariables]
	[v][]
	[v_elem]
		order = CONSTANT
		family = MONOMIAL
	[]
	[w]
	[]
	[w_elem]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[ICs]
	[w]
		type = FunctionIC
		function = 'cos(x)*sin(y)'
		variable = w
	[]
	[w_elem]
		type = FunctionIC
		function = 'cos(x)*sin(y)'
		variable = w_elem
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable =u
	[]
	[force]
		type = CoupledForce
		variable = u
		v = v
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'MEWTON'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
	verbose = true
[]
[Outputs]
	exodus = true
[]

[MultiApps]
	[sub]
		type = FullSolveMultiApp
		app_type = MooseTestApp
		positions = '0 0 0'
		input_files = 'sub-app.i'
		execute_on = 'timestep_begin'
	[]
[]

[Transfers]
	[from_sub]
		type = MultiAppGeomerticInterpolationTransfer
		from_multi_app = sub
		source_variable = v
		variable = v
		execute_on = 'timestep_begin'
	[]
	[from_sub_elem]
		type = MultiAppGeomerticInterpolationTransfer
		from_multi_app = sub
		srource_variable = v_elem
		variable = v_elem
		execute_on = 'timestep_begin'
	[]
	[to_sub]
		type = MultiAppGeometricInterpolationTransfer
		to_multi_app = sub
		source_variable = w
		execute_on = 'timestep_begin'
	[]
[]
```

**MulitiAppGeomerticInterpolationTransfer**将最近的source上的网格节点上的数据使用网格差值的方式传递到目标面上，包含使用的位移(displaced).也可以对non-overlapping的部分采用外推的方法**MultiAppShapeEvaluationTransfer**不能外推只能用于整个相同的domains。完全相同的不建议使用，因为采用的是三个点进行设置差值，由于并行和拆解会导致点对点的传输出现差别。这个过程可以采用num_points=4来进行设置改善。

 sub-app.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	xmin = -1
	xmax = 0
	ymin = 0
	ymax = 1
	nx = 10
	ny = 10
	alpha_rotation = -90
[]

[Variables]
	[v][]
[]

[AuxVariables]
	[v_elem]
		order = CONSTANT
		family = MONOMIAL
	[]
	[w][]
	[w_elem]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[AuxKernels]
	[v_elem]
		type = SelfAux
		v = v
		variable = v_elem
	[]
[]

[Kernels]
	[diff_v]
		type = Diffusion
		variable = v
	[]
[]

[BCs]
	[left_v]
		type = DirichletBC
		variable = v
		boundary = left
		value = 0
	[]
	[right_v]
		type = DirichletBC
		varialble = v
		boundary = top
		value = 1
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'NEWTON'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre bomeramg'
[]

[Outputs]
	exodus = true
[]
```

**SelfAux**是如在提供v的时候就将变量=v，没有就是v=v本身。

### mesh-function

 main-app.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	xmin = 0
	xmax = 1
	ymin = -1
	ymax = 0
	nx = 10
	ny = 10
	alpha_rotation = 90
[]

[Variables]
	[u][]
[]

[AuxVariables]
	[v][]
	[v_elem]
		order = CONSTANT
		family = MONOMIAL
	[]
	[w][]
	[w_elem]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[ICs]
	[w]
		type = FunctionIC
		function = 'cos(x)*sin(y)'
		variable = w
	[]
	[w_elem]
		type = FunctionIC
		function = 'cos(x)*sin(y)'
		variable = w_elem
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
	[force]
		type = CoupledForce
		variable = u
		v = v
	[]
[]

[BCs]
	[left]
		type = DiricheltBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'NEWTON'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
	verbase = true
[]

[Outputs]
	exodus = true
[]

[MultiApps]
	[sub]
		type = FullSolveMultiApp
		app_type = MooseTestApp
		poistions = '0 0 0'
		input_files = 'sub-app.i'
		execute_on = 'timestep_begin'
	[]
[]

[Transfer]
	[from_sub]
		type = MultiAppShapeEvaluationTransfer
		from_multi_app = sub
		source_variable = v
		variable = v
		execute_on = 'timestep_begin'
		error_on_miss = true
		#extend the bounding box slightly since a transformed node may miss the bounding box by machine precision
		bbox_factore = 1.1
	[]
	[from_sub_elem]
		type = MultiAppShapeEvaluationTransfer
		from_multi_app = sub
		source_variable = v_elem
		variable = v_elem
		execute_on = 'timestep_begin'
		error_on_miss = true
	[]
	[to_sub]
		type = MultiAppShapeEvaluationTransfer
		to_multi_app = sub
		source_variable = w
		variable = w
		execute_on = 'timesetp_begin'
		error_on_miss  = true
		bbox_factor = 1.1
	[]
	[to_sub_elem]
		type = MultiAppShapeEvaluationTransfer
		to_multi_app = sub
		source_variable = w_elem
		variable = w_elem
		execute_on = 'timestep_begin'
		error_on_miss = true
	[]
[]
```

Sub-app.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	xmin = -1
	xmax = 0
	ymin = 0
	ymax = 1
	nx = 10
	ny = 10
	alpha_rotation = -90
[]
[Variables]
	[v][]
[]

[AuxVariables]
	[v_elem]
		order = CONSTANT
		family = MONOMIAL
	[]
	[w][]
	[w_elem]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[AuxKernels]
	[v_elem]
		type = SelfAux
		v = v
		variable = v_elem
	[]
[]

[Kernels]
	[diff_v]
		type = Diffusion
		variable = v
	[]
[]

[BCs]
	[left_v]
		type = DirichletBC
		variable = v
		boundary = bottom
		value = 0
	[]
	[right_v]
		type = DirichletBC
		variable = v
		boundary = top
		value = 1
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'NEWTON'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]
```

### pp_interpolation

### projection

### user_object

## rz-xyz



#from_full_solve
parent.i
```
[Mesh]
  type = GeneratedMesh
  dim = 2
  nx = 10
  ny = 10
# This test currently diffs when run in parallel with DistributedMesh enabled,
# most likely due to the fact that CONSTANT MONOMIALS ara currently not written
# out currectly in this case.
  parallel_type = replicated
[]

[Variables]
  [u]
  []
[]

[AuxVariables]
  [from_full]
  []
[]

[Kernels]
  [diff]
    type = Diffusion
    variable = u
  []
[]

[BCs]
  [left]
    type = DirichletBC
    variable = u
    boundary = left
    value = 0
  []
  [right]
    type = DirichletBC
    variable = u
    boundary = right
    value = 0
  []
[]

[Executioner]
  type = Steady
  solve_type = 'PJFNK'
  petsc_options_iname = '-pc_type -pc_hypre_type'
  petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
  exodus = true
[]

[MultiApps]
  [full_solve]
    type = FullSolveMultiApp
    app_type = MooseTestApp
    executioner = initial
    positions = '0 0 0'
    input_files = sub.i
  []
[]

[Transfers]
  [from_full]
    type = MultiAppNearestNodeTransfer
    from_multi_app = full_solve
    source_variable = u
    variable = from_full
  []
[]
```
sub.i
```
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
    type = Diffusion
    variable = u
  []
  [td]
    type = TimeDerivative
    variable = u
  []
[]

[BCs]
  [left]
    type = DirichletBC
    variable = u
    boundary = left
    value = 0
  []
  [right]
    type = DirichletBC
    variable = u
    boundary = right
    value = 1
  []
[]

[Executioner]
  type = Transient
  num_steps = 5
  dt = 0.01
  solve_type = 'PJFNK'
  petsc_options_iname = '-pc_type -pc_hypre_type'
  petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
  exodus = true
[]
```

from_full is the last setp of sub.i.
#general_field
##nearest_node
###between
main_between_multiapp.i
```
[Problem]
  solve = false
[]

[Mesh]
  type = GeneratedMesh
  dim = 2
[]

# maybe lack ma1?
[Multiapp/ma2]
  type = TransientMultiApp
  input_files = sub_between_diffusion2.i
[]

[Transfers]
  [app1_to_2_nodal_nodal]
    type = MultiAppGeneralFieldNearestNodeTransfer
    from_multi_app = ma1
    to_multi_app = ma2
    source_variable = sent_nodal
    variable = received_nodal
  []
  [app2_to_1_nodal_nodal]
    type = MultiAppGeneralFieldNearestNodeTransfer
    from_multi_app = ma2
    to_multi_app = ma1
    source-variable = sent_nodal
    variable = received_nodal
  []
  [app1_to_2_elem_elem]
    type = MultiAppGeneralFieldNearestNodeTransfer
    from_multi_app = ma2
    to_multi_app = ma1
    source_variable = sent_elem
    variable = received_elem
  []
  [app2_to_1_elem_elem]
    type = MultiAppGeneralFieldNearestNodeTransfer
    from_multi_app = ma2
    to_multi_app = ma1
    source_variable = sent_elem
    variable = received_elem
  []

  [app1_to_2_elem_nodal]
    type = MultiAppGeneralFieldNearestNodeTransfer
    from_multi_app = ma1
    to_multi_app = ma2
    source_variable = sent_elem
    variable = received_nodal
  []
  [app2_to_1_elem_nodal]
    type = MultiAppGeneralFieldNearestNodeTransfer
    from_multi_app = ma2
    to_multi_app = ma1
    source_variable = sent_elem
    variable = received_nodal
  []

  [app1_to_2_nodal_elem]
    type = MultiAppGeneralFieldNearestNodeTransfer
    from_multi_app = ma1
    to_multi_app = ma2
    source_variable = sent_nodal
    variable = received_elem
  []
  [app2_to_1_nodal_elem]
    type = MultiAppGeneralFieldNearestNodeTransfer
    from_multi_app = ma2
    to_multi_app = ma1
    source_variable = sent_nodal
    variable = received_elem
  []

  [Executioner]
    type = Transient
    num_steps = 1
  []
```
sub_between_diffusion1.i
```
[Mesh]
  [gen]
    type = GeneratedMeshGenerator
    dim = 2
    nx = 5
    ny = 5
  []
  [block1]
    input = gen
    type = SubdomainBoundingBoxGenerator
    block_id = 1
    bottom_left = '0 0 0'
    top_right = '0.5 0.5 0'
  []
[]

[AuxVariables]
  [sent_nodal]
    [InitialCondition]
      type = FunctionIC
      function = '1 + 2*x*x + 3*y*y*y'
    []
  []
  [received_nodal]
    initial_condition = -1
  []
  [sent_elem]
    family = MONOMIAL
    order = CONSTANT
    [InitialCondition]
      type = FunctionIC
      function = '2 + 2*x*x + 3*y*y*y'
    []
  []
  [received_elem]
    family = MONOMIAL
    order = CONSTANT
    initial_condition = -1
  []
[]

[Executioner]
  type = Transient
  num_steps = 1
[]

[Problem]
  solve_type = false
[]

[Outputs]
  exodus = true
  hide = 'sent_nodal sent_elem'
  execute_on = 'TIMESTEP_END'
[]
```
sub_between_diffusion2.i
```
[Mesh]
  [gen]
    type = GeneratedMeshGenerator
    dim = 2
    nx = 3
    ny = 3
    xmin = 0.1111
    ymin = 0.3333
    xmax = 1.21111
    ymax = 1.22222
  []
  [block1]
    input = gen
    type = SubdomainBoundingBoxGenerator
    block_id = 1
    bottom_left = '0.4 0.6 0'
    top_right = '2 2 0'
  []
[]

[AuxVariables]
  [sent_nodal]
    [InitialCondition]
      type = FunctionIC
      function = '3 + 2*x*x + 3*y*y*y'
    []
  []
  [received_nodal]
    initial_condition = -1
  []
  [sent_elem]
    family = MONOMIAL
    order = cONSTANT
    [InitialCondition]
      type = FunctionIC
      function = '4 + 2 *x*x + 3*y*y*y'
    []
  []

  [received_elem]
    family = MONOMIAL
    order = CONSTANT
    initial_condition = -1
  []
[]

[Executioner]
  type = Transient
  num_steps = 1
[]

[Problem]
  solve = false
[]

[Outputs]
  exodus = true
  hide = 'sent_nodal sent_elem'
  execute_on = 'TIMESTEP_END'
[]
```
###boundary

main.i
```
[Mesh]
  [gmg]
    type = GeneratedMeshGenerator
    dim = 3
    nx = 5
    ny = 5
    nz = 5
  []

  [add_block]
    type = ParsedSubdomainMeshGenerator
    input = gmg
    combinatorial_geometry = 'x < 0.5 & y < 0.5'
    bolck_id = 1
  []

  [add_internal_sideset]
    type = SidesetsBetweenSubdoaminsGenerator
    input = add_block
    primary_block = 0
    paired_block = 1
    new_boundary = internal
  []
[]

[AuxVariables]
  [from_sub]
    initial_condition = -1
  []
  [from_sub_elem]
    order = CONSTANT
    family = MONOMIAL
    initial_condition = -1
  []
  [to_sub]
    [InitialCondition]
      type = FunctionIC
      function = '1 + 2*x*x + 3*y*y*y'
    []
  []
  [to_sub_elem]
    order = CONSTANT
    family = MONOMIAL
    [InitialCondition]
      type = FunctionIC
      function = '2 + 2*x*x + 3*y*y*y'
    []
  []
[]

[Executioner]
  type = Transient
  num_steps = 1
[]

[Problem]
  solve = false
  verbose_multiapps = true
[]

[Outputs]
  [out]
    type = Exodus
    hide = 'to_sub to_sub_elem'
    overwrite = true
  []
[]

[MultiApps]
  [sub]
    positions = '0.2222 0.00002 0.0001 0.61111 0.311111 0.31211 0.76666 0.111114 0.81111'
    type = TransientMUltiApp
    app_type = MooseTestApp
    input_files = sub.i
    execute_on = timestep_end
    output_in_position = true # Facilitates debugging
  []
[]

[Transfers]
  # boundary restictions are added in the tests specification
  [to_sub]
    type = MultiAppGeneralFieldNearestNodeTransfer
    to_multi_app = sub
    source_variable = to_sub
    variable = from_main
  []
  [to_sub_elem]
    type = MultiAppGeneralFieldNearestNodeTransfer
    from_multi_app = sub
    source_variable = to_sub_elem
    variable = from_main_elem
  []
  [from_sub]
    type = MultiAppGeneralFieldNearestNodeTransfer
    from_multi_app = sub
    source_variable = to_main
    variable = from_sub
  []
  [from_sub_elem]
    type = MultiAppGeneralFieldNearestNodeTransfer
    from_multi_app = sub
    source_variable = to_main_elem
    variable = from_sub_elem
  []
[]
```
sub.i
```C++
[Mesh]
  [gmg]
    type = GeneratedMeshGenerator
    dim = 3
    nx = 5
    ny = 5
    nz = 5
    xmax = 0.3
    ymax = 0.3
    zmax = 0.3
  []
  [add_block]
    type = ParsedSubdomainMeshGenerator
    input = gmg
    combinatorial_geometry = 'x > 0.22 & y < 0.23'
    block_id = 1
  []

  [add_internal_sideset]
    type = SidesetsBetweenSubdoaminsGenerator
    input = add_block
    primary_block = 0
    paired_block = 1
    new_boundary = internal
  []
[]

[AuxVariables]
  [from_main]
    initial_condition = -1
  []
  [from_main_elem]
    order = CONSTANT
    family = MONOMIAL
    initial_condition = -1
  []
  [to_main]
    [InitialCondition]
      type = FunctionIC
      function = '3 + 2*x*x + 3*y*y*y'
    []
  []

  [to_main_elem]
    order = CONSTANT
    family = MONOMIAL
    [InitialCondition]
      type = FunctionIC
      function = '4 + 2*x*x + 3*y*y*y'
    []
  []
[]

[Executioner]
  type = Transient
  num_steps = 1
[]

[Problem]
  solve = false
[]

[Outputs]
  [out]
    type = Exodus
    hide = 'to_main to_main_elem'
    overwrite = true
  []
[]
```
### 

### duplicated_nearest_node_tests

boundary_toparent_parent.i

```C++
[Mesh]
  type = GeneratedMesh
  dim = 2
  nx = 4
  ny = 4
  elem_type = QUAD8
[]

[Variables]
  [u]
    family = LAGRANGE
    order = FIRAT
  []
[]

[AuxVariables]
  [from_sub]
    family = lAGRANGE
    order = SECOND
  []
[]

[Kernels]
  [diff]
    type = Diffusion
    variable = u
  []
[]

[BCs]
  [top]
    type = DirichletBC
    variable = u
    boundary = top
    value = 2.0
  []
  [bottom]
    type = DirichletBC
    variable = u
    boundary = bottom
    value = 0.0
  []
[]

[Executioner]
  type = Transient
  num_steps = 1
  dt = 1
  solve_type = 'PJFNK'
  petsc_options_iname = '-pc_type -pc_hypre_type'
  petsc_options_value = 'hypre boomerang'
[]

[Outputs]
  exodus = true
[]

[MultiApps]
  [sub]
    type = TransientMultiApp
    app_type = MooseTestApp
    positions = '0 0 0'
    input_files = boundary_toparent_sub.i
  []
[]

[Transfers]
  [from_sub]
    type = MultiAppGeneralFieldnearestnodeTransfer
    from_multi_app = sub
    source_variable = u
    from_boundaries = 'right'
    to_boundaries = 'left'
    variable = from_sub
  []
[]
```

#multiapp_conservative_transfer

## parent_conservative_transfer.i

```C++
[Mesh]
  type = GeneratedMesh
  dim = 2
  nx = 20
  ny = 20
[]

[Variables]
  [u]
  []
[]

[Kernels]
  [diff]
  	type = Diffusion
  	variable = u
  []
 []
 
[BCs]
  [left]
 	type = DiricletBC
      variable = u
      boundary = left
      value = 0
   []
   
   [right]
   	 type = DirichletBC
     variable = u
     boundry = right
     value = 1
   []
 [Executioner]
 	type = Steady
 	solve_type = 'PJFNK'
 	petsc_options_iname = '-pc_type -pc_hypre_type'
 	petsc_options_vlaue = 'hypre boomeramg'
 []
 
 [MultiApps]
 	[sub]
 		type = FullSolveMultiApp
 		input_files = sub_conservative_transfer.i
 		execute_on = timestep_end
 	[]
 []
 
 [Postprocessors]
 	[from_postprocessor]
 		type = ElementIntegralVariablePostprocessor
 		variable = u
 	[]
 []
 
 [Transfers]
 	[to_sub]
 		type = MultiAppShapeEvalutaionTransfer
 		source_variable = u
 		variable = aux_u
 		to_mulit_app = sub
 		from_postprocessors_to_be_preserved = 'from_postprocessor'
 		to_postprocessors_to_be_preserved = 'to_postprocessor'
 	[]
 []
 
 [Outputs]
 	exodus = true
 	[console]
 		type = Console
 		execute_postprocessors_on = 'INITAL nolinear TIMESTEP_END'
 	[]
 []
```

> Transfer field data at the MultiApp position using solution the finite element function from the main/parent application, via a 'libMesh::MeshFunction' object.

需要注意的是这个Transfer已经可以通过**MultiAppGeneralFieldShapeEvaluationTransfer**来进行替代，后者更加灵活方便。

MultiAppShapeEvaluationTransfer非常复杂

```C++
//.h
#pragma once
#include "MultiAppConservativeTransfer.h"

class MultiAppShapeEvaluationTransfer : public MultiAppConservativeTransfer
{
  pulic:
  static InputParameters validParams();
  MutliAppShapeEvaluationTransfer(const InputParameters & parameters);
  virtual void execute() override;
  protected:
  unsigned int _var_size;
  bool _error_on_miss;
  private:
  void transferVariable(unsigned int i);
  bool userMooseAppCoordTransfrom() const override{return true;};
};
//.C
#include "MultiAppShapeEvaluationTransfer.h"
#include "DisplacedProblem.h"
#include "FEProblem.h"
#include "MooseMesh.h"
#include "MooseTypes.h"
#include "MooseVariableFE.h"
#include "MooseAppCoordTransfrom.h"
```

sub_conservative_transfer.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 20
	ny = 20
	xmin = 0.05
	xmax = 1.2
	ymin = 0.05
	ymax = 1.1
[]

[Variables]
	[u]
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
	[coupledforce]
		type = CoupledForce
		variable = u
		v = aux_u
	[]
[]

[AuxVariables]
	[aux_u]
		family = LAGRANEGE
		order = FIRST
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[Postprocessors]
	[to_postprocessor]
		type = ElementIntegralVariablePostprocessor
		variable = aux_u
		execute_on = 'transfer'
	[]
[]

[Problem]
	type = FEProblem
[]

[Executioner]
	type = Steady
	solve_type = 'PJFNK'
	nl_abs_tol = 1e-12
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]
```

对于to_postprocessors_to_be_preserved的解释是一个adjusting factor。难道是参与残差计算？不是很清楚。

## parent_nearest_point.i

```C++
[Mesh]
	[gen]
		type = GeneratedMeshGenerator
		dim = 2
    	xmax = 1
		ymax = 1
		nx = 10
		ny = 10
	[]
	[block1]
		inpute = gen
		type = SubdomainBoundingBoxGenerator
		block_id = 1
		bottom_left = '0.5 0 0'
		top_right = '1 1 0'
	[]
[]

[Variables]
	[power_density]
	[]
[]

[Functions]
	[pwr_func]
		type = ParsedFunction
		expression = '1e3*x*(1-x)+5e2'
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = power_density
	[]
	[coupledforce]
		type = BodyForce
		variable = power_density
		function = pwr_func
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = power_desnity
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = power_density
		boundary = right
		value = 1e3
	[]
[]

[AuxVariables]
	[from_sub]
	[]
[]

[VectorPostprocesors]
	[from_nearest_point]
		type = NearestPointIntegralVariablePostprocessor
		variable = power_density
		points = '0 0.5 0 1 0.5 0'
	[]
	[to_nearest_point]
		type = NearestPointIntegralVariablePostprocessor
		variable = from_sub
		points = '0 0.5 0 1 0.5 0'
		execute_on = 'transfer'
	[]
[]
[Executioner]
	type = Steady
	solve_type = 'PJFNK'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]
[MultiApps]
	[sub]
		type = FullSolveMultiApp
		input_files = sub_nearest_point.i
		positions = '0 0 0 0.5 0 0'
		execute_on = timestep_end
	[]
[]

[Transfers]
	[to_sub]
		type = MultiAppShapeEvaluationTransfer
		source_variable = power_density
		variable = from_parent
		to_multi_app = sub
		execute_on = timestep_end
	## the following inputs specify what postprocessors should be conserved
	# 1 NearestPointIntegralVariablePostprocessor is spcified on the parent
	# side with N points, where N is the number of subappps
	# 1 pp is specified on the subapp side
		from_postprocessors_to_be_preserved = 'from_nerest_point'
		to_postprocessors_to_be_preserved = 'from_parent_pp'
	[]
	[from_sub]
		type = MultiAppShapeEvaluationTransfer
		sorce_variable = sink
		variable = from_sub
		from_mulit_app = sub
		execute_on  = timestep_end
		to_postprocessors_to_be_preserved = 'to_nearest_point'
		from_postprocessors_to_be_preserved = 'sink'
	[]
[]

[Outputs]
	csv = true
	exodus = true
[]
```

sub_nearest_point.i

```C++
[Mesh]
	[gen]
		type = GeneratedMeshGenerator
		dim = 2
		xmin = 0.01
		xmax = 0.49
		ymax = 1
		nx = 10
		ny =10
	[]
	[block1]
		input = gen
		type = SubdomainBoundingBoxGenerator
		block_id = 1
		bottom_left = '0.2 0.2 0'
		top_right = '0.3 0.8 0'
	[]
[]

[Variables]
	[sink]
		family = MONOMIAL
		order = CONSTANT
	[]
[]

[Functions]
	[sink_func]
		type = ParsedFunction
		expression = '5e2*x*(0.55-x)+5e1'
	[]
[]

[Kernels]
	[reactor]
		type = Reaction
		variable = sink
	[]
	[coupledforce]
		type = BodyForce
		variable = sink
		function = sink_func
	[]
[]

[AuxVariables]
	[from_parent]
		block = 1
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'PJFNK'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[Postprocessors]
	[sink]
		type = ElementIntegralVariablePostprocessor
		block = 1
		variable = sink
	[]
	[from_parent_pp]
		type = ElementIntegralVariablePostprocessor
		block = 1
		variable = from_parent
		execute_on = 'transfer'
	[]
[]

[Outputs]
	exodus = true
	[console]
		type = Console
		execute_on = 'timestep_end timestep_begin'
	[]
[]
```

## parent_power_density.i

```C++
[Mesh]
	[gen]
		type = GeneratedMeshGenertor
		dim = 2
		xmax = 1
		ymax = 1
		nx = 10
		ny = 10
	[]
	[block1]
		inpute = gen
		type = SubdomainBoundingBoxGenerator
		block_id = 1
		bottom_left = '0.5 0 0'
		top_right = '1 1 0'
	[]
[]

[Variables]
	[power_density]
	[]
[]

[Functions]
	[pwr_func]
		type = ParsedFunction
		expression = '1e3*x*(1-x)+5e2'
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = power_density
	[]
	[coupledforce]
		type = BodyForce
		variable = power_density
		function = pwr_func
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = power_density
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		varialble = power_denisty
		boundary = left
		value = 0
	[]
[]
[AuxVariables]
	[from_sub]
	[]
[]

[Postprocessors]
	[pwr0]
		type = ElementIntegralVariablePostprocessor
		block = 0
		variable = power_density
	[]
	[pwr1]
		type = ElementIntegralVariablePostprocessor
		block = 1
		variable = power_density
	[]
	[from_sub0]
		type = ElementIntegralVariablePostprocessor
		block = 0
		variable = from_sub
		execute_on = 'transfer'
	[]
	[from_sub1]
		type = ElementIntegralVariablePostprocessor
		block = 1
		variable = from_sub
		exectue_on = 'transfer'
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'PJFNK'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomerang'
[]

[MultiApps]
	[sub]
		type = FullSolveMultiApp
		input_files = sub_power_density.i
		positions = '0 0 0 0.5 0 0'
		exectue_on = timestep_end
	[]
[]

[Transfers]
	[to_sub]
		type = MultiAppShapeEvaluationTransfer
		source_variable = power_density
		variable = from_parent
		to_multi_app = sub
		execute_on = timestep_end
		from_postprocessors_to_be_preserved = 'pwr0 pwr1'
		to_postprocessors_to_be_preserved = 'from_parent_pp'
	[]
	[from_sub]
		type = MultiAppShapeEvalutationTransfer
		souce_variable = sink
		varaible = from_sub
		from_mulit_app = sub
		execute_on = timestep_end
		to_postprocessors_to_be_preserved = 'from_sub0 from_sub1'
		from_postprocessors_to_be_preserved = 'sink'
	[]
[]

[Ouputs]
	exodus = true
[]
```

sub_power_density.i

```C++
[Mesh]
	[gen]
		type = GeneratedMeshGenerator
		dim = 2
		xmin = 0.01
		xmax = 0.49
		ymax = 1
		nx = 10
		ny = 10
	[]
	[block1]
		input = gen
		type = SubdomainBoundingBoxGenerator
		block_id = 1
		bottom_left = '0.2 0.2 0'
		top_right = '0.3 0.8 0'
	[]
[]

[Variables]
	[sink]
		type = MONOMIAL
		order = CONSTANT
	[]
[]

[Functions]
	[sink_func]
		type = ParsedFunction
		expression = '5e2*x*(0.5-x)+5e1'
	[]
[]

[Kernels]
	[reaction]
		type = Reaction
		variable = sink
	[]
	[coupledforce]
		type = BodyForce
		variable = sink
		function = sink_func
	[]
[]

[AuxVariables]
	[from_parent]
		block = 1
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'PJFNK'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value  = 'hypre boomeramg'
[]

[Postprocessors]
	[sink]
		type = ElementIntegralVariablePostprocessor
		block = 1
		variable = sink
	[]
	[from_parent_pp]
		type = ElementIntegralVariablePostprocessor
		block = 1
		variable = from_parent
		execute_on = 'transfer'
	[]
[]

[Ouputs]
	exodus = true
[]
```

## parent_userobject.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 3
	nx = 20
	ny = 20
	nz = 20
	# The MultiAppUserObjectTransfer object only works with ReplicatedMesh
	parallel_type = replicated
[]

[Variables]
	[u]
	[]
[]

[AuxVariables]
	[multi_layered_average]
	[]
	[element_multi_layered_average]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
	[td]
		type = TimeDerivative
		variable = u
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[Executioner]
	type = Transient
	num_steps = 1
	dt = 0.001
	solve_type = 'PJFNK'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
	l_tol = 1e-8
	nl_rel_tol = 1e-10
[]

[Outputs]
	exodus = true
	csv = true
[]
[VectorPostprocessors]
	[to_nearest_point]
		type = NearestPointIntegralVariablePostprocessor
		variable = multi_layered_average
		points = '0.3 0.1 0.3 0.7 0.1 0.3'
		execute_on = 'transfer'
	[]
	[to_nearest_point_element]
		type = NearestPointIntegralVariablePostprocessor
		variable = element_multi_layered_average
		points = '0.3 0.1 0.3 0.7 0.1 0.3'
		execute_on= 'transfer'
	[]
[]

[MultiApps]
	[sub_app]
		positions = '0.3 0.1 0.3 0.7 0.1 0.3'
		type = TransientMultiApp
		input_files = sub_userobject.i
		app_type = MooseTestApp
	[]
[]

[Transfer]
	[layered_transfer]
		user_object = layered_average
		variable = multi_layered_average
		type = MultiAppUserObjectTransfer
		from_multi_app = sub_app
		skip_coordinate_collapsing = true
		from_postprocessors_to_be_preserved = 'from_postprocessor'
		to_postprocessors_to_be_preserved = 'to_nearest_point'
	[]
	[element_layered_transfer]
		user_object = layered_average
		variable = element_multi_layered_average
		type = MultiAppUserOjbectTransfer
		from_multi_app = sub_app
		skip_coordiante_collapsing = true
		from_postprocessors_to_be_preserved = 'from_postprocessor'
		to_postprocessors_to_be_preserved = to_nearest_point_element
	[]
[]
```

sub_userobject.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 4
	ny = 8
	xmax = 0.1
	ymax = 0.5
[]

[Variables]
	[u]
		initial_condition = 1
	[]
[]

[AuxVariables]
	[layered_average_value]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[Postprocessors]
	[from_postprocessor]
		type = ElementIntegralVariablePostprocessor
		variable = layered_average_value
	[]
[]

[Functions]
	[axial_force]
		type = ParsedFunction
		expression = 1000*y
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
	[force]
		type = BodyForce
		variable = u
		function = axial_force
	[]
    [td]
    	type = TimeDerivative
    	variable = u
   []
[]

[AuxKernels]
	[layered_aux]
		type = SpatiaUserObjectAux
		variable = layered_average_value
		execute_on = 'nonlinear TIMESTEP_END'
		user_object = layered_average
	[]
[]

[BCs]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[UseObjects]
	[layered_average]
		type = LayeredAverage
		variable = u
		direction = y
		num_layers = 4
	[]
[]

[Executioner]
	type = Transient
	num_steps = 1
	dt = 0.001
	solve_type = 'PJFNK'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]

[Problem]
	coord_type = RZ
	type = FEProblem
[]
```

SpatialUserObjectAux

> Populates an auxiliary variable with a spatial value returned from a UserObject spatial Value method.

```C++
//.h
#pragma once
#include "AuxKernel.h"

class UserObject;
class SpatialUserObjectAux : public AuxKernel
{
  public:
  static InputParameters validParams();
  //Factory constructor, takes parameters so that all derived classed can be bulit using the same constructor
  
  SpatialUserObjectAux(const InputParameters & parameters);
  protected:
  virtual Real computeValue() override;
  const UserObject & _user_object;
};
//.C
#include "SpatialUserObjectAux.h"
#include "UserObject.h"
registerMooseObject("MooseApp", SpatialUserObjectAux);
InputParameters
SpatialUserObjectAux::validParams()
{
  InputParameters params = AuxKernel::validParams();
  params.addClassDescription("Populates an auxiliary variable with a spatial value returned from a UserObject spatialValue method");
  params.addRequiredParam<UserObjectName>(
    "user_object", 
  	"The UserObject UserObject to get values from .Note that the UseObject"
  	"_Must_ implement the spatialValue() virtual function");
  return params;
}

SpatialUserOjbectAux::SpatialUserObjectAux(const InputParameters & parameters)
  : AuxKerenl(parameters),
_user_object(getUserObjectBase("user_object"))
{
}
Real
SpatialUserObjectAux::computeValue()
{
  if (isNodal())
    return _user_object.spatialValue(*_current_node);
  else
    return _user_object.spatialValue(_current_elem->vertex_average());
}
```

LayerdAverage

> This UserObject computes averages of a variable storing partial sums for the specified number of intervals in a direction(x, y, z)

```C++
//.h
#pragma once
#include "LayeredIntegral.h"
class LayeredAverage;
template <>
InputParameters validParams<LayeredAverage>();

class LayeredAverage : public LayeredIntegral
{
  public:
  static InputParameters validParams();
  LayeredAverage(const InputParameters & parameters);
  virtual void initialize() override;
  virtual void execute() override;
  virtual void finalize() override;
  virtual void threadJoin(const UserObject & y) override;
  protected:
  std::vector<Real> _layer_volumes;
};
//.C
#include "LayereAverage.h"
registerMooseOjbect("MooseApp", LayeredAverage);
InputParameters
LayeredAverage::validParams()
{
  InputParameters params = LayeredIntegral::validParams();
  params.addClassDescription("Computes averages of variables over layers");
  return params;
}
LayeredAverage::LayeredAverage(const InputParameters & parameters) : LayeredIntegral(parameters),
{
  _layer_volumes.resize(_num_layers);
}

void
LayeredAverage::initialize()
{
  LayeredIntegral:;initizlize();
  for (auto & vol : _layer_volumes)
    vol = 0.0
}
void
LayeredAverage::execute()
{
  LayeredIntegral::execute();
  unsigned int layer = getLayer(_current_elem->vertex_average());
  _layer_volumes[layer] += _current_elem_volume;
}

void
LayeredAverage::finalize()
{
  LayeredIntegral::finalize();
  gatherSum(_layer_volumes);
  for (unsigned int i = 0; i < _layer_volumes.size(); i++)
    if (layerHasValue(i))
      setLayerValue(i, getLayerValue(i) / _layer_volumes[i]);
}
void
LayeredAverage::threadJoin(const UserOjbect & y)
{
  LayeredIntegral::threadJoin(y);
  const LayeredAverage & la = static_cast<const LayeredAverage &>(y);
  for (unsigned int i = 0; i < _layer_volumes.size(); i ++)
    _layere_volumes[i] += la._layer_volumes[i];
}
```

## primary_negative_adjuster.i

```
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 1
	ny = 1
[]

[Variables]
	[u]
	[]
[]
[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[BCs]
	[left]]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[AuxVariables]
	[var]
		family = MONOMIAL
		order = THIRD
	[]
[]

[ICs]
	[var_ic]
		type = FunctionIC
		variable = var
		function = '-exp(x*y)'
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'PJFNK'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[MultiApps]
	[sub]
		type = FullSolveMultiApp
		input_files = secondary_adjuster.i
		execute_on = timestep_end
	[]
[]

[Postprocessors]
	[from_postprocessor]
		type = ElementIntegralVariablePostprocessor
		variable = var
	[]
[]

[Transfers]
	[to_sub]
		type = MultiAppShapeEvaluationTransfer
		source_variable = var
		variable = var
		to_multi_app = sub
		from_postprocessors_to_be_preserved = 'from_postprocessor'
		to_postprocessors_to_be_preserved = 'to_postprocessor'
	[]
[]

[Outputs]
	exodus = true
[]
```

secondary_negative_adjuster.i

```
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 20
	ny = 20
[]

[Variables/u]
[]
[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[AuxVariables]
	[var]
		family = MONOMIAL
		order = CONSTANT
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[Postprocessors]
	[to_postprocessor]
		type = ElementIntegralVariablePostprocessor
		variable = var
		execute_on = 'transfer'
	[]
[]

[Problem]
	type = FEProblem
[]

[Executioner]
	type = Steady
	solve_type = 'PJFNK'
	nl_abs_tol = 1e-12
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_vlaue = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]
```

## primary_skipped_adjuster.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 1
	ny = 1
[]

[Variables]
	[u]
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[AuxVariables]
	[var]
		family = MONOMIAL
		order = THIRD
	[]
[]

[ICs]
	[var_ic]
		type = Functions
		function = '-exp(x*y)'
		variable = var
	[]
[]

[Executoner]
	type = Steady
	solve_type = 'PJFNK'
	petsc_options_ianme = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[MultiApps]
	[sub]
		type = FullSovleMultiApp
		input_files = secondary_negative_adjuster.i
		execute_on = timestep_begin
	[]
[]

[Postprocessor]
	[from_postprocessor]
		type = ElementIntegralVariablePostprocessor
		variable = var
	[]
[]

[Transfers]
	[to_sub]
		type = MultiAppShapeEvaluationTransfer
		source_variable = var
		variable = var
		to_multi_app = sub
		from_postprocessors_to_be_preserved = 'from_postprocessor'
		to_postprocessors_to_be_preserved = 'to_postprocessor'
		allow_skipped_adjustment = true
	[]
[]

[Outputs]
	exodus = true
[]
```

> 如果allow_skipped_adjustment设置成true则对于传递的后处理的值不会进行为0或者变号的调整。如果有是false，将会输出错误。

secondary_negative_adjuster.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 20
	ny = 20
[]

[Variables]
	[u]
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[AuxVariables]
	[var]
		family = MONOMIAL
		order = CONSTANT
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]
[Postprocessors]
	[to_postprocessor]
		type = ElementIntegralVariablePostprocessor
		variable = var
		exectue_on = 'transfer'
	[]
[]

[Problem]
	type = FEProblem
[]

[Executioner]
	type = Steady
	solve_type = 'PJFNK'
	nl_abs_tol = 1e-12
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]
```

# multiapp_copy_transfer

## array_variable_transfer

parent.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 10
	ny = 10
[]
[Variables]
# with two component
	[v]
		order = FIRST
		family = LAGRANGE
		compoents = 2
	[]
[]

[Problem]
	type = FEProblem
	solve = false
[]

[Executioner]
	type = Transient
	num_steps = 1
	solve_type = 'PJFNK'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[MultiApps]
	[sub]
		type = FullSovleMultiApp
		inpute_files = sub.i
		execute_on = initial
	[]
[]

[Transfers]
	[from_sub]
		type = MultiAppCopyTransfer
		source_variable = u
		variable = v
		from_multi_app = sub
	[]
	
	[Outputs]
		exodus = true
	[]
```

sub.i

```c++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 10
	ny = 10
[]

[Variables]
	[u]
		order = FIRST
		family = LAGRANGE
		componets = 2
	[]
[]

[Kernels]
	[diff]
		type = ArrayDiffusion
		variable = u
		diffusion_coefficeint = dc
	[]
	[reaction]
		type = ArrayReaction
		variable = u
		reaction_ceofficient = rc
	[]
[]

[BCs]
	[left]
		type = ArrayDirichletBC
		variable = u
		boundary = 1
		values = '0 0'
	[]
	[right]
		type = ArrayDirichletBC
		variable = u
		boundary = right
		value = '1 2'
	[]
[]

[Materials]
	[dc]
		type = GenericConstantArray
		prop_name = dc
		prop_value = '1 1'
	[]
	
	[rc]
		type = GenericConstant2DArray
		prop_name = rc
		prop_value = '1 0; -0 1 1'
	[]
[]

[Executioner]
	type = Transient
	num_step = 1
	solve_type = 'PJFNK'
	petsc_options_iname= '-pc_type -pc_hypre_type'
	petsc_options_vlaue = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]
```

看一个Array中主要继承的变量。

ArrayDiffusion

```C++
//.h
#pragma once
#include "ArrayKernel.h"
class ArrayDiffusion : public ArrayKernel
{
  public:
  static InputParameters validParams();
  ArrayDiffusion(const InputParameters & parameters);
  protected:
  virtual void initQpResidaul() override;
  virtual void computeQpResidual(RealEigenVector & residual) override;
  virtual RealEigenVector computeQpJacobian() override;
  virtual RealEigenVector computeQpOffDiagJacobian(const MooseVariableFEBase & jvar) override;
  //scalar diffusion coefficient
  const MaterialProperty<Real> * const _d;
  //array diffusion coefficient
  const MaterialProperty<RealEigenVector> * const _d_array;
  //matrix diffuson coefficient
  const MaterialProperty<RealEigenVector> * const _d_2d_array;
};

//.C
#include "ArrayDiffusion.h"
registerMooseOjbect("MooseApp", ArrayDiffusion);
InputParameters
ArrrayDiffusion::validParams()
{
  InputParameters params = ArrayKernel::validParams();
  params.addRequiredParam<MaterialPropertyName>("diffusion_coefficient", "The name of the diffusivity, can be scalar, vector, or matrix material property");
  params.addClassDescription("the array Laplacian operator ($\nabla \cdot \nabla u$), with the weak from of $\nabla \phi_i, \nabla u_h$");
  return params;
}

ArrayDiffusion::ArrayDiffusion(cont InputParameters & parameters)
  : ArrrayKernel(parameters),
_d(hasMaterialProperty<Real>("diffusion_coefficient") ? &getMaterialProperty<Real>("diffusion_coefficient") : nullptr),
_d_array(hasMaterialPropety<RealEigenVector>("diffusion_coefficient") ? &getMaterialProperty<RealEigenVector>("diffusion_coefficient") : nullptr),
_d_2d_array(hasMaterialProperty<RealEigeMatrix>("diffusion_coefficient") ? &getMaterialProperty<RealEigenMatrix>("diffusion_coefficient") : nullptr)
{
  if (!_d && !_d_array && !_d_2d_array)
  {
    MaterialPropertyName mat = getParam<MaterialPropertyName>("diffusion_coefficient");
    mooseError("Property" + mat + "is of unsupported type for ArrayDiffusion");
  }
}

void
ArrayDiffusion::initQpResidual()
{
  if (_d_array)
  {
    mooseAssert((*_d_array)[_qp].size() == _var.count(),
                "diffusion_coefficient size is inconsistent with the number of components of array "
                "variable");
  }
  else if (_d_2d_array)
  {
    mooseAssert((*_d_2d_array)[_qp].cols() == _var.count(),
                "diffusion_coefficient size is inconsistent with the number of components of array "
                "variable");
    mooseAssert((*_d_2d_array)[_qp].rows() == _var.count(),
                "diffusion_coefficient size is inconsistent with the number of components of array "
                "variable");
  }
}

void
ArrayDiffusion::computeQpResidual(RealEigenVector & residual)
{
  // WARNING: the noalias() syntax is an Eigen optimization tactic, it avoids creating
  // a temporary object for the matrix multiplication on the right-hand-side. However,
  // it should be used with caution because it could cause unintended results,
  // developers should NOT use it if the vector on the left-hand-side appears on the
  // right-hand-side, for instance:
  //   vector = matrix * vector;
  // See http://eigen.tuxfamily.org/dox/group__TopicAliasing.html for more details.
  if (_d)
    residual.noalias() = (*_d)[_qp] * _grad_u[_qp] * _array_grad_test[_i][_qp];
  else if (_d_array)
    residual.noalias() = (*_d_array)[_qp].asDiagonal() * _grad_u[_qp] * _array_grad_test[_i][_qp];
  else
    residual.noalias() = (*_d_2d_array)[_qp] * _grad_u[_qp] * _array_grad_test[_i][_qp];
}

RealEigenVector
ArrayDiffusion::computeQpJacobian()
{
  if (_d)
    return RealEigenVector::Constant(_var.count(),
                                     _grad_phi[_j][_qp] * _grad_test[_i][_qp] * (*_d)[_qp]);
  else if (_d_array)
    return _grad_phi[_j][_qp] * _grad_test[_i][_qp] * (*_d_array)[_qp];
  else
    return _grad_phi[_j][_qp] * _grad_test[_i][_qp] * (*_d_2d_array)[_qp].diagonal();
}

RealEigenMatrix
ArrayDiffusion::computeQpOffDiagJacobian(const MooseVariableFEBase & jvar)
{
  if (jvar.number() == _var.number() && _d_2d_array)
    return _grad_phi[_j][_qp] * _grad_test[_i][_qp] * (*_d_2d_array)[_qp];
  else
    return ArrayKernel::computeQpOffDiagJacobian(jvar);
}
```

## aux_to_aux

from_sub.i

```C++
[Problem]
	solve = false
[]

[Mesh]
	type = GeneratedMesh
	dim = 2
[]

[MultiApps/sub]
	type = TransientMultiApp
	input_files = sub.i
[]

[Transfers/from_sub]
	type = MultiAppCopyTransfer
	from_multi_app = sub
	source_variable = aux
	variable = x
[]

[AuxVariables/x]
[]

[Executioner]
	type = Transient
	num_steps = 1
[]

[Outputs]
	execute_on = 'FINEL'
	exodus = true
[]
```

sub.i

```C++
[Problem]
	type = FEProblem
	solve = false
[]
[Mesh]
	type = GeneratedMesh
	dim = 2
[]
[AuxVariables/aux]
	initial_condition = 1980
[]
[Executioner]
	type = Transient
[]

[Outputs]
	execute_on = 'FINAL'
	exodus = true
[]
```

to_sub.i

```C++
[Problem]
	solve = false
[]

[Mesh]
	type = GeneratedMesh
	dim = 2
[]

[MultiApps/sub]
	type = TransientMultiApp
	input_files = sub.i
[]

[Transfers/from_sub]
	type = MultiAppCopyTransfer
	to_multi_app = sub
	source_variable = x
	variable = aux
[]

[AuxVariables/x]
	initial_conditon = 1949
[]

[Executioner]
	type = Transient
	num_steps = 1
[]

[Outputs]
	execute_on = 'FINAL'
	exodus = true
[]
```

## aux_to_primary

from_sub.i

```
[Problem]
	solve = false
[]

[Mesh]
	type = GeneratedMesh
	dim = 2
[]

[Variables]
	[main]
		initial_condition = 1938
	[]
[]

[MultiApps/sub]
	type = TransientMultiApp
	input_files = sub.i
[]

[Transfers/from_sub]
	type = MultiAppCopyTransfer
	from_multi_app = sub
	source_variable = sub
	variable = main
[]

[Executioner]
	type = Transient
	num_steps = 1
[]

[Outputs]
	execute_on = 'FINAL'
	exodus = true
[]
```

sub.i

```C++
[Problem]
	type = FEProblem
	solve = false
[]

[Mesh]
	type = GeneratedMesh
	dim = 2
[]

[Variables/sub]
	initial_condition = 1980
[]

[Executioner]
	type = Transient
[]

[Outputs]
	execute_on = 'FINAL'
	exodus = true
[]
```

to_sub.i

```
[Problem]
	solve = false
[]

[Mesh]
	type = GeneratedMesh
	dim = 2
[]

[Variables]
	[main]
		initial_condition = 1949
	[]
[]

[MultiApps/sub]
	type = TransientMultiApp
	input_files = sub.i
[]

[Transfers/to_sub]
	type = MultiAppCopyTransfer
	to_multi_app = sub
	source_variable = main
	variable = sub
[]

[Executioner]
	type = Transient
	num_steps = 1
[]

[Outputs]
	execute_on = 'FINAL'
	exodus = true
[]
```

## between_multiapps

main.i

```C++
[Problem]
	solve = false
[]

[Mesh]
	type = GeneratedMesh
	dim = 2
[]

[MultiApps/sub1]
	type = TransientMultiApp
	input_files = sub1.i
[]

[MutliApps/sub2]
	type = TransientMulitApp
	input_files = sub2.i
[]
[Transfers/from_su1_to_sub2]
	type = MultiAppCopyTransfer
	from_multi_app = sub1
	to_multi_app = sub2
	source_variable = x1
	variable = x2
[]

[Executioner]
	type = Transient
	num_steps = 1
[]
```

sub1.i

```C++
[Problem]
	type = FEProblem
	solve = false
[]

[Mesh]
	type = GeneratedMesh
	dim = 2
[]

[AuxVariables/x1]
	initial_condition = 10
[]

[Executioner]
	type = Transient
[]

[Outputs]
	execute_on = 'FINAL'
	exodus = true
[]
```

sub2.i

```C++
[Problem]
	type = FEProblem
	solve = false
[]

[Mesh]
	type = GeneratdMesh
	dim = 2
[]

[AuxVariables/x2]
	initial_condition = 1980
[]

[Executioner]
	type = Transient
[]

[Outputs]
	execute_on = 'FINAL'
	exodus = true
[]
```

## block_restriction

bi_direction.i

```C++
[Mesh]
	[gmg]
		type = GeneratedMeshGenerator
		dim = 2
		xmin = 0
		xmax = 2
		ymin = 0
		ymax = 2
		nx = 4
		ny = 4
		# Designed to have non-complete overlap
		subdomain_ids = '1 1 1 1
									2 2 2 1
									1 2 2 1
									1 1 2 1'
	[]
[]

[Variables]
	[to_sub]
		family = MONOMIAL
		order = CONSTANT
		initial_condition = 1
	[]
	[from_sub]
		family = MONOMIAL
		order = CONSTANT
		initial_condition = 2
	[]
[]

[Problem]
	type = FEProblem
	solve = false
[]

[Executioner]
	type = Transient
	num_steps = 2
[]

[MultiApps]
	[sub]
		type = TransientMultiApp
		input_files = sub.i
	[]
[]

[Transfers]
	[to_sub]
		type = MultiAppCopyTransfer
		source_variable = to_sub
		variable = from_main
		to_multi_app = sub
	[]
	[from_sub]
		type = MultiAppCopyTransfer
		source_variable = to_main
		variable = from_sub
		from_multi_app = sub
	[]
[]

[Outputs]
	exodus = true
[]
```

sub.i

```
[Mesh]
	[gmg]
		type = GeneratedMeshGenerator
		dim = 2
		xmin = 0
		xmax = 2
		ymin = 0
		ymax = 2
		nx = 4
		ny = 4
		subdomain_ids = '1 1 1 1
									2 2 1 1
									2 2 1 1
									1 2 1 1'
	[]
[]

[Varibles]
	[to_main]
		
```

#multiapp_interpolation_transfer

##fromrestrictedsub_parent.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 10
	ny = 10
	# The MultiAppGeometricInterpolationTransfer object only works with ReplicatedMesh
	parallel_type = replicated
[]

[Variables]
	[u]
	[]
[]

[AuxVariables]
	[elemental_from_sub]
		order = CONSTANT
		family = MONOMIAL
	[]
	[nodal_from_sub]
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[Executioner]
	type = Transient
	num_steps = 1
	dt = 1
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_o[tions_value = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]

[MultiApps]
	[sub]
		type = TransientMultiApp
		app_type = MooseTestApp # the name of the MooseApp derived app that is going to be executed.也就是说吐过是同一个App可以省略。
		positions = '0.05 0.5 0 0.55 0.5 0' # 是主程序到子程序的坐标偏移，每一个sub_app都需要设置，就是说明放置了两个位置。
		input_files = fromrestrictedsub_sub.i
		output_in_position = true
	[]
[]

[Transfers]
	[elemental_fromsub]
		type = MultiAppGeometricInterpolationTransfer
		from_multi_app = sub
		source_variable = elemental # the variable to transfer from. 传进来的变量
		variable = elemental_from_sub # auxvariable to store the transferred values in 用于存储传递进来的的变量
	[]
	[nodal_fromsub]
		type = MultiAppGeomerticInterpolationTransfer
		from_multi_app = sub
		source_variable = nodal
		varaible = nodal_from_sub
	[]
[]

```

**MultiAppGeomerticInterplationTransfer**

> 使用网格插值将最近的节点的源变量传递到目标网络的最近节点

# #fromrestrictedsub_sub.i

```C++
[Mesh]
	[file]
		type = FileMeshGenerator
		file = 2subdomains.e
	[]
	[boundary_fuel_side]
		inpute = file
		type = SubdomainBoundingBoxGenerator
		block_id = 2
		bottom_left = '0.2 0 0'
		top_right = '0.3 1 0'
	[]
[]

[Variables]
	[u]
	[]
[]

[AuxVariables]
	[elemental]
		block = '2'
		order = CONSTANT
		family = MONOMIAL
	[]
	[nodal]
		block = '2'
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[AuxKernels]
	[elemaux]
		type = CoupledAux
		variable = elemental # return coupled(u)
		coupled = u
		block = '2'
	[]
	[nodaux]
		type = CoupledAux
		variable = nodal
		coupled = u
		block = '2'
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[Executioner]
	type = Transient
	num_steps = 1
	dt = 1
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]
```

运行的时候采用`./moose_test.opt -i fromerstictedsub_parent.i fromrestrictedsub_sub.i`。

会报错这说明==MultiAppGenometricInterplationTransfer==要求输入的网格命名要一样。

```C++
*** ERROR ***
/Users/wangzhaohao/projects/moose/test/tests/transfers/multiapp_interpolation_transfer/fromrestrictedsub_sub.i:22: (AuxVariables/elemental/block):
    the following blocks (ids) do not exist on the mesh: 2
```

## formsub_parent.i

```C++
# This is a  test of the Transfer System. This test uses the Multiapp System to solve independent problems related geomerticaly.
# Solutions are then interplated and transferred from a non-aligned domain.(非对齐域)

[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 10
	ny = 10
	displacements = 'disp_x disp_y'
	# The MultiAppGeometricInterpolationTransfer Object only works with ReplicatedMesh
	parallel_type = dreplicated
[]

[Variables]
	[u]
	[]
[]

[AuxVariables]
	[from_sub]
	[]
	[elemental_from_sub]
		order = CONSTANT
		family = MoNOMIAL
	[]
	[radial_from_sub]
	[]
	[radial_elemental_from_sub]
		order = CONSTANT
		family = MONOMIAL
	[]
	[disp_x]
		initial_condition = 0.2
	[]
	[disp_y]
	[]
	[disp_y]
	[]
	[displaced_target_from_sub]
	[]
	[displaced_source_from_sub]
	[]
	[nodal_from_sub_elemental]
	[]
	[elemental_from_sub_elemental]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[Executioner]
	type = Transient
	num_steps = 1
	dt = 1
	
	solve_type = 'PJFNK'
	
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]

[MultiApps]
	[sub]
		type = TransientMultiApp
		app_type = MooseTestApp
		positions = '0 0 0 0.6 0 0'
		input_files = fromsub_sub.i
	[]
[]

[Transfers]
	[fromsub]
		type = MultiAppGeometricInterpolationTransfer
		from_multi_app = sub
		source_variable = u
		variable = from_sub
	[]
	[elemental_fromsub]
		type = MultiAppGeometricInterpolationTransfer
		from_multi_app = sub
		source_variable = u
		variable = elemental_from_sub
	[]
	[radial_fromsub]
		type = MultiAppGeometicInterpolationTransfer
		form_multi_app = sub
		source_variable = u
		variable = radial_from_sub
		interp_type = radial_basis
	[]
	[radial_elemental_fromsub]
		type = MultiAppGeometricInterpolationTransfer
		from_multi_app = sub
		source_variable = u
		variable = radial_elemental_from_sub
		interp_type = radial_basis
	[]
	[displaced_target_fromsub]
		type = MutliAppGeometricInterpolationTransfer
		from_multi_app = sub
		source_variable = u
		variable = displaced_target_from_sub
		displaced_target_mesh = true
	[]
	[displaced_source_fromsub]
		type = MultiAppGeometricInterpolationTransfer
		form_multi_app = sub
		source_variable = u
		variable = displaced_source_from_sub
		displaced_target_mesh = true
	[]
	[elemental_from_sub_elemental]
		type = MultiAppGeometricInterpolationTransfer
		form_multi_app = sub
		source_variable = elemental
		variable = elemental_from_sub_elemental
	[]
	
	[nodal_from_sub_elemental]
		type = MultiAppGeometricInterpolationTransfer
		from_multi_app = sub
		source_variable = elemental
		variable = nodal_from_sub_elemental
	[]
[]
```

相对应的

## fromsub_sub.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 10
	ny = 10
	xmin = .21
	xmax = .79
	displacements = 'disp_x disp_y'
[]

[Variables]
	[u]
	[]
[]

[AuxVariables]
	[disp_x]
		initial_condition = -0.4
	[]
	[disp_y]
	[]
	[elemental]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[Functions]
	[x_func]
		type = ParsedFunction
		expression = x
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[AuxKernels]
	[x_func_aux]
		type = FunctionAux
		variable = elemental
		function = x_func
		execute_on = initial
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[Executioner]
	type = Transient
	num_steps = 1
	dt = 1
	
	solve_type = 'PJFNK'
	
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]
```

所以说`source_variable = elemental source_variable = u `其中的elemntal和u都是sub里面的。然后其中的variable都是parent中的==AuxVariable==。

## tosub_parent.i

```C++
# This is a test of the Transfer System. This test uses the Multiappp System to solve independent problems related geomertically.
# Slutions are then interpolated and trasferred to a non-aligned domain.

[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 10
	ny = 10
	xmin = .21
	ymin = .79
	displacements = 'disp_x disp_y'
	# The MultiAppGeomerticInterplationTransfer object only works with ReplicatedMesh
	parallel_type = replicated
[]

[Variables]
	[u]
	[]
[]

[AuxVariables]
	[disp_x]
		initial_condition = 0.4
	[]
	[disp_y]
	[]
	[elemental]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[Functions]
	[x_func]
		type = ParsedFunction
		expression = x
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[AuxVariables]
	[x_func_aux]
		type = FunctionAux
		variable = elemental
		function = x_func
		execute_on = initial
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[Executioner]
	type = Transient
	num_steps = 1
	dt = 1
	
	solve_type = 'PJFNK'
	
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]

[MultiApps]
	[sub]
		type = TransientMultiApp
		app_type = MooseTestApp
		execute_on = timestep_end
		positions = '0.2 0 0'
		input_files = tosub_sub.i
	[]
[]

[Transfers]
	[tosub]
		type = MultiAppGeometricInterpolationTransfer
		to_multi_app = sub
		source_variable = u
		variable = from_parent
	[]
	[elemental_tosub]
		type = MultiAppGeometricInterpolationTransfer
		to_multi_app = sub
		source_variable = u
		variable = elemental_from_parent
	[]
	[radial_tosub]
		type = MultiAppGeomerticInterpolationTransfer
		to_multi_app = sub
		source_variable = u
		variable = radial_from_parent
		interp_type = radial_basis
	[]
	[radial_elemental_tosub]
		type = MultiAppGeometricInterpolationTransfer
		to_multi_app = sub
		source_variable = u
		variable = radial_elemental_from_parent
		interp_type = radial_basis
	[]
	[displaced_target_tosub]
		type = MultiAppGeomerticInterpolationTransfer
		to_multi_app = sub
		source_variable = u
		variable = displaced_target_from_parent
		displaced_target_mesh = true
	[]
	[displaced_source_tosub]
		type = MultiAppGeomerticInterplationTransfer
		to_multi_app = sub
		source_variable = u
		variable = displaced_source_from_parent
		displaced_source_mesh = true
	[]
	[elemental_to_sub_elemental]
		type = MultiAppGometricInterpolationTransfer
		to_multi_app = sub
		source_variable = elemental
		variable = elemental_from_parent_elemental
	[]
	[elemental_to_sub_nodal]
		type = MultiAppGeometricInterpolationTransfer
		to_multi_app = sub
		source_variable = elemental
		variable = nodal_from_parent_elemental
	[]
[]
		
```

`to_multi_app`后面说的是MultiApp需要将数据传递给的app。`from_multi_app`后面应该是说的MultiApp从哪里得到的数据。`source_variable`中的变量是multiApp中的变量。`variable`是subapp中的变量。

对应的sub.i如下

## tosub_sub.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 10
	ny = 10
	displacements = 'disp_x disp_y'
[]

[Variables]
	[u]
	[]
[]

[AuxVariables]
	[from_parent]
	[]
	[elemental_from_parent]
		order = CONSTANT
		family = MONOMIAL
	[]
	[radial_from_parent]
	[]
	[radial_elemental_from_parent]
		order = CONSTANT
		family = MONOMIAL
	[]
	[disp_x]
		inital_condition = -0.2
	[]
	[disp_y]
	[]
	[displaced_target_from_parent]
	[]
	[displaced_source_from_parent]
	[]
	[elemental_from_parent_elemental]
		order = CONSTANT
		family = MONOMIAL
	[]
	[nodal_from_parent_elemental]
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[Executioner]
	type = Transient
	num_step = 1
	dt = 1
	
	solve_type = 'PJFNK'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]
	
```

# multiage_conservative_transfer

## parent_conservative_transfer.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 20
	ny = 20
[]

[Variables]
	[u]
	[]
[]

[kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[BCs]
	[left]
		type = DirichltBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[Executioner]
	tyep = Steady
	solve_type = 'PJFNK'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[MultiApps]
	[sub]
		type = FullSolveMultiApp
		input_files = sub_conservative_transfer.i
		execute_on = timestep_end
	[]
[]

[Postprocessors]
	[from_postprocessor]
		type = ElementIntegralVariablePostprocessor
		variable = u
	[]
[]

[Transfers]
	[to_sub]
		type = MultiAppShapeEvaluationTransfer
		source_variable = u
		variable = aux_u
		to_multi_app = sub
		from_postprocessors_to_be_prserved = 'from_postprocessor'
		to_postprocessors_to_be_preserved = 'to_postprocessor'
	[]
[]

[Outputs]
	exodus = true
	[console]
		type = Console
		execute_postprocessors_on = 'INITIAL nonlinear TIMESTEP_END'
	[]
[]
```

对应的sub

## sub_conservative_transfer.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 20
	ny = 20
	xmin = 0.05
	xmax = 1.2
	ymin = 0.05
	ymax = 1.1
[]

[Variables]
	[u]
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
	[coupledforce]
		type = CoupledForce
		variable = u
		v = aux_u
	[]
[]

[AuxVariables]
	[aux_u]
		family = LAGRANGE
		order = FIRST
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[Postprocessors]
	[to_postprocessor]
		type = ElementIntegralVariablePostprocessor
		variable = aux_u
		execute_on = 'transfer'
	[]
[]

[Problem]
	type = FEProblem
[]

[Executioner]
	type = Steady
	solve_type = 'PJFNK'
	nl_abs_tol = 1e-12
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]
```

·总结，从哪里传出来的那个变量用`source_variable`接收的那一方叫`variable`。

|      方向      | source_variable | variable       |
| :------------: | --------------- | -------------- |
|  To_multi_app  | sub里面的       | multiapp里面的 |
| form_multi_app | multiapp里面的  | sub里面的      |





















> 2023.4.19

# auto_diff_auto_scaling

## main.i

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
		boundary = left
		value = 0
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

[Executioner]
	type = Transient
	num_step = 2
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
		positions = '0 0 0'
	[]
[]
```

## sub.i

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
		boundary = left
		value = 0
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

[Executioner]
	type = Transient
	num_steps = 2
	solve_type = 'Newton'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
	automaitc_scaling = true
	verbose = true
[]

[Outputs]
	exodus = true
[]
```



