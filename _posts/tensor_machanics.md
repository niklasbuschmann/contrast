<center>tensor_mechanics</center>

# 1D_axisymmetic

## axisymm_gps_finite.i

```C++
# this test checks the asixymmetirc 1D generalized plane strain forulation using finite strains
[GlobalParams]
	displacements = disp_x
	scalar_out_of_plane_strain = scalar_strian_yy #平面外应变方向的标量变量列表
[]

[Problem]
	coord_type = RZ
[]
[Mesh]
	file = line.e
[]

[Variables]
	[disp_x]
	[]
	[scalar_strain_yy]
		order = FIRST
		family = SCALAR
	[]
[]

[AuvVariables]
	[strain_xx]
		order = CONSTANT
		family = MONOMIAL
	[]
	[strain_yy]
		order = CONSTANT
		family = MONOMIAL
	[]
	[strain_zz]
		order = CONSTANT
		family = MONOMIAL
	[]
	[stress_xx]
		order = CONSTANT
		family = MONOMIAL
	[]
	[stress_yy]
		order = CONSTANT
		family = MONOMIAL
	[]
	[stress_zz]
		order = CONSTANT
		family = MONOMIAL
	[]
	[temp]
		initial_condition = 580.0
	[]
[]

[Functions]
	[temp]
		type = PiecewiseLinear
		x = '0 1 2'
		y = '580 580 680'
	[]
	[disp_x]
		type = PiecewiseLinear
		x = '0 1'
		y = '0 2e-3'
	[]
[]

[Kernels]
	[TensorMechanics]
	[]
[]

[Modules]
	[TensorMechanics]
		[GeneralizePlaneStrain]
			[gps]
			[]
		[]
	[]
[]

[AuxKernels]
	[strian_xx]
		type = RankTwoAux
		rank_two_tensor = total_strian
		variable = strain_xx
		index_i = 0
		index_j = 0
	[]
	[strain_yy]
		type = RankTwoAux
		rank_two_tensor = total_strain
		variable = strain_yy
		index_i = 1
		index_j = 1
	[]
	[strain_zz]
		type = RankTwoAux
		ran_two_tensor = total_strian
		variable = strain_zz
		index_i = 2
		index_j = 2
	[]
	[stress_xx]
		type = RankTwoAux
		rank_two_tensor =stress
		variable = stress_xx
		index_i = 0
		index_j = 0
		execute_on = timestep_end
	[]
	[stress_yy]
		type = RankTwoAux
		rank_two_tensor = stress
		variable = stress_yy
		index_i = 1
		index_j = 1
		execute_on = timestep_end
	[]
	[stress_zz]
		type = RankTwoAux
		rank_two_tensor = stress
		index_i = 2
		index_j = 2
		execute_on = timestep_end
	[]
	[temp]
		type = FunctionAux
		variable = temp
		function = temp
		execute_on = 'timestep_begin'
	[]
[]

[BCs]
	[no_x]
		type = DirichletBC
		boundary = 1
		value = 0
		variable = disp_x
	[]
	[disp_x]
		type = FunctionDirichletBC
		boundary = 2
		function = disp_x
		variable = disp_x
	[]
[]

[Materials]
	[elasticity_tensor]
		type = ComputeIsotropicElasticityTensor
		youngs_modulus = 3600
		poissons_ratio = 0.2
	[]
	[strain]
		type = ComputeAxisymmetric1DFiniteStrain
		eigenstrain_names = eigenstrain
		scalar_out_of_plane_strian = scalar_strian_yy
	[]
	[thermal_strain]
		type = ComputThermalExpansionEigenstrain
		thermal_expansion_coeff = 1e-6
		temperatuer = temp
		stress_free_temperature = 580
		eigenstrain_name = eigenstrain
	[]
	[stress]
		type = ComputeFiniteStrainElasticStress
	[]
[]

[Executioner]
	type = Transient
	solve_type = 'PJFNK'
	line_search = 'none'
	
	l_max_its = 50
	l_tol = 1e-6
	nl_max_its = 15
	nl_rel_tol = 1e-8
	nl_abs_tol = 1e-10
	start_time = 0
	end_time = 2
	num_steps = 2
[]

[Outputs]
	exodus = true
	console = true
[]
```

输入卡是计算一维轴对阵平面应变。

**RankTwoAux**是是为了给二阶张量设置组件（component）。用于存贮二阶张量的单个组建用于展示或者后处理。非对称的二阶张量需要九个独立的辅助变量去存储结果，六个辅助变量对去存储对称的二阶张量。通常用于检查存储的是应力stress和应变strain。

通过设置**index_i**和**index_j**设置组件。二阶张量的组件如下所示：
$$
\sigma_{ij}=\begin{bmatrix} \sigma_{00}\quad \sigma_{01}\quad \sigma_{02}\\ \sigma_{10} \quad\sigma_{11}\quad \sigma_{12} \\ \sigma_{20} \quad\sigma_{21} \quad\sigma_{22}\end{bmatrix}
$$

| 不同的辅助变量类型             | 介绍                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| Elemental Constant Monomial    | 使用的辅助变量是family= MONOMIAL order = CONSTANT，每一个element上的常数值，是积分点上的体积平均，<br />默认的力学计算模型最少的计算资源 |
| Elemental Higher-order Monmial | 使用辅助变量family = MONOMIAL order = FIRST或者是更高阶。因为Exodus网格不知高阶element变量，所以这些<br/>输出需要libMesh。结果输出是平滑的。 |
| Nodal Lagrange                 | 使用辅助变量family = LAGRANGE，AuxKernel的patch_polynomial_order要和辅助变量相同。需要注意花费的时间<br/>变长，同时不支持并行计算。 |

```C++
//.h
template <bool is_ad>
class RankTwoAuxTempl : public NodalPatchRecovery
{
  public:
  static InputParameters validParams();
  RankTwoAuxTempl(const InputParameters & paramters);
  protected:
  virtual Real computeValue();
  private:
  const GenericMaterialProperty<RankTwoTensor, is_ad> & _tensor;
  const unsigned int _i;
  const unsigned int _j;
  const bool _has_selected_qp; //whether or not selected_qp has been set
  const unsigned int _selected_qp; //The std::vector will be evaluated at this quadpoint only if denfined
};
//.C
template <bool is_ad>
InputParameters
RankTwoAuxTempl<is_ad>::validParams()
{
  InputParameters params = NodalPatchRecovery::validParams();
  params.addClassDescription("Access a component of a RankTwoTensor");
  params.addRequiredParam<MaterialPropertyName>("rank_two_tensor", "The rank two material tensor name");
  params.addRequiredRangeCheckedParam<unsigned int>("index_i", "index_i >= 0 & index_i <= 2", "The index i of ij for the tensor to output (0, 1, 2)");
  params.addRequiredRangeCheckedParam<unsigned int>("index_j", "index_j >= 0 & index_j <= 2", "The index j of ij for the tensor to outputs (0, 1, 2)");
  params.addParam<unsigned int>("selected_qp", "Evaluate the tensor at this specific quadpoint");
  params.addParamNamesToGroup("selected_qp", "Advanced");
  return params;
}

template <bool is_ad>
RankTwoAuxTempl<is_ad>::RankTwoAuxTempl(const InputParametrs & paramters)
  : NodalPatchRecovery(parameters),
_tensor(getGenericMaterialProperty<RankTwoTensor, is_ad>("rank_two_tensor")),
_i(getParam<unsigned int>("index_i")),
_j(getParam<unsigned int>("index_j")),
_has_selected_qp(isParamValid("selected_qp")),
_selected_qp(_has_selected_qp ? getParam<unsigned int>("selected_qp") : 0)
{
}

template <bool is_ad>
Real
RankTwoAuxTempl<is_ad>::computeValue()
{
  unsigned int qp = _qp;
  if (_has_selected_qp)
  {
    if (_selected_qp >= _q_point.size())
    {
      Threads::spin_mutex::scoped_lock lock(Threads::spin_mtx);//没看懂这个是用于锁住
      mooseError("RankTwoAux, selected_qp specified as ", 
                _selected_qp, "but there are only" -q_point.size(),
                "quadpoints in the element");
    }
    qp = _selected_qp;
  }
}
return RankTwoScalarTools::component(MetaPhysicL::raw_value(_tensor[qp]), _i, _j);
}
```

输入卡计算的是使用轴对称的一维的平面应变，使用的==ComputeFiniteStrainElasticStress==。

**ComputeFiniteStrainElasticStress**是使用增量形式的应变带来的应力。可以用于small(ADComputeIncrementalSmallStrain)和finite(ADCompteFinteStrain).

> Compute stress using elasticity for finite strains.

$$
\sigma_{ij}= C_{ijkl}\triangle\epsilon_{kl}
$$

其中$\triangle\epsilon$是应变增量。是系统中所有本正应变的总和。

## axisymm_gps_incremental.i

```C++
# this test checks the asixymmetric 1D generalized plan strain formulation using incremental small strains

[GlobalParams]
	displacemnts = disp_x
	scalar_out_of_plane_strain = scalar_strain_yy
[]

[Problem]
	coord_type = RZ
[]

[Mesh]
	file = line.e
[]

[Variables]
	[disp_x]
	[]
	[scalar_strain_yy]
		order = FIRST
		family = SCALAR
	[]
[]

[AuxVariables]
	[strian_xx]
		order = CONSTANT
		family = MONOMIAL
	[]
	[strian_yy]
		order = CONSTANT
		family = MONOMIAL
	[]
	[strain_zz]
		order = CONSTANT
		family = MONOMIAL
	[]
	[stress_xx]
		order = CONSTANT
		family = MONOMIAL
	[]
	[stress_yy]
		order = CONSTANT
		family = MONOMIAL
	[]
	[stress_zz]
		order = CONSTANT
		family = MONOMIAL
	[]
	[temp]
		initial_condition = 580.0
	[]
[]

[Functions]
	[temp]
		type = PiecewiseLinear
		x = '0 1 2'
		y = '580 580 680'
	[]
	[disp_x]
		type = PiecewiseLinear
		x = '0 1'
		y = '0 2e-6'
	[]
[]

[Kerneles]
	[TensorMechanics]
	[]
[]

[Modules]
	[TensorMechanics]
		[GeneralizePlaneStrain]
		[]
	[]
[]

[AuxKernels]
	[strain_xx]
		type = RankTwoAux
		rank_two_tensor = total_strian
		variable = strain_xx
		index_i = 0
		index_j = 0
	[]
	[strain_yy]
		type = RankTwoAux
		rank_two_tensor = total_strain
		variable = strain_yy
		index_i = 1
		index_j = 1
	[]
	[strain_zz]
		type = RankTwoAux
		rank_two_tensor = total_strain
		variable = strain_zz
		index_i = 2
		index_j = 2
	[]
	
	[stress_xx]
		type = RankTwoAux
		rank_two_tensor = stress
		variable = stress_xx
		index_i = 0
		index_j = 0
		execute_on = timestep_end
	[]
	[stress_yy]
		type = RankTwoAux
		rank_two_tensor = stress
		variable = stress_yy
		index_i = 1
		index_j = 1
		execute_on = timestep_end
	[]
	[stress_zz]
		type = RankTwoAux
		rank_two_tensor = stress
		variable = stress_zz
		index_i = 2
		index_j = 2
		execute_on = timestep_end
	[]
	[temp]
		type = FunctionAux
		variable = temp
		function = temp
		execute_on = 'timestep_begin'
	[]
[]

[BCs]
	[no_x]
		type = DirichletBC
		boundary = 1
		value = 0
		variable = disp_x
	[]
	[disp_x]
		type = FunctionDirichletBC
		boundary = 2
		function = disp_x
		variable = disp_x
	[]
[]

[Materials]
	[elsticity_tensor]
		type = ComputeIsotropicElasticityTensor
		youngs_modulus = 3600
		poissons_ratio = 0.2
	[]
	[strain]
		type = ComputeAxisymmetri1DIncrementtalStrain
		eigenstrain_names = eigenstrain
		scalar_out_of_plane_strian = scalar_strian_yy
	[]
	[thermal_strain]
		type = ComputeThermalExpansionEigenstrain
		thermal_expansion_coeff = 1e-8
		temperature = temp
		stress_free_temperature = 580
		eigenstrain_name = eigenstrain
	[]
	[stress]
		type = ComputeStrainIncrementBaseStress
	[]
[]

[Executioner]
	type = Transient
	solve_type = 'PJFNK'
	line_search = 'none'
	
	l_max_its = 50
	l_tol = 1e-6
	nl_max_its = 15
	nl_rel_tol = 1e-8
	nl_abs_tol = 1e-10
	start_time = 0
	end_time = 2
	num_steps = 2
[]

[Outputs]
	exodus = true
	console = true
[]
```

**ComputeStrainIncrementBasedStress**
$$
\sigma_{ij}=\sigma_{ij}^{old} + C_{ijkl}\triangle\epsilon_{jk}^{el}
$$
**ComputeAxisymmetric1DIncremenStrain**

> Compute strain increment for small strains in an axisymmetric 1D problem.

1D Axisymmetric strain formulation
$$
\triangle \epsilon = \frac{1}{2}(D+D^T) \quad where D = A-\bar F+I
$$
这里的$I$是理想的二阶张量，变形梯度$A$和旧的变形梯度$\bar F$表达如下：
$$
A = \begin{bmatrix} \epsilon_{rr}\quad 0 \quad 0\\ 0 \quad \epsilon_{zz} \quad 0\\ 0 \quad 0 \quad \epsilon_{\vartheta \vartheta}\end{bmatrix}\quad and \quad \bar F=\begin{bmatrix}\epsilon_{rr}|_{old} \quad 0 \quad 0 \\ 0 \quad \epsilon_{zz}|_{old} \quad 0 \\ 0 \quad 0 \quad \epsilon_{\vartheta \vartheta}|_{old}\end{bmatrix}
$$
其中$\bar F$使用上一个时间步计算的应变。
$$
\epsilon_{rr} = U_{r,r}\\\epsilon_{zz} = \epsilon|^{op}\\\epsilon_{\vartheta\vartheta}= \frac{u_r}{X_r}
$$
其中$\epsilon|^{op}$是一个规定的平面外应变值。应变可以常量也可以是非线性变量，广义平面应面采用==常量==，应变$\epsilon_{\vartheta\vartheta}$半径方向的位置相关。

## axisymm_gps_small.i

```C++
#this test checks the asixymmetric 1D generalized plane strain formulation using incremental small strains
[GlobalParams]
	displacements = disp_x
	scalar_out_of_plane_strain = scalar_strain_yy
[]

[Problem]
	coord_type = RZ
[]

[Mesh]
	file = line.e
[]

[Variables]
	[disp_x]
	[]
	[scalar_strain_yy]
		order = FIRST
		family = SCALAR
	[]
[]

[AuxVariables]
	[strain_xx]
		order = CONSTANT
		family = MONOMIAL
	[]
	[strain_yy]
		order = CONSTANT
		family = MONOMIAL
	[]
	[strain_zz]
		order = CONSTANT
		family = MONOMIAL
	[]
	[stress_xx]
		order = CONSTANT
		family = MONOMIAL
	[]
	[stress_yy]
		order = CONSTANT
		family = MONOMIAL
	[]
	[stress_zz]
		order = CONSTANT
		family = MONOMIAL
	[]
	[temp]
		initial_conditon = 580
	[]
[]

[Functions]
	[temp]
		type = PiecewiseLinear
		x = '0 1 2'
		y = '580 580 680'
	[]
	[disp_x]
		type = PiecewiseLinear
		x = '0 1'
		y = '0 2e-6'
	[]
[]

[Kernels]
	[TensorMechanics]
	[]
[]

[Modules]
	[TensorMechanics]
		[GeneralizePlaneStrain]
			[gps]
			[]
		[]
	[]
[]

[AuxKernels]
	[strain_xx]
		type = RankTwoAux
		rank_two_tensor = total_strain
		varaible = strain_xx
		index_i = 0
		index_j = 0
	[]
	[strain_yy]
		type = RankTwoAux
		rank_two_tensor = total_strain
		variable = strain_yy
		index_i = 1
		index_j = 1
	[]
	[strain_zz]
		type = RankTwoAux
		rank_two_tensor = total_strain
		variabel = strain_zz
		index_i = 2
		index_j = 2
	[]

	[stress_xx]
		type = RankTwoAux
		rank_two_name = stress
		variable = stress_xx
		index_i = 0
		index_j = 0
		execute_on = timestep_end
	[]
	[stress_yy]
		type = RankTwoAux
		rank_two_name = stress
		variable = stress_yy
		index_i = 1
		index_j = 1
		execute_on = timestep_end
	[]
	[stress_zz]
		type = RankTwoAux
		rank_two_name = stress
		variable = stress_zz
		index_i = 2
		index_j = 2
		execute_on = 'timestep_end'
	[]
	[temp]
		type = FunctionAux
		variable = temp
		function = temp
		execute_on = 'timestep_begin'
	[]
[]

[BCs]
	[no_x]
		type =DirichletBC
		boundary = 1
		value = 0
		varaible = disp_x
	[]
	[disp_x]
		type = FunctionDirichletBC
		boundary = 2
		function = disp_x
		variable = disp_x
	[]
[]

[Materials]
	[elasticity_tensor]
		type = ComputeIsotropicElasticityTensor
		yongs_modules = 3600
		poissons_ratio = 0.2
	[]
	[strain]
		type = ComputeAxisymmetric1DSmallStrain
		eigenstrain_names = eigenstrain
		scalar_out_of_plane_strain = scalar_strain_yy
	[]
	[thermal_strain]
		type = ComputeThermalExpansionEigenstrain
		thermal_expansion_coeff = 1e-8
		temperature = temp
		stess_free_temperature = 580
		eigenstrain_name = eigenstrain
	[]
	[stress]
		type = ComputeLinearElasticStress
	[]
[]

[Executioner]
	type = Transient
	solve_type = 'PJFNK'
	line_search = 'none'
	
	l_max_its = 50
	l_tol = 1e-6
	nl_max_its = 15
	nl_rel_tol = 1e-8
	nl_abs_tol = 1e-10
	start_time = 0
	end_time = 2
	num_steps = 2
[]

[Outputs]
	exodus = true
	console = true
[]
```

**ComputeAxisymmetric1DSmallStrain**

> Compute a small strain in an Axisymmetric 1D problem.

1D Axisymmtetic Strain Formulation

定义的小线性应变
$$
\epsilon _{ij} = \frac{1}{2}(u_{i,j}+u_{j,i})
$$
在轴对称的一维形式下，应变是对角线的
$$
\epsilon{ij} = \begin{bmatrix}\epsilon_{rr} \quad 0 \quad 00 \\ 0 \quad \epsilon_{zz} \quad 0\\0 \quad 0 \quad \epsilon_{\vartheta\vartheta}\end{bmatrix}
$$
其中
$$
\epsilon_{rr} = u_{r,r} \\ \epsilon_{zz} = \epsilon|^{op} \\ \epsilon_{\vartheta \vartheta} = \frac{u_r}{X_r}
$$

## axisymm_plane_strain_finite.i

```C++
#This test checks elastic stress calculations with mechanical and thermal strain using finite strain formulation.
# Yong's modulus is 3600, and Poisson's ratio is 0.2. The axisymmetric, plane strain 1D mesh is pulled with
# displacement of 2e-3. Thus the strain is [log(1+1e-3) = 9.995e-4, 0, log(1+E-3)=9.995E-4](xx, yy, zz).
# This gives stress of [4.9975, 1.999, 4.9975]. After a temperature increase of 100 with alpha of 1e-6,
# the stress becomes [4.3975, 1.399, 4.3975]
[GlobalParams]
	displacements = disp_x
[]

[Problem]
	coord_type = RZ
[]

[Mesh]
	file = line.e
[]

[Variables]
	[disp_x]
	[]
[]

[AuxVariables]
	[temp]
		intial_conditon = 580.0
	[]
[]

[Functions]
	[temp]
		type = PiecewiseLinear
		x = '0 1 2'
		y = '580 580 680'
	[]
	[disp_x]
		type = PiecewiseLinear
		x = '0 1'
		y = '0 2e-3'
	[]
[]

[Modules]
	[TensorMechanics]
		[Master]
			[ps]
				planar_formulaton = PLANE_STRAIN
				strain = FINIE
				generate_output = 'strain_xx strain_zz stress_xx stress_yy stress_zz'
				eigenstrain_names = eigenstrain
			[]
		[]
	[]
[]

[AuxKernels]
	[temp]
		type = FunctionAux
		variable = temp
		function = temp
		execute_on = 'timestep_begin'
	[]
[]

[BCs]
	[no_x]
		type = DirichletBC
		boundary = 1
		value = 0
		varaible = disp_x
	[]
	[disp_x]
		type = FunctionDirichletBC
		boundary = 2
		variable = disp_x
		function = disp_x
	[]
[]

[Materials]
	[elasticity_tensor]
		type = ComputeIsotropicElasticityTensor
		youngs_modulus = 3600
		poissons_ratio = 0.2
	[]

	[thermal_strain]
		type = ComputeThermalExpansionEigenstrain
		thermal_expansion_coeff = 1e-6
		temperature = temp
		stress_free_temperature = 580
		eigenstrain_name = eigenstrain
	[]
	
	[stress]
		type = ComputeFiniteStrainElasticStress
	[]
[]

[Executioner]
	type = Transient
	solve_type = 'PJFNK'
	line_search = 'none'
	
	l_max_its = 50
	l_tol = 1e-6
	nl_max_its = 15
	nl_rel_tol = 1e-8
	nl_abs_tol = 1e-10
	start_time = 0
	end_time = 2
	num_steps = 2
[]

[Outputs]
	exodus = true
	console = true
[]
```

看来这个`TensorMechanics planar_formulation = PLANE_STRAIN`和

```C++
[strain]
		type = ComputeAxisymmetric1DSmallStrain
		eigenstrain_names = eigenstrain
		scalar_out_of_plane_strain = scalar_strain_yy
[]
```

是一样的。

## axisymm_plane_strain_incremental.i

```C++
# this test cheks elastic stress calculations with mechanical and thermal strain
# using incremental small strain formulation. Young's modulus is 3600, and Poisson's ratio is 0.2
# The axisymmetric, plane strain 1D mesh is pulled with 1e-6 strain. Thus, the strain is [1e-6, 0, 1e-6]
# (xx, yy, zz). This gives stress of [5e-3, 2e-3, 5e-3]. After a temperature increase of 100 with alpha of 
# 1e-8, the stress bocomes [-1e-3, -4e-3, =-1e-3]

[GlobalParams]
	displacements = disp_x
[]

[Problem]
	coord_type = RZ
[]

[Mesh]
	file = line.e
[]

[Variables]
	[disp_x]
	[]
[]

[AuxVariables]
	[temp]
		initial_condition = 580.0
	[]
[]

[Functions]
	[temp]
		type = PiecewiseLinear
		x = '0 1 2'
		y = '580 580 680'
	[]
	[disp_x]
		type = PiecewiseLinear
		x = '0 1'
		y = '0 2e-6'
	[]
[]

[Modules]
	[TensorMechanics]
		[Mster]
			[ps]
				planar_formulation = PLANE_STRAIN
				strain = SMALL
				incremental = true
				generate_output = 'strain_xx strain_zz stress_xx stress_yy stress_zz'
				eigenstrain_names = eigenstrain
			[]
		[]
	[]
[]

[AuxKernels]
	[temp]
		type = FunctionAux
		variable = temp
		function = temp
		execute_on = 'timestep_begin'
	[]
[]

[BCs]
	[no_x]
		type = DirichletBC
		variable = disp_x
		boundary = 1
		value = 0
	[]
	[disp_x]
		type = FunctionDirichletBC
		boundary = 2
		function = disp_x
		variable = disp_x
	[]
[]

[Materials]
	[elasticity_tensor]
		type = ComputeIsotropicElasticityTensor
		youngs_modulus = 3600
		poissons_ratio = 0.2
	[]
	
	[thermal_strain]
		type = CoputeThermalExpansionEigenstrain
		thermal_expansion_coeff = 1e-8
		temperature = temp
		stress_free_temperature = 580
		eigenstrain_name = eigenstrain
	[]
	
	[stress]
		type = ComputeStrainIncementBaseStress
	[]
[]

[Executioner]
	type = Transient
	solve_type = 'PJFNK'
	line_search = 'none'
	
	l_max_its = 50
	l_tol = 1e-6
	nl_max_its = 15
	nl_rel_tol = 1e-8
	nl_abs_tol = 1e-10
	start_time = 0
	end_time = 2
	num_steps = 2
[]

[Outputs]
	exodus = true
	console = true
[]
```

`strain = SMALL`和`strain = FINITE`的区别是啥呢

## axisymm_plane_strain_small.i

```C++
#This test checks elastic stress calculations with mechanical and thermal strian using small strain
# formulation. Young's modulus is 3600, and Poisson's ratio is 0.2. The axisymmetric, plane strain 1D mesh is pullde with 1e-6 strain. Thus, the strain is [1e-6, 0, 1e-6](xx, yy, zz). this gives stess of [5e-3, 2e-3,5e-3]. After a temperature increase of 100 with alpha of 1e-8. the stress becomes [-1e-3, -4r-3, -1e-3]

[GlobalParams]
	displacements = disp_x
[]

[Problem]
	coord_type = RZ
[]

[Mesh]
	file = line.e
[]

[Variables]
	[disp_x]
	[]
[]

[AuxVariables]
	[temp]
		initial_condition = 580.0
	[]
[]

[Functions]
	[temp]
		type = PiecewiseLinear
		x = '0 1 2'
		y = '580 580 680'
	[]
	[disp_x]
		type = PiecewiseLinear
		x = '0 1'
		y = '0 2e-6'
	[]
[]

[Modules]
	[TensorMechanics]
		[Master]
			[ps]
				planar_formulation = PLANE_STRAIN
				strain = SMALL
				generte_output = 'strian_xx strain_zz stress_xx stress_yy stress_zz'
				eigenstrain_names = eigenstrain
			[]
		[]
	[]
[]

[AuxKernels]
	[temp]
		type = FunctionAux
		variable = temp
		function = temp
		execute_on = 'timestep_begin'
	[]
[]

[BCs]
	[no_x]
		type = DirichletBC
		boundary = 1
		value = 0
		variable = disp_x
	[]
	[disp_x]
		type = FunctionDirichletBC
		boundary = 2
		function = disp_x
		variable = sisp_x
	[]
	
[]

[Mateials]
	[elsticity_tensor]
		type = ComputeIsotropicElasticityTensor
		yongs_modulus = 3600
		poissons_ratio = 0.2
	[]
	[thermal_strain]
		type = ComputeThermalExpansionEigenstrain
		thermal_expansion_coeff = 1e-8
		temperature = temp
		stesss_free_temperature = 580
		eigenstrain_name = eigenstrain
	[]
	[stress]
		type = ComputeLinearElasticStress
	[]
[]

[Executioner]
	type = Transient
	solve_type = 'PJFNK'
	line_search = 'none'
	
	l_max_its = 50
	l_tol = 1e-6
	nl_max_its = 15
	nl_rel_tol = 1e-8
	nl_abs_tol = 1e-10
	start_time = 0
	end_time = 2
	num_steps = 2
[]

[Outputs]
	exodus = true
	console = true
[]
```

**CoputeLinearElasticStress**

> Compute stress using elasticity for small strains.

弹性应力和弹性形变相关
$$
\sigma_{ij}= C_{ijkl}\epsilon^{total}_{kl}
$$
其中$\epsilon^{total}$是整个应变。包含系统的任何应变。

## axisymmetric_gps_finite.i

```C++
# this test checks the generalized plane strain using finite strain forulation. 
# sine we constrain all the nodes agianst movement and the applied thermla strian
# is very small. the results are the asme as small and incremental samll strain forumulations
[GlobalParams]
	displacements = disp_x
	scalar_out_of_plane_strain = scalar_strain_yy
[]

[Problem]
	coord_type = RZ
[]

[Mesh]
	file = lines.e
[]

[Variables]
	[disp_x]
	[]
	[temp]
		initial_conditon = 580.0
	[]
	[scalar_strain_yy]
		order = FIRST
		family = SCALAR
	[]
[]

[Functions]
	[temp100]
		type = PiecewiseLinear
		x = '0 1'
		y = '580 680'
	[]
	[temp300]
		type = PiecewiseLinear
		x = '0 1'
		y = '580 880'
	[]
[]

[Kernels]
	[heat]
		type = Diffusion
		variable = temp
	[]
[]

[Modules/TensorMechanics/Master]
	[gps]
		planner_formulation = GENERALIZED_PLANE_STRAIN
		scalr_out_of_plane_strain = scalar_strain_yy
		strain = FINITE
		generate_output = 'strain_xx srain_yy strain_zz stress_xx stress_yy stress_zz'
		eigenstrain_names = eigenstrain
		temperature = temp
	[]
[]

[BCs]
	[no_x]
		type = DirichletBC
		boundary = 1000
		value = 0
		variable = disp_x
	[]
	[temp100]
		type = FunctionDirichletBC
		variable = temp
		function = temp100
		boundary = 2
	[]
	[temp300]
		type = FunctionDirichletBC
		variable = temp
		function = temp300
		boundary = 3
	[]
[]

[Materials]
	[elsticity_tensor]
		type = ComputeIsotropicElasticityTensor
		youngs_modules = 3600
		poissions_ratio = 0.2
	[]
	[thermal_strain]
		type = ComputeThermalExpansionEigenstrain
		thermal_expansion_coeff = 1e-8
		temperature = temp
		stress_free_temperature = 580
		eigenstrain_name = eigenstrain
	[]
	
	[stress]
		type = ComputeFiniteStrainElasticStress
	[]
[]

[Executioner]
	type = Transient
	solve_type = 'PJFNK'
	line_search = 'none'
	
	l_max_its = 50
	l_tol = 1e-8
	nl_max_its = 15
	nl_abs_tol = 1e-10
	start_time = 0
	end_time = 1
	num_steps = 1
[]

[Outputs]
	exodus = true
	console = true
[]
```

这两个

`[strain]
	type = ComputeAxisiymmetric1DFiniteStrain
	eigenstrain_names = eigenstrain
	scale_out_of_plane_strain = scalar_strain_yy
[]`

和

`[Modules/TensorMechanics/Master]
	[gps]
		planner_formulation = GENERALIZED_PLANE_STRAIN
		scalr_out_of_plane_strain = scalar_strain_yy
		strain = FINITE
		generate_output = 'strain_xx srain_yy strain_zz stress_xx stress_yy stress_zz'
		eigenstrain_names = eigenstrain
		temperature = temp
	[]
[]`

是一样的，只不过下面这种写法相对集中，不需要自己定义那些输出应力应变的辅助变量。

## axisymmetric_gps_incremental.i

```C++
#This test checks the generialized plane strain using invemental small strain formulation.
# The model consists of two sets of line elemtnts. One undergoes a temperature rise of 
# 100 with the other seeing a temperature rise of 300. Yong's modulus is 3600, and 
# Poisson's ratio is 0.2. The Thermal expansion coefficient is 1e-8, All nodes are constrained
# against movement.
#
# For plane strain case, i.e., without constraining the srtain_yy to be uniform, the 
# stress solution would be [-6e-3, -6e-3, -6e-3] and [-18e-3, -18e-3, -18e-3](xx, yy, zz)
# The generalized plane strain kernels work to balance the force in y direction.
#with out of plane strain of 3e-6, the stress solution becomes [-3e-3, 6e-3, -3e-3] and 
# [-15e-3, -6e-3, -15e-3](xx, yy,zz). This gives a domain integral of out-of-plane stress
#to be zero.

[GlobalParams]
	displacements = disp_x
	scalar_out_of_plane_strain = scalar_strain_yy
[]

[Problem]
	coord_type = RZ
[]

[Mesh]
	file = lines.e
[]

[Variables]
	[disp_x]
	[]
	
	[temp]
		initial_condition = 580.0
	[]
	[scalr_strain_yy]
		order = FIRST
		family = SCALAR
	[]
[]

[Functions]
	[temp100]
		type = PiecewiseLinear
		x = '0 1'
		y = '580 680'
	[]
	[temp300]
		type = PiecewiseLinear
		x = '0 1'
		y = '580 880'
	[]
[]

[Kernels]
	[heat]
		type = Diffusion
		variable = temp
	[]
[]

[Modules/TensorMechanics/Master]
	[gps]
		planar_formulation = GENERALIZED_PLANE_STRAIN
		scalar_out_of_plane_strain = scalar_strain_yy
		strain = SMALL
		incremental = true
		generat_output = 'strain_xx strain_yy strain_zz stress_xx stress_yy stress_zz'
		eigenstrain_names = eigenstrain
		temperature = temp
	[]
[]

[BCs]
	[no_x]
		type = DirichletBC
		boundary = 100
		value = 0
		variable = disp_x
	[]
	
	[temp100]
		type = FunctionDirichletBC
		variable = temp
		function = temp100
		boundary = 2
	[]
	[temp300]
		type = FunctionDirichletBC
		variable = temp
		function = temp300
		boundary = 3
	[]
[]

[Materials]
	[elsticity_tensor]
		type = ComputeIsotropicElasticityTensor
		youngs_modulus = 3600
		poissons_ratio = 0.2
	[]
	
	[thermal_strain]
		type = ComputeThermalExpansionEigenstrain
		thermal_expansion_coeff = 1e-8
		temperature = temp
		stress_free_temperature = temp
		eigenstrain_name = eigenstrain
	[]
	[stress]
		type = ComputeStrainIncrementBasedStress
	[]
[]

[Executioner]
	type = Transient
	solve_type = 'PJFNK'
	line_search = 'none'
	
	l_max_its = 50
	l_tol = 1e-6
	nl_max_its = 15
	nl_abs_tol = 1e-10
	start_time = 0
	end_time = 1
	num_steps = 1
[]

[Outputs]
	exodus = true
	console = true
[]
```

和[axisymm_gps_incremental.i](#axisymm_gs_incremental.i)比较，发现

```C++
[Modules/TensorMechanics/Master]
	[gps]
		planar_formulation = GENERALIZED_PLANE_STRAIN
		scalar_out_of_plane_strain = scalar_strain_yy
		strain = SMALL
		incremental = true
		generat_output = 'strain_xx strain_yy strain_zz stress_xx stress_yy stress_zz'
		eigenstrain_names = eigenstrain
		temperature = temp
	[]
[]
```

与

```C++
[strain]
	type = ComputeAxisymmetric1DIncrementalStrain
	eigenstrain_names = eigenstrain
	scalar_out_of_plane_strain = scalar_strain_yy
[]
```

## axisymmetric_gps_small.i

```C++
# This test checks the generalized plane strain small strain formulation. 
# The model consists of two sets of line elements. One undergoes a tempearute rise of 100
# with the outer seeing a temperature rise of 300. Yongs's moulus is 3600, and Poisson's ratio is 0.2.
# The thermal expansion coefficient is 1e-8. All nodes are constrained against movement.

# For plane strain case, i.e., without constraining the strain_yy to be uniform, the stress solutions would be [-6e-3, -6e-3, -6e-3] and [-18e-3, 18e-3, -18e-3](xx, yy, zz). 
# The generalized plane strain kernels work to balance the force in y direction.

# With out of plane strain of 3e-6, the stress solution becomes [-3e-3, 6e-3, -3e-3] and [-15e-3, -6e-3, -15e-3](xx, yy, zz). 
# This gives a domain integral of out-of-plane stress to be zero.

[GlobalParams]
	displacements = disp_x
	scalar_out_of_plane_strain = scalar_strain_yy
[]

[Problem]
	coord_type = RZ
[]

[Mesh]
	file = lines.e
[]

[Variables]
	[disp_x]
	[]
	[temp]
		intial_condtion = 580.0
	[]
	[scalr_strain_yy]
		order = FIRST
		family = SCALAR
	[]
[]

[Functions]
	[temp100]
		type = PiecewiseLinear
		x = '0 1'
		y =  '580 680'
	[]
	[temp300]
		type = PiecewiseLinear
		x = '0 1'
		y = '580 880'
	[]
[]

[Kernels]
	[heat]
		type = Diffusion
		varaible = temp
	[]
[]

[Modules/TensorMechanics/Master]
	[gps]
		planar_formulation = GENErALIZED_PLANE_STRAIN
		scalar_out_of_plane_strain = scalr_strain_yy
		strain = SMALL
		generate_output = 'strain_xx strain_yy strain_zz stress_xx stess_yy stress_zz'
		eigenstrain_names = eigenstrain
		temperature = temp
	[]
[]

[BCs]
	[no_x]
		type = DirichletBC
		boundary = 1000
		value = 0
		variable = disp_x
	[]
	[temp100]
		type = FunctionDirichletBC
		variable = temp
		function = temp100
		boundary = 2
	[]
	[temp300]
		type = FunctionDirichletBC
		variable = temp
		function = temp300
		boundary = 3
	[]
[]

[Materials]
	[elastivity_tensor]
		type = ComputeIsotropicElasticityTensor
		yongs_modulus = 3600
		poissons_ratio = 0.2
	[]
	[thermal_strain]
		type = ComputeThermalExpansionEigenstrain
		thermal_expansion _coeff = 1e-8
		temperature = temp
		eigenstrain_name = eigenstrain
		stress_free_temperature = 580
	[]
	[strss]
		type = ComputeLinearElasticStess
	[]
[]

[Executeioner]
	type = Transient
	sovle_type = 'PJFNK'
	line_search = 'none'
	
	l_max_its = 50
	l_tol = 1e-8
	nl_max_its = 15
	nl_abs_tol = 1e-10
	strat_time = 0
	end_time = 1
	num_steps = 1
[]

[Outputs]
	exodus = true
	console = true
[]
```



