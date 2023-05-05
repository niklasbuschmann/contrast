<center>Functions
</center>

# coarsened_piecewise_linear

## coarsened_piecewise_linear.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 1
[]

[Variables]
	[dummy]
	[]
[]

[Problem]
	solve = false
	kernel_converage_check = false
[]

[Functions]
	[input]
		type = CoarsenedPiecewiseLinear
		data_file = input.csv
		format = columns
		epsilon = 0.1
		x_scale = 0.03
	[]
[]

[VectorPostprocessors]
	[F]
		type = PiecewiseFunctionTabulate
		function = input
		execute_on = INITIAL
		outputs = vpp
	[]
[]

[Executioner]
	type = Transient
	num_steps = 1
[]

[Outputs]
	[vpp]
		type = CSV
		excute_vector_postprocessors_on = INITIAL
	[]
[]
```

**CoarsenedPiecewiseLinear**对表格数据进行降采样，然后使用线性插值。

> Perform a point reduction of the tabulated data upon initialization, then evaluate using a linear interpolation.

和<u>PiecewiseLInear</u>很像，除了使用Gamer-Dougias-Peuck 算法做了数据的缩减。

```C++
//.h
#include "PiecewiseLinearBase.h"
class CoarsenedPiecewiseLinear : public PiecewiseLinearBase
{
  public:
  static InputParameters validParams();
  CoarsendPiecewiseLinear(const InputParameters & parameters);
};
//.C
registerMooseObject("MooseApp", CoarsenedPiecewiseLinear);
InputParemters CoarsenedPiecewiseLinear::validParams()
{
  InputParamters params = PiecewiseLinearBase::validParams();
  params.addClassDescription("Perform a point reduction of the tabulated date upon initialization,"
                            "then evalute using a linear interplation.");
  params.addParam<Real>("epsilon",
                       "Significant distance in function below wich points are considered removable noise");
  params.addParam<Real>("y_scale", 
                       1.0,
                       "Scaling factor to apply to the function nodes for the purpose of"
                       "computing destance in the Douglas-Peucker point reduction algorithm."
                        "This permite shifting the weight between x and y-direction distances.");
  params.addParam<Real>("x_scale",
                       1.0,
                       "Scalign factor to apply to the function nodes for the purpose of "
                       "computing distances in the Douglas-peucker point reduction algorithm."
                       "This permite shifting the weight between x and y-direction distances.");
  return params;
}

CoarsenedPiecewiseLinear::CoarsenedPiecewiseLinear(const InputParamters & paramters)
  : PiecewiseLinearBase(parameters)
  {
    const Real x_scale = getParam<Real>("x_scale");
    const Real y_scale = getParam<Real>("y_scale");
    const Real epsilon = getParam<Real>("epsilon");
    
    PointReduction::FunctionNodeList list;
    list.reserve(_raw_x.size());
    for (MooseIndex(_raw_x) i = 0; i < _raw_x.size(); ++i)
      list.emplace_back(_raw_x[i] * x_scale, _raw_y[i] * y_scale);
    _console << "Reduced size for function" << name() << "form " << list.size();
    list = PointReduction::douglasPeucker(list, epsilon);
    _console << "to " << list.size() << "points" << std::endl;
    
    _raw_x.resize(list.size());
    _raw_y.resize(list.size());
    for (MooseIndex(list) i = 0; i < list.size(); ++i)
    {
      _raw_x[i] = list[i].first / x_scale;
      _raw_y[i] = list[i].second / y_scale;
    }
    buildInterplation();
  }
```

# constant_function

## constant_function_test.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	xmin = -1
	xmax = 1
	ymin = -1
	ymx = 1
	nx = 4
	ny = 4
	elem_type = QUAD4
[]

[Functions]
	[bc_fn]
		type = ParsedFunction
		expression = 'x*x+y*y'
	[]
	
	[icfn]
		type = ConstantFunction
		value = 1
	[]
	[ffn]
		type = ConstantFunction
		value = -4
	[]
[]

[Variables]
	[u]
		order = FIRST
		family = LAGRANGE
		[InitalCondition]
			type = FunctionIC
			function = icfn
		[]
	[]
[]

[Kernels]
	#Coupling of nonlinear to Aux
	[diff]
		type = Diffusion
		variable = u
	[]
	[force]
		type = BodyForce
		variable = u
		function = ffn
	[]
[]

[BCs]
	[all]
		type = FunctionDirichletBC
		variable = u
		boundary = '0 1 2 3'
		function = bc_fn
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'PJFNK'
[]

[Outputs]
	exodus = true
[]
```

**ConstantFunction**设置一个常量的函数。

> Class that represents constant function.

```C++
//.h
class ConstantFunction : public Function
{
  public:
  static InputParamters validParams();
  ConstantFunction(const InputParamters & parameters);
  using Function::value;
  virtual Real value(Real t, const Point & p) const override;
  virtual ADReal value(const ADReal t, const ADPoint & p) const override;
  virtual Real timeDerivative(Real t, const Point & p) const override;
  virtual RealVectorValue gradient(Real t, const Point & p) const override;
  protected:
  const Real & _value;
};

//.C
registerMooseObject("MooseApp", ConstantFunction);
InputParameters ConstantFunction::validParams()
{
  InputParameters params = Function::validParams();
  params.addClassDescription("A funciton that returns a constant value as defined by an input parameter.");
  params.addParam<Real>("value", 0.0, "The constant value");
  params.declareControllable("value");
  return params;
}

ConstantFunction::ConstantFunction(const InputParameters & parameters)
  : Function(parameters),
_value(getParam<Real>("value"))
{}

Real ConstantFunction::value(Real, const Point & ) const
{
  return _value;
}

ADReal ConstantFunction::value(ADReal, const ADPoint & ) const
{
  return _value;
}

Real ConstantFunction::timeDerivative(Real /*t*/, const Point & /*p*/) const
{
  return 0;
}

RealVectorValue ConstantFunction::gradient(Real /*t*/, const Point & /*p*/) const
{
  return RealVactorValue(0);
}
```

# default_function

## default_fuction.i

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
		type = FuncCoefDiffusion
		variable = u
	[]
	[time]
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
		type = NeumannBC
		variable = u
		boundary = right
		value = 1
	[]
[]

[Executioner]
	type = Transient
	num_steps = 10
	dt = 0.1
	solve_type = 'PJFNK'
	petsc_options_inmae = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]
```

**FuncCoefDiffusion**是用于测试*MooseParsedFunctionInterface*

```C++
//.h
class FuncCoefDiffusion : public Kernel
{
  public:
  static InputParameters validParams();
  FuncCoefDiffusion(const InputParameters & parameters);
  protected:
  virtual Real computeQpResidual();
  virtual Real computeQpJacobian();
  const Function & _function;
};
//.C
InputParameters FuncCoefDiffusion::validParams()
{
  InputParameters params = Kernel::validParams();
  params.addParam<FunctionNmae>("coef", "0.5*x+0.5*y", "The function for conductiviyt");
  return params;
}

FuncCoefDiffusion::FuncCeofDiffusion(const InputParameters & parameters)
  : Kernel(paameters), _function(getFunction("coef"))
  {}

Real FuncCoefDiffusion::computeQpResidual()
{
  Real k = _function.value(_t, _q_point[_qp]);
  return k * _grad_test[_i][_qp] * _grad_u[_qp];
}

Real FuncCoefDiffusion::computeQpJacobian()
{
  Real k = _function.value(_t, _q_point[_qp]);
  return k * _grad_test[_i][_qp] * _grad_phi[_j][_qp];
}
```

# function_file_format

## function_file_format_test.i

```C++
#This test the capability of the code to read input file in csv or space separated fomat.
# thera ara four varaibles and four functions of the same name; a, b, c and d.
# The diffusion eqations is "solved" for each of thse variables with a boundary condition 
# of type FunctionDirichletBC apploed to a boundary (ie.node set) that includes every node
# in the element. so the solution is the boundary condition defined by the function.
# Each boundary condition uses a function os type PiecewiseLinear that gets its value 
# from a file.
#which could be in comma separated or spc seperated format. The input file can also contain comments.
# The files could habe the form 
# 0,1,2,3 #time
# 0,4,5,6 #bc value
# for format = row
# or
# 0,0
# 1,4
# 2,5
# 3.6
# for format = column
# Values in files could be sepaated by white space. See the .csv and .dat files for format expamples.
# The values of the variables should correspong to the function
# At time = 0, the variable = 0, at time = 1, variable = 4 and so on
[Mesh]
	file = cube.e
	parllel_type = replicated
[]

[Variables]
	[a]
	[]
	[b]
	[]
	[c]
	[]
	[d]
	[]
	[e]
	[]
	[f]
	[]
[]

[Functions]
	[a]
		type = PiecewiseLinear
		data_file = rows.csv
		format = rows
	[]
	[b]
		type = PecewiseLinear
		date_file = columns.csv
		foramte = columns
	[]
	[c]
		type = PiecewiseLinear
		data_file = row_space.dat
		formate = rows
	[]
	[d]
		type = PiecewiseLinear
		data_file = columns_space.dat
		formate = columns
	[]
	[e_func]
		type = PiecewiseLinear
		data_file = row_more_data.csv
		format = rows
		xy_in_file_only = false
	[]
	[f]
		type = PiecewiseLinear
		data_file = columns_more_data.csv
		format = columns
		xy_in_file_only = false
	[]
[]

[Kernels]
	[diffa]
		type = Diffusion
		variable = a
	[]
	[diffb]
		type = Diffusion
		variable = b
	[]
	[diffc]
		type = Diffusion
		variable = c
	[]
	[diffd]
		type = Diffusion
		variable = d
	[]
	[diffe]
		type = Diffusion
		variable = e
	[]
	[difff]
		type = Diffusion
		variable = f
	[]
[]

[BCs]
	[a]
		type = FunctionDirichletBC
		varaible = a
		boundary = '1'
		function = a
	[]
	[b]
		type = FunctionDirichletBC
		varaiable = b
		boundary = '1'
		function = b
	[]
	[c]
		type = FunctionDirichletBC
		variable = c
		boundary = '1'
		function = c
	[]
	[d]
		type = FunctionDirichletBC
		variable = d
		boundary = '1'
		function = d
	[]
	[e]
		type = FunctionDirichletBC
		variable = e
		boundary = '1'
		function = e
	[]
	[f]
		type = FunctionDirichletBC
		variable = f
		boundary = '1'
		function = f
	[]
[]

[Executioner]
	type = Transient
	dt = 0.5
	end_time = 3
	nl_rel_tol = 1e-12
[]

[Outputs]
	file_base = out
	exodus = true
[]
```

**PiecewiseLinear **

> Fuction which provides a piecewise continuous linear interpolation of a provided (x,y) point data set.

```C++
//.h
template <typename BaseClass>
class PiecewiseLinearTempl : public BaseClass
{
  public:
  static InputParameters validParams();
  PiecewiseLinearTempl(const InputParameters & parameters);
};
class PiecewiseLinear : public PiecewiseLinearTempl<PiecewiseLinearBase>
{
  public:
  PiecewiseLinear(const InputParameters & params) : PiecewiseLinearTempl<PiecewiseLinearBase>(params)
  {
  
  }
  static InputParameters validParams()
  {
    return PiecewiseLinearTempl<PiecewiseLinearBase>::validParams();
  }
};
typedef PiecewiseLinearTempl<ADPiecewiseLinearBase> ADPiecewiseLinear;
//.C
registerMooseObject("MooseApp", PiecewiseLinear);
registerMooseObject("MooseApp", ADPiecewiseLinear);

template <typename BaseClass>
InputParameters PiecewiseLinearTempl<BaseClass>::validParams()
{
  InputParameters params = BaseClass::validParams();
  params.addParam<bool>("extrap", false, "If true, extrapolates when sample point is outside of abscissa range");
  params.addClassDescription("Linearly interpolates between pairs of x-y data");
  return params;
}

template <typname BaseClass>
PiecewiseLinearTempl<BaseClass>::PiecewiseLinearTempl(const InputParameters & parameters)
  : BaseClass(paramters)
  {
    this->buildInterpolation(this->template getParam<bool>("extrap"));
  }
template class PiecewieLinearTempl<PiecewiseLinearBase>;
template class PiecewiseLinearTempl<ADPiecewiseLinearBase>;
```

# function_ic

## function_ic_test.i

```
[Mesh]

```

