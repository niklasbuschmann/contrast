<center>uniaixal</center>

# anisotropic_elastoplasticity

## ad_uniaxial_x

```
# this test simualates uniaixial tensile loading in x-direction. the slope 
# of the stress va plastic strian is evaluated from the simulatio and compared with the value valcaulated using the analystical expression.
[Mesh]
	[gen]
		type = GeneratedMeshGenerator
		dim = 3
	[]
[]

[GlobalParams]
	displacements = 'disp_x disp_y disp_z'
	volumetric_locking_correction = true
[]

[AuxVariables]
	[hydrostatic_stress]
		order = CONSTANT
		family = MONOMIAL
	[]
	[plastic_strain_xx]
		order = CONATANT
		family = MONOMIAL
	[]
	[plastic_strain_xy]
		order = CONSTANT
		family = MONOMIAL
	[]
	[plastic_strain_zz]
		order = CONSTANT
		family = MONOMIAL
	[]
	[sigma_xx]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[AuxKernels]
	[hydrostatic_stress]
		type = ADRankTwoScalarAux
		variable = hydrostatic_stress
		rank_two_tensor = stress
		scalar_type = Hydrostatic
	[]
	[plasticity_strain_xx]
		type = ADRankTwoAux
		variable = plastic_strain_xx
		rank_two_tensor = plastic_strain
		index_j = 0
		index_i = 0
	[]
	[plasticity_strain_xy]
		type = ADRankTwoTensor
		rank_two_tensor = plastic_strain
		variable = plastic_strain_xy
		index_i = 0
		index_j = 1
	[]
	[plasticity_strain_yy]
		type = ADRankTwoAux
		variable = plastic_strain_yy
		rank_two_tensor = plastic_strain
		index_i = 1
		index_j = 1
	[]
	[sigam_xx]
		type = ADRankTwoAux
		rank_two_tensor = stress
		variable = stress_xx
		index_i = 0
		index_j = 0
	[]
[]

[Functions]
	[pull]
		type = PiecewiseLinear
		x = '0 1e1'
		y = '0 -2e8'
	[]
[]

[Modules/TensorMechanics/Master]
	[all]
		strain = FINITE
		generate_output = 'elastic_strain_xx stress_xx strain_xx plastic_strain_xx'
		use_automatic_differentiation = true
		add_variables = true
	[]
[]

[Materials]
	[elasticity_tensor]
		type = ADComputeElasticityTensor
		fill_method = orthotropic
		C_ijkl = '10.e10 15.0e10 20.0e10 2.0e10 2.0e10 2.0e10 0.2 0.2 0.2 0.1333333333333 0.1 0.15'
	[]
	[elastic_strain]
		type = ADComputeMultipleInelasticStress
		inelastic_models = 'trial_plasticity'
		max_iterations = 50
		absolute_tolerance = 1e-16
	[]
	
	[hill_tensor]
		type = ADHillConstants
		hill_constants = "0.6 0.4 0.7 1.5 1.5 1.5"
	[]
	
	[trial_plasticity]
		type = ADHillElastoPlasticityStressUpdate
		hardening_constant = 10e9
		yield_stress = 60e6
		absolute_tolerance = 1e-15
		relative_tolerance = 1e-13
		max_inelastic_incremant = 2.0e-5
	[]
[]

[BCs]
	[no_disp_x]
		type = ADDirichletBC
		variable = disp_x
		boundary = left
		value = 0
	[]
	
	[no_disp_y]
		type = ADDirichletBC
		variable = disp_y
		boundary = bottom
		value = 0.0
	[]
	
	[no_disp_z]
		type = ADDirchletBC
		variable = disp_z
		boundary = bakc
		value = 0
	[]
	
	[Pressure]
		[Side1]
			boundary = right
			function = pull
		[]
	[]
[]

[Executioner]
	type = Trnasient
	
	solve_type = NEWTON
	petsc_options_iname = '-pc_type -pc_facotr_mat_solver_package'
	petsc_options_value = 'lu. superlu_dist'
	
	nl_rel_tol = 1e-12
	nl_abs_tol = 1.0e-14
	l_max_its = 90
	
```

