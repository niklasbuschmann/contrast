#dynamics
##acceleration_bc
```C++
[Mesh]
  type = GeneratedMesh
  dim = 3
  nx = 1
  ny = 1
  nz = 1
  xmin = 0.0
  xmax = 0.1
  ymin = 0.0
  ymax = 1.0
  zmin = 0.0
  zmax = 0.1
[]

[GlobalParams]
  displacements = 'disp_x disp_y disp_z'
[]

[Variables]
  [disp_x]
  []
  [disp_y]
  []
  [disp_z]
  []
[]

[AuxVariables]
  [vel_x][]
  [accel_x][]
  [vel_y][]
  [accel_y][]
  [vel_z][]
  [accel_z][]
  [stress_yy]
    order = CONSTANT
    family = MONOMIAL
  []
  [strain_yy]
    order = CONSTANT
    family = MONOMIAL
  []
[]

[Kernels]
  [TensorMechanics]
  []
  [inertia_x]
    type = InertialForce
    variable = disp_x
    velocity = vel_x
    acceleration = accel_x
    beta = 0.25
    gamma = 0.5
  []
  [inertia_y]
    type = InertialForce
    variable = disp_y
    velocity = vel_y
    acceleration = accel_y
    beta = 0.25
    gamma = 0.5
  []
  [inertia_z]
    type = InertialForce
    variable = disp_z
    velocity = vel_z
    acceleration = accel_z
    beta = 0.25
    gamma = 0.5
  []
[]

[AuxKernels]
  [accel_x]
    type = NewmarkAccelAux
    variable = accel_x
    displacement = disp_x
    velocity = vel_x
    beta = 0.25
    execute_on = timestep_end
  []
  [vel_x]
    type = NewmarkVelAux
    variable = vel_x
    acceleration = accel_x
    gamma = 0.5
    execute_on = timestep_end
  []
  [accel_y]
    type = NewmarkAccelAux
    variable = accel_y
    displacement = disp_y
    velocity = vel_y
    beta = 0.25
    execute_on = timestep_end
  []
  [vel_y]
    type = NewmarkVelAux
    variable = vel_y
    acceleration = accel_y
    gamma = 0.5
    execute_on = timestep_end
  []
  [accel_z]
    type = NewmarkAccelAux
    variable = accel_z
    displacement = disp_z
    velocity = vel_z
    beta = 0.25
    execute_on = timestep_end
  []
  [vel_z]
    type = NewmarkVelAux
    variable = vel_z
    acceleration = accel_z
    gamma = 0.5
    execute_on = timestep_end
  []
  [stress_yy]
    type = RankTwoAux
    rank_two_tensor = stress
    variable = stress_yy
    index_i = 0
    index_j = 1
  []
  [strain_yy]
    type = RankTwoAux
    rank_two_tensor = total_strain
    variable = strain_yy
    index_i = 0
    index_j = 1
  []
[]

[Functions]
  [acceleration_bottom]
    type = PiecewiseLinear
    data_file = acceleration.csv
    format = columns
  []
[]

[BCs]
  [top_y]
    type = DirichletBC
    variable = disp_y
    boundary = top
    value = 0.0
  []
  [top_z]
    type = DirichletBC
    variable = disp_z
    boundary = top
    value = 0.0
  []
  [bottom_y]
    type = DirichletBC
    variable = disp_y
    boundary = bottom
    value = 0.0
  []
  [bottom_z]
    type = DirichletBC
    variable = disp_z
    boundary = bottom
    value = 0.0
  []
  [preset_axxelertion]
    type = PresetAcceleration
    boundary = bottom
    function = acceleration_bottom
    variable = disp_x
    beta = 0.25
    acceleration = accel_x
    velocity = vel_x
  []
[]

[Materials]
  [Elasticity_tensor]
    type = ComputeElasticityTensor
    fill_method = symmetric_isotropic
    C_ijkl = '210e9 0'
  []
  [strain]
    type = ComputeSmallStrain
  []
  [stress]
    type = ComputeLinearElasticStress
  []
  [density]
    type = GenericConstantMaterial
    prop_names = 'density'
    prop_values = '7750'
  []
[]

[Executioner]
  type = Transient
  solve_type = 'PJFNK'
  petsc_options_iname = '-pc_type -pc_hypre_type -ksp_gmres_restart'
  petsc_options_value = 'hypre boomeramg 101'
  start_time = 0.0
  end_time = 2.0
  dt = 0.01
  dtmin = 0.01
  nl_abs_tol = 1e-8
  nl_rel_tol = 1e-8
  l_tol = 1e-8
  timestep_tolerance = 1e-8
[]

[Postprocessors]
  [dt]
    type = TimestepSize
  []
  [disp]
    type = NOdalVariableValue
    variable = disp_x
    nodeid = 1
  []
  [vel]
    type = NodalVariableValue
    variable = vel_x
    nodeid = 1
  []
  [accel]
    type = NodalVariableValue
    variable = accel_x
    nodeid = 1
  []
[]

[Outputs]
  exodus = true
  perf_graph = true
[]
```
**InertialForce**其中根据动力学的理论，这些变量分别代表。
_beta = \beta
*_u_old[_qp] = u(t)
*_vel_old[_qp] = velq2
*_accel_old[_qp] = vel-dot
_eta[_qp] = eta
_time_integrator.isLumped() _time_integrator.isExplicit()
_density[_qp] + _density_scaling[_qp] = M
*_du_dotdot_du[_qp] = _beta * _dt * _dt
*_du_dot_dt[_qp] = _gamma /_beta /dt
velocity = vel_x
vel_x in NewmarkVelAux

这与$M\ddot{u}+C\dot{u}$相对应。其中对于$\ddot{u}$有两种处理方式，一种是Newmark时间积分，这两种积分分别对应辅助变量中的**NewmarkAccelAux**和**NewmarkVelAux**这两个。分别对应的表达式是
$$
\ddot{u}(t+\triangle t) = \frac{u(t+\triangle t)}{\beta\triangle t^2}-\frac{\dot{u}(t)}{\beta\triangle t} + \frac{\beta-0.5}{\beta}\ddot{u(t)}
$$

$$
\dot{u}(t+\triangle t) = \dot{u}(t)+(1-\gamma)\triangle t\ddot{u}(t)+\gamma\triangle t\ddot{u}(t+\triangle t)
$$

另一种是Hilber-Hughes-Taylor时间积分
$$
M\ddot{u}(t+\triangle t) + C[(1+\alpha)\dot{u}(t+\triangle t)-\alpha \dot{u}(t)]+(1+\alpha)Ku(t+\triangle t)-\alpha Ku(t) = F_{ext}(t+(1+\alpha)\triangle t)
$$




**NewmarkVelAux**对应公式2

> Calcualtes velocity using Newmark time integration scheme
```C++
#pragma once
#include "AuxKernel.h"

class NewmarkVelAux : public AuxKernel
{
  public:
  static InputParameters validParams();
  NewmarkVelAux(const InputParameters & parameters);
  virtual ~NewmarkVelAux() {}
  protected:
  virtual Real computeValue();

  const VariableValue & _accel_old;
  const VariableValue & _accel;
  const VariableValue & _u_old;
  Real _gamma;
};

//.C
#include "NewmarkVelAux.h"

registerMooseObject("TensorMechanicsApp", NewmarkVelAux");

InputParameters
NewmarkVelAux::validParams()
{
  InputParameters params = AuxKernel::validParams();
  params.addClassDescription("Computes the current velocity using the Newmark method");
  params.addRequiredCoupledVar("acceleration", "acceleration variable");
  params.addParam<Real>("gamma", "gamma parameter for Newmark method");
  return params;
}

NewmarkVelAux::NewmarkVelAux(const InputParameters & parameters)
: AuxKernel(parameters),
_accel_old(coupledValueOld("acceleration")),
_accel(coupledValue("acceleration")),
_u_old(uOld()),
_gamma(getParam<Real>("gamma"))
{
}

Real
NewmarkVelAux::computeValue()
{
  Real vel_old = _u_old[_qp];
  if (!isNodal())
    mooseError("must run on a nodal variable");
  //Calculates Velocity using Newmark time integration scheme
  return vel_old + (_dt * (1 - _gamma)) * _accel_old[_qp] + _gamma * _dt * _accel[_qp];
}
```
**NewmarkAccelAux**对应公式1

```C++
//.h
#pragma once
#include "AuxKernel.h"

class NewmarkAccelAux : public AuxKernel
{
  public:
  static InputParameters validParams();
  NewmarkAccelAux(const InputParameters & parameters);
  virtual ~NewmarkAccelAux() {}
  protected:
  virtual Real computeValue();
  const VariableValue & _disp_old;
  const VariableValue & _disp;
  const VariableValue & _vel_old;
  const VariableValue & _u_old;
  Real _beta;
};

//.C
#include "NewmarkAccelAux.h"

registerMooseObject("TensorMechanicsApp", NewmarkAccelAux);

InputParameters
NewmarkAccelAux::validParams()
{
  InputParameters params = AuxKernel::validParams();
  params.addClassDescription("Compute the current acceleration using the Newmark method.");
  params.addRequiredCoupledVar("displacement", "displacement variable");
  params.addRequiredCoupledVar("velocity", "velocity variable");
  params.addRequiredParam<Real>("beta", "beta parameter for Newmark method");
  return params;
}

NewmarkAccelAux::NewmarkAccelAux(const InputParameters & parameters)
  : AuxKernel(parameters),
  _disp_old(coupledValueOld("displacement")),
  _disp(coupledValue("displacement")),
  _vel_old(coupledValueOld("velocity")),
  _u_old(uOld()),
  _beta(getParam<Real>("beta"))
{
}

Real
NewmarkAccelAux::computeValue()
{
  if (!isNodal)
    mooseError("must run on a nodal variable");
  Real accel_old = _u_old[_qp];
  if (_dt == 0)
    return accel_old;
  //Calculates acceleration using Newmark time integration method
  return 1.0 / _beta *
         ((_disp[_qp] - _disp_old[_qp]) / (_dt * _dt) - _vel_old[_qp] / _dt - accel_old * (0.5 - _beta));
}
```
##linear_constraint
###disp_mid.i
```C++
[Mesh]
  file=rect_mid.e
[]

[Variables]
  [disp_x]
  []
  [disp_y]
  []
[]

[Kernels]
  [TensorMechanics]
    displacements = 'disp_x disp_y'
  []
[]

[BCs]
	[top_2x]
		type = DirichletBC
		variable = disp_x
		boundary = 10
		value = 2.0
	[]
	[top_2y]
		type = DirichletBC
		variable = disp_y
		boundary = 10
		value = 0.0
	[]
	[bottom_1]
		type = DirichletBC
		variable = disp_y
		boundary = 1
		value = 0.0
	[]
	[bottom_2]
		type = DirichletBC
		variable = disp_x
		boundary = 1
		value = 0.0
	[]
[]

[Materials]
	[Elasticity_tensor_1]
		type = ComputeElasticityTensor
		block = 1
		fill_method = 'symmetric_isotropic'
		C_ijkl = '400. 200.'
	[]
	
	[strain_1]
		type = ComputeSmallStrain
		block = 1
		displacement = 'disp_x disp_y'
	[]
	[stress_1]
		type = ComputeLinearElasticStress
		block = 1
	[]
	[density_1]
		type = GenericConstantMaterial
		block = 1
		prop_names = 'density'
		prop_values = '10.'
	[]
	
	[Elasticity_tensor_2]
		type = ComputeElasticityTensor
		block = 2
		fill_method = 'symmetric_isotropic'
		C_ijkl = '1000. 500.'
	[]
	[strain_2]
		type = ComputeSmallStrain
		block = 2
		displacements = 'disp_x disp_y'
	[]
	[stress_2]
		type = ComputeLinearElasticStress
		block = 2
	[]
	[density_2]
		type = GenericConstantMaterial
		block = 2
		prop_names = 'density'
		prop_values = '10'
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'PJFNK'
	petsc_options_iname = ''
	petsc_options_value = ''
	line_search = 'none'
[]

[Constraints]
	[disp_x_1]
		type = LinearNodalConstraint
		variable = disp_x
		primary = '0 5'
		weights = '0.25 0.75'
		secondary_node_ids = '2 3'
		penalty = 1e8
		formulation = kinematic
	[]
	[disp_y_1]
		type = LinearNodalConstraint
		variable = disp_y
		primary = '0 5'
		weights = '0.25 0.75'
		secondary_node_ids = '2 3'
		penalty = 1e8
		formulation = kinematic
	[]
[]

[Postprocessors]
	[dt]
		type = TimestepSize]
	[]
	[disp_1]
		type = NodalVariableValue
		nodeid = 0
		variable = disp_x
	[]
	[disp_2]
		type = NodalVariableValue
		nodeid = 1
		variable = disp_x
	[]
	[disp_3]
		type = NodalVariableValue
		nodeid = 2
		variable = disp_x
	[]
	[disp_4]
		type = NodalVariableValue
		nodeid = 3
		variable = disp_x
	[]
	[disp_5]
		type = NodalVariableValue
		nodeid = 4
		variable = disp_x
	[]
	[disp_6]
		type = NodalVariableValue
		nodeid = 5
		variable = disp_x
	[]
[]

[Outputs]
	exodus = true
	print_linear_residauls = true
	perf_graph = true
	[console]
		type = Console
		output_linear = true
	[]
[]	
```
$\color{red}**attentation**$

>this part is not follow in file
##rayleigh_damping
###rayleigh_newmark_dependent.i
```C++
[Mesh]
  type = GeneratedMesh
  dim = 3
  nx = 1
  ny = 1
  nz = 1
  xmin = 0.0
  xmax = 0.1
  ymin = 0.0
  yamx = 1.0
  zmin = 0.0
  zmax = 1.0
[]

[Variables]
  [disp_x][]
  [disp_y][]
  [disp_z][]
[]

[AuxVariables]
  [vel_x]
  []
  [accel_x]
  []
  [vel_y]
  []
  [accel_y]
  []
  [vel_z]
  []
  [accel_z]
  []
  [stress_yy]
    order = CONSTANT
    family = MONOMIAL
  []
  [strain_yy]
    order = CONSTANT
    family = MONOMIAL
  []
[]

[Kernels]
  [DynamicTensorMechanics]
    displacements = 'disp_x disp_y disp_z'
    stiffness_damping_coefficient = 'zeta_rayleigh'
  []
  [inertia_x]
    type = InertialForce
    variable = disp_x
    velocity = vel_x
    acceleration = accel_x
    beta = 0.25
    gamma = 0.5
    eta = 'eta_rayleigh'
  []
  [inertia_y]
    type = InertialForce
    variable = disp_y
    velocity = vel_y
    acceleration = accel_y
    beta = 0.25
    gamma = 0.5
    eta = 'eta_rayleigh'
  []
  [inertia_z]
    type = InertialForce
    variable = disp_z
    velocity = vel_z
    acceleration = accel_z
    beta = 0.25
    gamma = 0.5
    eta = 'eta_rayleigh'
  []
[]

[AuxKernels]
  [accel_x]
    type = NewmarkAccelAux
    variable = accel_x
    displacements = disp_z
    velocity = vel_x
    beta = 0.25
    execute_on = timestep_end
  []
  [vel_x]
    type = NewmarkVelAux
    variable = vel_x
    acceleration = accel_x
    gamma = 0.5
    execute_on = timestep_end
  []
  [accel_y]
    type = NewmarkAccelAux
    variable = accel_y
    displacement = disp_y
    velocity = vel_y
    beta = 0.25
    execute_on = timestep_end
  []
  [vel_y]
    type = NewmarkVelAux
    variable = vel_y
    acceleration = accel_y
    gamma = 0.5
    execute_on = timestep_end
  []
  [accel_z]
    type = NewmarkAccelAux
    variable = accel_z
    velocity = vel_z
    beta = 0.25
    execute_on = timestep_end
  []
  [vel_z]
    type = NewmarkVelAux
    variable = vel_z
    acceleration = accel_z
    gamma = 0.5
    execute_on = timestep_end
  []
  [stress_yy]
    type = RankTwoAux
    rank_two_tensor = stress
    variable = stress_yy
    index_i = 1
    index_j = 1
  []
  [strain_yy]
    type = RankTwoAux
    rank_two_tensor = strain
    variable = strain_yy
    index_i = 1
    index_j = 1
  []
[]

[BCs]
  [top_y]
    type = DirichletBC
    variable = disp_y
    value = 0.0
    boundary = top
  []
  [top_x]
    type = DirichletBC
    variable = disp_x
    boundary = top
    value = 0.0
  []
  [top_z]
    type = DirichletBC
    variable = disp_z
    boundary = top
    value = 0.0
  []
  [bottom_x]
    type = DiricheltBC
    variable = disp_x
    boundary = bottom
    value = 0.0
  []
  [bottom_z]
    type = DiricheltBC
    variable = disp_z
    boundary = bottom
    value = 0.0
  []
  [Pressure]
    [Side1]
      boundary = bottom
      function = pressure
      displacements = 'disp_x disp_y disp_z'
      factor = 1
    []
  []
[]

[Materials]
  [Elasticity_tensor]
    type = ComputeElasticityTensor
    block = 0
    fill_method = 'symmetric_isotropic'
    C_ijkl = '210e9 0'
  []
  [strain]
    type = ComputeSmallStrain
    block = 0
    displacement = 'disp_x disp_y disp_z'
  []
  [stress]
    type = computeLinearElasticStress
    block = 0
  []
  [density]
    type = GenericConstantMaterial
    block = 0
    prop_names = 'density'
    prop_values = '7750'
  []
  [materials_zeta]
    type = GenericConstantMaterial
    block = 0
    prop_names = 'zeta_rayleigh'
    prop_values = '0.1'
  []
  [materials_eta]
    type = GenericConstantMaterial
    block = 0
    prop_names = 'eta_rayleigh'
    prop_values = '0.1'
  []
[]

[Executioner]
  type = Transient
  start_time = 0
  end_time = 2
  dt = 0.1
[]

[Functions]
  [pressure]
    type = PiecewiseLinear
    x = '0.0 0.1 0.2 1.0 2.0 5.0'
    y = '0.0 0.1 0.2 1.0 1.0 1.0'
    scale_factor = 1e9
  []
[]

[Postprocessors]
  [__dt]
    type = TimestepSize
  []
  [disp]
    type = NodalExtremValue
    variable = dip_y
    boundary = bottom
  []
  [vel]
    type = NodalExtremValue
    variable = vel_y
    boundary = bottom
  []
  [accel]
    type = NodalExtremValue
    variable = accel_y
    boundary = bottom
  []

  [stress_yy]
    type = ElementAverageValue
    variable = stress_yy
  []
  [strain_yy]
    type = ElementAverageValue
    variable = strain_yy
  []
[]

[Outputs]
  file_base = 'rayleigh_newmark_out'
  exodus = true
  perf_graph = true
[]
```
**DynamicTensorMechanicsAction**
```C++
//.h
#pragma once
#include "TensorMechanicsAction.h"

class DynamicTensorMechanicsAction : public TensorMechanicsAction
{
  public:
  static InputParameters validParams();
  DynamicTensorMechanicsAction(const InputParameters & params);
  virtual void act() override;
  protected:
  virtual std::string getKernelType() override;
  virtual InputParameters getKernelParameters(*std::string type) override;

  std::vector<AuxVariableName> _velocities();
  std::vector<AuxVariableName> _accelerations;

  const Real _newmark_beta;
  const Real _newmark_gamma;
  const Real _hht_alpha;
};

//.C
#include "DynamicTensorMechanicsAction.h"
#include "Factory.h"
#inlcude "FEProblem.h"
#include "Parser.h"

registerMooseAction("TensorMechanicsApp", DynamicTensorMechanicsAction. "meta_action");
registerMooseAction("TensorMechanicsApp", DynamicTensorMechanicsAction, "setup_mesh_complete");
registerMooseAction("TensorMechanicsApp", DynamicTensorMechanicsAction, "validate_coordinate_systems");
registerMooseAction("TensorMechanicsApp", DynamicTensorMechanicsAction, "add_variabel");
registerMooseAction("TensorMechanicsApp", DynamicTensorMechanicsAction, "add_aux_variable");
registerMooseAction("TensorMechanicsApp", DynamicTensorMechanicsAction, "add_kernel");
registerMooseAction("TensorMechanicsApp", DynamicTensorMechanicsAction, "add_aux_variable");
registerMooseAction("TensorMechanicsApp", DynamicTensorMechanicsAction, "add_materials");
registerMooseAction("TensorMechanicsApp", DynamicTensorMechanicsAction, "add_master_action_material");

InputParameters
DynamicTensorMechanicsAction::validParams();
{
  InputParameters params = TensorMechanicsAction::validParams();
  params.addclassdescription("Set up dynmaic stress divergence kernels");
  params.addParam<bool>("static_initialization",
                        false,
                        "set to true get the system to "
                        "equilibrium under gravity by running a "
                        "quasi-static analysis (by solving Ku = F)"
                        "in the first time step");
  params.addParam<std::vector<AuxVariableName>>("velocities", std::vector<AuxVariableName>({"vel_x", "vel_y", "vel_z"}), "Names of the velocity variables");
  params.addParam<std::vector<AuxVariableName>>("accelerations", std::vector<AuxVariableName>({"accel_x", "accel_y", "accel_z"}), "Names of the acceleration variables");
  params.addParam<Real>("hht_alpha",
                        0,
                        "alpha parameter for mass denpendent numerical damping incluede "
                        "by HHT time integration scheme.");
  params.addParam<Real>("newmark_beta", 0.25, "beta parameters for Newmark Time integration");
  params.addParam<Real>("newmark_gamma", 0.5, "gamma parameter for Newmark Time integration");
  params.addParam<MaterialPropertyName>("mass_damping_coefficient",
                                        0.0,
                                        "Name of material property or a constant real"
                                        "number defining mass Rayleigh parameter (eta).");
  params.addParam<MaterialPropertyName>("stiffness_damping_coefficient",
                                        0.0,
                                        "Name of material property or a constant real"
                                        "number defining stiffness Rayleigh parameter (zeta).");
  params.addParam<MaterialPropertyName>("density", "density", "Name of Material Property that provides the density");
  params.addParamNamesToGroup("hht_alpha newmark_beta newmark_gamma",
                              "Time integration parameters");
  //Deprecated parameters
  params.addDeprecatedParam<Real>("alpha",
                                  "alpha parameters for mass denpendent numerical damping induced"
                                  "by HHT time integration scheme",
                                  "Please use hht_alpha");
  params.addDeprecatedParam<Real>("beta", "beta parameter for Newmark Time integration", "Please use newmark_beta");
  params.addDeprecatedParam<Real>("gamma", "gamma parameter for Newmark Time integration", "Please use newmark_gamma");
  params.addDeprecatedParam<Real>("eta", "Name of material property or a constant real"
                                  "number defining mass Rayleigh parameter (eta)",
                                  "Please use mass_damping_coefficient");
  params.addDeprecatedParam<MaterialPropertyName>("zeta",
                                                  "Name of material property or a constant real" 
                                                  "number defining stiffness Rayleigh parameter (zeta).",
                                                  "Please use stiffness_damping_coefficient");
  return params;
}

DynamicTensorMechanicsAction::DynamicTensorMechanicsAction(const InputParameters & params)
: TensorMechanicsAction(params),
_velocities(getParam<std::vector<AuxVariableName>>("velocities")),
_accelerations(getParam<std::vector<AuxVariableName>("accelerations")),
_newmark_beta(isParamValid("beta") ? getParam<Real>("beta") : getParam<Real>("newmark-beta")),
_newmark_gamma(isParamValid("gamma") ? getParam<Real>("gamma") : getParam<Real>("newmark_gamma"),
_hht_alpha(isParamValid("alpha") ? getParam<Real>("alpha") : getParam<Real>("hht_alpha"))
{
}

void
DynamicTensorMechanicsAction::act()
{
  const std::array<std::string, 3> dir{{"x", "y", "z"}};

  if (_velocities.size() < _ndisp)
    paramError("velocities", "Supply one velocity variable per displacement direction");
  if (_accelerations.size() < _ndisp)
    paramError("accelerations", "Supply one acceleration variable per displacement direction");
  // add aux variable for velocities and accelerations
  if (_current_task == 'add_aux_variable' && getParam<bool>("add_variables"))
  {
    auto params = _factory.getValidParams("MooseVariable");
    //determin necessary order
    const bool second = _problem->mesh().hasSecondOrderElelements();

    params.set<MooseEnum>("order") = second ? "SECOND" : "FIRST";
    params.set<MooseEnum>("family") = "LAGRANGE";

    for (unsigned int i = 0; i < _ndisp; ++i)
    {
      _problem->addAuxVariable("MooseVariable", _velocities[i], params);
      -problem->addAxuVariable("MooseVariable", _accelerations[i], params);
    }
  }

// Add auxkernel kernels for velocities and accelerations
  if (_current_task == "add_aux_variable")
  {
    //Note: AuxKernels that are limited to TIMESTEP_END to not get their dependencies
    // resolved automatically. Thus we must construct the acceleration kernels first. NewmarkAccelAux only uses the old velocity.
    //acceleration aux kernels
    for (usnigned int i = 0; i < _ndisp; ++i)
    {
      auto kernel_type = "NewmarkAccelAux"
      auto params = _factory.getValidParams(kernel_type);
      params.set<AuxVariableName>("variable") = _accelerations[i];
      params.set<std::vector<VariableName>>("displacement") = {_displacements[i]};
      params.set<std::vector<VariableName>>("velocity") = {_velocities[i]};
      params.set<ExecFlagEnum>("execute_on") = EXEC_TIMESTEP_END;
      params.set<Real>("beta") = _newmark_beta;
      params.applyParameters(parameters());
      _problem->addAuxKernel(kernel_type, "TM_" + name() + ' ' + _accelerations[i], params);
    }
    // velocity aux kernels
    for (unsigned int i = 0; i < _ndisp; ++i)
    {
      auto kernel_type = "NewmarkVelAux";
      auto params = _factory.getValidParams(kernel_type);
      params.set<AuxVariableName>("variable") = _velocities[i];
      params.set<std::vector<VariableName>>("acceleration") = {_accelerations[i]};
      params.set<ExecFlagEnum>("execute_on") = EXEC_TIMESTEP_END;
      params.set<Real>("gamma") = _newmark_gamma;
      params.applyParameters(parameters());
      _problem->addAuxKernel(kernel_type, "TM_" + nam() + '_' + _velocities[i], params);
    }
  }
  //add inertia kernel
  if (_current_task == "add_kernel")
  {
    for (unsigned int i = 0; i < _ndisp; ++i)
    {
      auto kernel_type = _use_ad ? "ADInertialForce" : "InertialForce";
      auto params = _factory.getValidParams(kernel_type);

      params.set<NonlinearvariableName>("variable") = _displacements[i];
      params.set<std::vector<VaraibleName>>("velocity") = {_velocities[i]};
      params.set<std::vector<VariableName>>("acceleration") = {_accelerations[i]};
      params.set<bool>("use_displaced_mesh") = false;
      params.set<Real>("beta") = _newmark_beta;
      params.set<Real>("gamma") = _newmark_gamm;
      params.set<Real>("alpha") = _hht_alpha;
      params.set<MaterialPropertyName>("eta") = isParamValid("eta") ? getParam<MaterialPropertyName>("eta") : getParam<MaterialPropertyName>("mass_damping_coefficient");
      params.applyParameters(parameters());
      _problem->addKernel(kernel_type, "TM_" + name() + "_inertia_" + dir[i], params);
    }
  }
  //call parent class method
  TensorMechanicsAction::act();
}

std::string
DynamicTensorMechanicsAction::getkernelType()
{
  //choose kernel type based on coordinate system
  if (_coord_system == Moose::COORD_XYZ)
    return "DynmaicStressDivergenceTensors";
  else
    mooseError("Unsupported coordiante system");
}

InputParameters
DynamicTensorMechanicsAction::getKernelParameters(std::string type)
{
  TensorMechanicsAxtion::getkernelParameters(type);
  InputParameters params = _factory.getValidParams(type);
  params.applyparameters(parameters(), {"zeta", "alpha"});
  params.set<Real>("alpha") = isParamValid("alpha") ? getParam<Real>("alpha") : getParam<Real>("hht_alpha");
  params.set<MaterialPropertyName>("zeta") = isParamValid("zeta") ? getParam<MaterialPropertyName>("zeta") : getParam<MaterialPropertyName>("stiffness_damping_coefficient");
  return params;
}
```
##central_difference/consistent/1D

###1d_consisent_implicit.i

```C++
[Mesh]
  type = GeneratedMesh
  xmin = 0.0
  xmax = 10
  nx = 5
  dim = 1
[]

[Variables]
  [disp_x]
    order = FIRST
    family = LAGRANGE
  []
[]

[AuxVariables]
  [accel_x]
  []
  [vel_x]
  []
[]

[AuxKernels]
  [accel_x]
    type = TestNewmarkTI
    variable = accel-x
    displacement = disp_x
    first = false
  []
  [vel_x]
    type = TestNewmarkTI
    variable = vel_x
    displacement = disp_z
  []
[]

[Kernels]
  [DynamicTensormechanics]
    displacements = 'disp_x'
  []
  [inertia_x]
    type = InertialForce
    variable = disp_x
  []
[]

[NOdalKernels]
  [force_x]
    type = UserForcingFunctionNodalKernel
    variable = disp_x
    boundary = right
    function = force_x
  []
[]

[Functions]
  [force_x]
    type = PiecewiseLinear
    x = '0.0 1.0 2.0 3.0 4.0'
    y = '0.0 1.0 0.0 -1.0 0.0'
    scale-factor = 1e3
  []
[]

[BCs]
  [fixx1]
    type = DirichletBC
    variable = disp_x
    boundary = left
    value = 0.0
  []
[]

[Materials]
  [elasticity_tensor_block]
    type = ComputeIsotopicElasticityTensor
    youngs_modulus = 1e6
    poissons_ratio = 0.25
    block = 0
  []
  [strain_block]
    type = ComputeIncrementalSmallStrain
    block = 0
    displacements = 'disp_x'
    
```
