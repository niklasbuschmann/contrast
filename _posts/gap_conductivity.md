<center>gap_heat_transfer</center>

# cyl2D.i

```C++
[GlobalParams]
	order = SECOND
	family = LAGRANGE
[]

[Mesh]
	file = cyl2D.e
[]

[Functions]
	[temp]
		type = PiecewiseLinear
		x = '0 1'
		y = '100 200'
	[]
[]

[Variables]
	[temp]
		initial_condition = 100
	[]
[]

[AuvVariables]
	[gap_conductance]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[Kernels]
	[heat_conduction]
		type = HeatConduction
		variable = temp
	[]
[]

[AuxKernels]
	[gap_cond]
		type = MaterialRealAux
		property = gap_conductance
		variable = gap_conductance
		boundary = 2
	[]
[]

[Materials]
	[heat1]
		type = HeatConductionMaterial
		block = '1 2'
		specific_heat = 1.0
		thermal_conductivity = 1000000.0
	[]
[]

[ThermalContact]
	[thermal_contact]
		type  = GapHeatTransfer
		variable = temp
		primary = 3
		secondary = 2
		emissivity_primary = 0
		emissivity_secondary = 0
		gap_conductivity = 1
		quadrature = true
		gap_geomerty_type = CYLINDER
		cylinder_axis_point_1 = '0 0 0'
		cylinder_axis_point_2 = '0 0 1'
	[]
[]

[BCs]
	[mid]
		type = FunctionDirichletBC
		boundary = 1
		variable = temp
		function = temp
	[]
	[temp_far_right]
		type = DirichletBC
		boundary = 4
		variable = temp
		value = 100
	[]
[]

[Executioner]
	type = Transient
	solve_type = 'PJFNK'
	
	petsc_options_iname = '-pc_type -pc_factor_mat_solver_package'
	petsc_options_value = 'lu.       superlu_dist'
	
	dt = 1
	dtmin = 0.01
	end_time = 1
	
	nl_real_tol = 1e-12
	nl_abs_tol = 1e-7
	
	[Quadrature]
		order = fifth
		side_order = seventh
	[]
[]

[Outputs]
	exodus = true
	[Console]
		type = Console
	[]
[]

[Postprocessors]
	[temp_left]
		type = SideAverageValue
		boundary = 2
		variable = temp
	[]
	[temp_right]
		type = SideAverageValue
		boundary = right
		variable = temp
	[]
	
	[flux_left]
		type = SideDiffusiveFluxIntegral
		variable = temp
		boundary = 2
		diffusivity = thermal_conductivity
	[]
	
	[flux_right]
		type = SideDiffusiveFluxIntegral
		variable = temp
		boundary = 3
		diffusivity = thermal_conductivity
	[]
[]
```

$$
Flux = (T_{left}-T_{right}) * (\frac{gapK}{r\times ln(\frac{r2}{r1})})\times Area
$$

其中的Area是secondary(inner)的表面积。所以上述通量的计算结果是

`2*pi*1*1*100/ln(2/1) = 960.5 watts`

因为几何采用了对称几何，所以通量是226.6 watts。

