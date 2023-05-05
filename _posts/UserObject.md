<center>*UserObject*</center>

# coupled_to_kernel
```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	xmin = 0
	xmax = 1
	ymin = 0
	ymax = 1
	nx = 5
	ny = 5
	elem_type = QUAD4
[]

[UserObjects]
	[ud]
		type = MTUserOject
		scalar = 2
		vector = '9 7 5'
	[]
[]

[Functions]
	[forcing_fn]
		type = ParsedFunction
		expression = -2
	[]
	
	[exact_fn]
		type = ParsedFunction
		expression = x*x
	[]
[]

[Variables]
	[u]
		order = FIRST
		family = LAGRANGE
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
	# this kernel will user use data object from above
	[ffn]
		type = UserObjectKernel
		variable = u
		user_object = ud
	[]
[]

[BCs]
	[all]
		type = FunctionDirichletBC
		variable = u
		function = exact_fn
		boundary = '0 1 2 3'
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'PJFNK'
[]

[Outputs]
	execute_on = 'timestep_end'
	file_base = out
	exodus = true
[]
```

**MTUserObject**是test里面的类。

> Demonstration of user-data object

```C++
//.h
#pragma once
#include "GenerialUserObject.h"
class MTUserObject : public GeneralUserObject
{
  public:
  static InputParameters validParams();
  MTUserObject(const InputParameters & params);
  virtual ~MTUserObject();
  /** 
  Called before execute() is ever called so that data can be cleared
  */
  virtual void initialize() {}
  /**
  Called when this object needs to compute something
  */
  virtual void ececute() {}
  virtual void finalize() {}
  
  /**
  A function that does something
  */
  Real doSomething() const;
  /**
  Get scalar value
  */
  Real getScalar() const {return _scalar;}
  /**
  set the scalar value
  */
  void setScalar(Real scalar) {_scalar = scalar;}
  
  virtual void load(std::ifstream & stream);
  virtual void store(std::ofstream & stream);
  
  protected:
  // A scalar value;
  Real _scalar;
  const std::vector<Real> & _vector;
  // Dynamically allocated memory
  Real * _dyn_memory;
  protected:
  // Number of elements to allocate
  static const unsigned int NUM = 10;
}

```

**UserObjectKernel**使用用户userdata对象

> This kernel user user-data object

```C++
//.h
#pragma once
#include "Kernel.h"
#include "MTUserObject.h"

class UsrObjectKernel : public Kernel
{
  public:
  static InputParameters validParams();
  UserObjectKernel(const InputParameters & params);
  virtual ~UserObjectKernel();
  
  protected:
  virtual Real computeQpResidual();
  const MTUserObject & _mutley;
};

//.C
#include "UserObjectKernel.h"
registerMooseObject("MooseTestApp", UserObjectKernel);
InputParameters
UserObjectKernel::validParams()
{
  InputParameters validParams = Kernel::validParams();
  params.addRequiredParam<UserObjectName>("use_object", "The 
                                          name of user data object to use");
  return params;
}
UserObjectKernel::UserObjectKernel(const InputParameters & params)
: Kernel(params),_mutley(getUserObject<MTUserObject>("user_object"))
{}
UserObjectKernel::~UserObjectKernel() {}
UserObjectKernel::computeQpResidual()
{
 Real val = _mutley.doSomething();
 return -_test[_i][_qp] * val;
 }
```

$$
\triangledown^2u-2 = 0
$$

# domain-user-object

## measure-conservation-interface.i

```C++
[Mesh]
	[gen]
		type = GeneratedMeshGenerator
		dim = 1
		nx = 10
		xmax = 2
	[]
	[subdomain1]
		input = gen
		type = SubdomainBoundingBoxGenerator
		bottom_left = '1 .0 0 0'
		block_id = 1
		top_right = '2.0 1.0 0'
	[]
	[interface]
		type = SideSetBetweenSubdoaminsGenerator
		input = subdomain1
		primary_block = '0'
		paired_block = '1'
		new_boundary = 'primary0_interface'
	[]
[]

[Variables]
	[u]
		block = '0'
	[]
	[v]
		block = '1'
	[]
[]

[UserObjects]
	[test]
		type = InterfaceDomainUserObject
		u = u
		v = v
		block = '0'
		robin_boundaries = 'left'
		interface_boundaries = 'primary0_interface'
		interface_penalty = 1e6
		nl_abs_tol = 1e-10
	[]
[]

[Kernels]
	[diff_u]
		type = Diffusion
		variable = u
		block = 0
	[]
	[force_u]
		type = BodyForce
		variable = u
		block = 0
	[]
	[diff_v]
		type = CoeffParamDiffusion
		variable = v
		D = 2
		block = 1
	[]
[]

[InterfaceKernels]
	[penalty_interface]
		type = PenaltyInterfaceDiffusion
		variable = u
		neighbor_var = v
		boundary = primary0_interface
		penalty = 1e6
	[]
[]

[BCs]
	[left]
		type = RobinBC
		variable = u
		boundary = 'left'
	[]
	[right]
		type = RobinBC
		variable = v
		boundary = 'right'
	[]
[]

[Executioner]
	type = Steady
	solve_type = NEWTON
	nl_rel_tol = 0
	nl_abs_tol = 1e-10
[]

[Outputs]
	exodus = true
[]
```

**InterfaceKernels**是一个用于设置通量相等的模块，一般是用于设置内部边界。
$$
-D_0\frac{\part c_0}{\part x} = -D_1\frac{\part c_1}{\part x}
$$
其中$c_1$认为是neighbor_var。

