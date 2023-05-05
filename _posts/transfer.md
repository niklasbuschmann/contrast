##from_full_solve
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
##boundary
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
```
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
##duplicated_nearest_node_tests
###boundary_toparent_parent.i
```
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
