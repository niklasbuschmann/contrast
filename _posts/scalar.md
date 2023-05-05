#ad_coupled_scalar
##ad_coupled_scalar.i
```
[Mesh]
  type = GeneratedMes
  dim = 1
  nx = 10
[]

[Kernels]
  [diff]
    type = Diffusion
    variable = u
  []
  [time]
    type = TimeDerivative
    variable = u
  []
[]

[ScalarKernels]
  [time]
    type = ODETimeDerivative
    variable = v
  []
  [flux_sink]
    type = PostprocessorSinkScalarKernel
    variable = v
    postprocessor = scale_flux
  []
[]

[BCs]
  [right]
    type = DirichletBC
    value = 0
    variable = u
    boundary = 'right'
  []
  [left]
    type = ADMatchedScalarValueBC
    variable = u
    v = v
    boundary = 'left'
  []
[]

[Variables]
  [u][]
  [v]
    family = SCALAR
    order = FIRST
    initial_condition = 1
  []
[]

[Postprocessors]
  [flux]
    type = SideDiffusiveFluxIntegral
    variable = u
    diffusivity = 1
    boundary = 'left'
    execute_on = 'initial nonlinear linear timestep_end'
  []
  [scale_flux]
    type = ScalePostprocessor
    scaling_factor = -1
    value = flux
    execute_on = 'initial nonlinear linear timestep_end'
  []
[]

[Executioner]
  type = Transient
  dt = 0.1
  end_time = 1
  solve_type = PJFNK
  nl_rel_tol = 1e-12
[]

[Outputs]
  exodus = true
[]
```
*ODETimeDerivative
```C++
//.h
#pragma once
#include "ODETimeKernel.h"
class ODETimeDerivative : public ODETimeKernel
{
  public:
  static InputParameters validParams();
  ODETimeDerivative(const InputParameters & parameters);
  protected:
  virtual Real computeQpResidual() override;
  virtual Real compureQpJacobian() override;
};
//.C
#include "ODETimeDerivative.h"
registerMooseObject("MooseApp", ODETimeDerivative);
InputParameters
ODETimeDerivative::validParams()
{
  InputParameters params = ODETimeKernel::validParams();
  params.addClassDescription("Return the time derivative contribution to the residual for a scalar variable.");
  return params;
}

ODETimeDerivative::ODETimeDerivative(const InputParameters & parameters) :
ODETimeKernel(parameters)
{
}

Real
ODETimeDerivative::computeQpResidual()
{
  return _u_dot[_i];
}

Real
ODETimeDerivative::computeQpJacobian()
{
  if (_i == _j)
    return _du_dot_du[_i];
  else
    return 0;
}
```
*PostprocessorSinkScalarKernel
```
//.h
#pragma once
#include "ODEKernel.h"
class PostprocessorSinkScalarKernel : public ODEKernel
{
  public:
  static InputParameters validParams();
  PostprocessorSinkScalarKernel(const InputParameters & parameters);
  protected:
  Real computeQpResidual() final;// the derivative class can override
  const PostprocessorValue & _pp_value;
};
//.C
#include "PostprocessorSinkScalarKernel.h"

#include "Assembly.h"
#include "MooseVariableScalar.h"
registerMooseObject("MooseTestApp", PostprocessorSinkScalarKernel);

InputParameters
PostprocessorSinkScalarKernel::validParams()
{
  InputParameters params = ODEKernel::validParams();
  params.addRequiredParam<PostprocessorName>("postprocessor", "Name of the Postprocessor whose value will be the sink");
  return params;
}

PostprocessorSinkScalarKernel::PostprocessorSinkScalarKernel(const InputParameters & parameters) : ODEKernel(parameters),
_pp_value(getPostprocessorValue("postprocessor"))
{
}

Real
PostprocessorSinkScalarKernel::computeQpResidual()
{
  return _pp_value;
}
```
#ad_scalar_kernel
##ad_scalar_kernel.i
```
[Mesh]
  type = GeneratedMesh
  dim = 1
  nx = 10
[]

[Kernels]
  [time_w]
    type = TimeDerivative
    variable = w
  []
  [diff_w]
    type = Diffusion
    variable = w
  []
[]

[ScalarKernels]
  [time_u]
    type = ADScalarTimeDerivative
    variable = u
  []
  [test_u]
    type = TestADScalarKernel
    variable = u
    v = v
    test_uo = test_uo
  []
  [time_v]
    type = ADScalarTimeDerivative
    variable = v
  []
[]

[UserObjects]
  [test_uo]
    type = TestADScalarKernelUserObject
    variable = w
    execute_on = 'LINEAR NONLINEAR'
  []
[]

[BCs]
  [left]
    type = DirichletBC
    value = 0
    variable = w
    boundary = 'left'
  []
  [right]
    type = DirichletBC
    value = 1
    variable = w
    boundary = 'right'
  []
[]

[Variables]
  [u]
    family = SCALAR
    order = FIRST
    initial_condition = 1.0
  []
  [v]
    family = SCALAR
    order = FIRST
    initial_condition = 3.0
  []
  [w]
    family = LAGRANGE
    order = FIRST
    initial_condition = 3.0
  []
[]

[Executioner]
  type = Transient
  dt = 0.1
  num_steps = 1
  solve_type = NEWTON
[]
```
*****TestADScalarKernel**
```
//.h
no
```
##ad_scalar_time_derivative
###ad_scalar_time_derivative.i
```
[Mesh]
  type = GeneratedMesh
  dim = 1
  nx = 1
[]
[variables]
  [u]
    family = SCALAR
    order = FIRST
    initial_condition = 0
  []
[]

[ScalarKernels]
  [time]
    tyep = ADScalarTimeDerivative
    variable = u
  []
  [source]
    type = ParsedODEKernel
    variable = u
    expression = '-5'
  []
[]

[Executioner]
  type = Transient
  scheme = implicit-eule
  dt = 1.0
  num_steps = 3
  solve_type = NEWTON
  nl_abs_tol = 1e-10
[]

[Outputs]
  csv = true
[]
```
