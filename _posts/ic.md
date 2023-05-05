# ic

## array_constant_ic

### array_constant_ic_test.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 10
	ny = 8
[]

[Problem]
	kernel_converage_check = false
	solve = false
[]

[Variables]
	[u]
		components = 2
	[]
[]

[AuxVariables]
	[v]
		components = 8
	[]
[]

[ICs]
	[uic]
		type = ArrayConstantIC
		variable = u
		value = '0.1 3'
	[]
	[vic]
		type = ArrayConstantIC
		variable = v
		vlaue = '2 6 9 7 1.1 2 5 4'
	[]
[]

[Postprocessors]
	[uint0]
		type = ElementIntegralArrayVariablePostprocessor
		variable = u
		component = 0
	[]
	[uint1]
		type = ElementIntegralArrayVariablePostprocessor
		variable = u
		component = 1
	[]
	[vint0]
		type = ElementIntegralArrayVariablePostprocessor
		variable = v
		component = 0
	[]
	[vint1]
		type = ElementIntegralArrayVariablePostprocessor
		variable = v
		component = 1
	[]
[]

[Executioner]
	type = Steady
[]

[Outputs]
	exodus = true
[]
```

**component**翻译成组件，猜测大概是可以需要计算变量的组成？

**ElementIntegralArrayVariablePostprocessor**计算数据变量一个分量的积分。其中的**component**是积分向量某一个分量的值。(==Component of the array variable to be integraed==)

![结果](/Users/wangzhaohao/Documents/ics_picture/array_constant_ic.png)

## array_function_ic

### array_function_ic_test.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 10
	ny = 8
[]

[Problem]
	kernel_coverage_check = false
	solve = false
[]

[Variables]
	[u]
		comonents = 2
	[]
	[uo]
	[]
	[u1]
	[]
[]

[AuxVariables]
	[v]
		components = 2
	[]
[]

[Functions]
	[sinx]
		type = ParseFunction
		expression = sin(x)
	[]
	[siny]
		type = ParsedFunction
		expression = sin(y)
	[]
[]

[ICs]
	[uic]
		type = ArrayFunctionIC
		variable = u
		function = 'sinx siny'
	[]
	[u0ic]
		type = FunctionIC
		variable = u0
		function = sinx
	[]
	[u1ic]
		type = FunctionIC
		variable = u1
		function = siny
	[]
	[vic]
		type = ArraayFunctionIC
		variable = v
		function = 'sinx siny'
	[]
[]

[Postprocessors]
	[uint0]
		type = ElementIntergralArrayVariablePostprocessor
		variable = u
		component = 0
	[]
	[uint1]
		type = ElementIntergralArrayVariablePostprocessor
		variable = u
		component = 1
	[]
	[u0int]
		type = ElementIntegralVariablePostprocessor
		variable = u0
	[]
	[u1int]
		type = ElementIntegralVariablePostprocessor
		variable = u1
	[]
	[vint0]
		type = ElementIntegralArrayVariablePostprovessor
		variable = v
		component = 0
	[]
	[vint1]
		type = ElementIntegralArrayVariablePostprocessor
		variable = v
		component = 1
	[]
[]

[Executioner]
	type = Steady
[]

[Outputs]
	exodus = true
[]
```

设置`变量 u u0 u1`注意u的<u>components = 2</u>和`辅助变量 v`。
$$
u=(sinx, siny)\\u0=sinx\\u1=siny\\v=(sinx,siny)
$$
计算==变量在element上的结果==

几何信息

> 长1m，宽是1m。x方向的element是10个，y方向的element是8个。

**ElementIntegralArrayVariablePostprocessor**是求解一个区域的，不是一个==Element==。（存疑）

![array_function_ic_test](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/a98Q4i_array_function_ic_test.png)

## boundary_ic

### boundary_ic.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	xmin = 0
	xmax = 1
	ymin = 0
	ymax = 1
	nx = 4
	ny = 4
[]

[Variables]
	[u]
		order = FIRST
		family = LAGRANGE
	[]
[]

[ICs]
	[u_ic]
		type = ConstantIC
		variable = u
		block = 0
		value = -1
	[]
	[u_ic_bnd]
		type = ConstantIC
		variable = u
		boundary = 'left right'
		value = -2
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
		value = -1
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'NEWTON'
[]

[Outputs]
	exodous = true
[]
```

![image-20230114203153580](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/DSVmwK_image-20230114203153580.png)

![image-20230114203214347](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/oUkMRx_image-20230114203214347.png)

```C++
// ConstantIc
//.h
virtual Real value(const Point & p) override;
//.c
Real ConstantIC::value(const Point & /*p*/)
{
  return _value;
}
```

## bounding_box_ic

### bounding_box_ic_diffuse_test.i

```C++
[Mesh]
	[square]
		type = GeneratedMeshGenerator
		nx = 2
		ny = 2
		dim = 2
	[]
	uniform_refine = 3 # Number of coarsenign levels available in adaptive mesh refinement
[]

[Variables]
	active = 'u'
	
	[u]
		order = FIRST
		family = LAGRANGE
		
		[InitialCondition]
			type = BoundingBoxIC
			x1 = 0.1
			y1 = 0.1
			x2 = 0.6
			y2 = 0.6
			inside = 2.3
			outside = 4.6
			int_width = 0.2
		[]
	[]
	
[AuxVariables]
	active = 'u_aux'
		
	[u_aux]
		order = FIRST
		family = LAGRANGE
			
		[InitalCondition]
			type = BoundingBoxIC
			x1 = 0.1
			y1 = 0.1
			x2 = 0.6
			y2 = 0.6
			inside = 1.34
			outside = 6.67
			int_width = 0.2
		[]
	[]
[]
	
	[Kernels]
		active = 'diff'
		
		[diff]
			type = Diffusion
			variable = u
		[]
	[]
	
[BCs]
	active = 'left right'
		
	[left]
		type = DirichletBC
		variable = u
		boundary = 3
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = 1
    value = 1
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

**BoundingBoxIC**

> Int_width默认是0，设置扩散的宽度，0是sharp的边界。

==BoundingBoxIC==是可以设置变量在自定义的盒子**内**和**外**的初始值。

```C++
//.h
virtual Real value(const Point & p) override;
const Real _x1;
const Real _y1;
const Real _z1;

const Real _x2;
const Real _y2;
const Real _z2;

const Real _inside;
const Real _outside;

const Point _bottom_left;
const Point _top_right;

const Real _int_width;
// .C

Real BoundingBoxIC::value(const Point & p)
{
  if (_int_width < 0.0)
    mooseError("'int_width' should be non-negative");
  
  if (_int_width == 0.0)
  {
    for (const auto i : make_range(Moose::dim))
      if (p(i) < _bottom_left(i) || p(i) > _top_right(i))
        return _outside;
    return _inside;
  }
  else
  {
    Real f_in = 1.0;
    for (const auto i : make_range(Moose::dim))
      if (_bottom_left(i) != _top_right(i))
        f_in *= 0.5 * (std::tanh(2.0 * (p(i) - _bottom_left(i)) / _int_width) - std::tanh(2.0 *(p(i) - _top_right(i)) / _int_widht));
    
    return _outside + (_inside - _outside) * f_in;
  }
}
```



![image-20230115111012692](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/OwADnv_image-20230115111012692.png)

![image-20230115111127964](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/l46cQG_image-20230115111127964.png)

### bounding_box_ic_test

```C++
[Mesh]
	[square]
		type = GeneratedMeshGenerator
		nx = 2
		ny = 2
		dim = 2
	[]
	uniform_refine = 3
[]

[Variables]
	active = 'u'
	
	[u]
		order = FIRST
		family = LAGRANGE
		
		[InitialCondition]
			type = BoundingBoxIC
			x1 = 0.1
			y1 = 0.1
			x2 = 0.6
			y2 = 0.6
			inside = 2.3
			outside = 4.6
		[]
	[]
[]

[AuxVariables]
	active = 'u_aux'
	
	[u_aux]
		order = FIRST
		family = LAGRANGE
		
		[InitialCondition]
			type = BoundingBoxIC
			x1 = 0.1
			y1 = 0.6
			y2 = 0.6
			inside = 1.34
			outside = 6.67
		[]
	[]
[]

[Kernels]
	active = 'diff'
	
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[BCs]
	active = 'left right'
	
	[left]
		type = DirichletBC
		variable = u
		boundary = 3
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = 1
		value = 1
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'PJFNK'
[]

[Outputs]
  # 输出文件名字是out.e
	file_base = out # disables all default naming behavior
	exodus = true
[]
```

和[bounding_box_ic_diff_test](#bounding_box_ic_diffuse_test.i)一样区别只是在有没有**int_width**。

![初始image-20230115215636052](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/lxDoil_image-20230115215636052.png)

![image-20230115215659619](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/EPFmSS_image-20230115215659619.png)

## check_error

### two_ics_on_same_block.i

```C++
[Mesh]
	type = FileMesh
	file = 'rectangle.e'
[]

[Variables]
	[u]
	[]
[]

[ICs]
	[block]
		type = ConstantIC
		variable = u
		block = 1
		value = 0.5
	[]
	[block2]
		type = ConstantIC
		variable = u
		block = 1
		value = 2
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[Executioner]
	type = Steady
[]
```

输入卡是为了设置同一个block上重复的条件，看是否会报错。

### two_ics_on_same_block_global.i

```C++
[Mesh]
	type = FileMesh
	file = 'rectangle.e'
[]

[Variables]
	[u]
	[]
[]

[ICs]
	[block]
		type = ConstantIC
		variable = u
		value = 2
	[]
	[block2]
		type = ConstantIC
		variable = u
		value = 0.5
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[Executioner]
	type = Steady
[]
```

和上面相同，不同点是没有明确设置$block=1$。

### two_ics_on_same_boundary.i

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

[ICs]
	[left]
		type = ConstantIC
		variable = u
		boundary = left
		value = 0.5
	[]
	[left2]
		type = ConstantIC
		variable = u
		boudary = left
		value = 2
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
	type = Steady
[]
```

设置在相同边界上的初始值。

## component_ic

### component_ic.i

```
[Mesh]
	type = GeneratedMesh
	dim = 2
	xmin = 0
	xmax = 1
	ymin = 0
	ymax = 1
	nx = 2
	ny = 2
[]

[Variables]
	[u]
		order = FIRST
		family = LAGRANGE
	[]
	
	[v]
		order = SECOND
		family = SCALAR
	[]
[]

[AuxVariables]
	[a]
		order = SECOND
		family = SCALAR
	[]
[]

[ICs]
	[v_ic]
		type = ScalarComponentIC
		variable = 'v'
		values = '1 2'
	[]
	[a_ic]
		type = ScalarComponentIC
		variable = 'a'
		values = '4 5'
	[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[ScalarKernels]
	[ask]
		type = AlphaCED
		variable = v
		value = 100
	[]
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = 3
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = 1
		value = 1
	[]
[]

[Postprocessors]
	[v1]
		type = ScalarVariable
		variable = v
		component = 0
		execute_on = 'inital timestep_end'
	[]
	[v2]
		type = ScalarVariable
		variable = v
		component = 1
		execute_on = 'initial timestep_end'
	[]
	[a1]
		type = ScalarVariable
		variable = a
		component = 0
		execute_on = 'initial tiemstep_end'
	[]
	[a2]
		type = ScalarVariable
		variable = a
		component = 1
		execute_on = 'initial timestep_end'
	[]
[]

[Executioner]
	type = Steady
[]

[Outputs]
	[out]
		type = Exodus
		execute_scalars_on = none
	[]
[]
```

**ScalarComponentIC**设置不同的值在每一个组成在**scalar**变量。

```C++
//.h
virtual Real value();
std::vector<Real> _initial_values;
//.c
InputParameters ScalarComponentIC::validParams()
{
  params.addRequiredParam<std::vecto<Real>>("values", "Intial values to initialize the scalar variable");
}

Real ScalarComponentIC::ScalarComponentIC(const InputParameters & parameters) : ScalarInitialCondition(parameters),
_initial_values(getParam<std::vector<Real>>("values"))
{}

Real ScalarComponentIC::value()
{
  return _initial_values[_i];
}
```

**ScalarVariable**是==Postprocessors==的类，将**scalar**变量值作为后处理的值返回。

```C++
//.h
virtual void initialize() override;
virtual void execute() override;
virtual Real getValue() override;
virtual void finalize() override;

protected:
	MooseVariableScalar & _var;
	unsigned int _idx;
	Real _value;

//.C
params.addRequiredParam<VariableName>("variable", "Name of the variable");
params.addParam<unsigned int>("component", 0, "Componet ot output for this varible");

ScalarVariable::ScalarVariable(const InputParameters & parameters)
: GeneralPostprocessor(parameters),
_var(_subproblem.getScalarVariable(_tid, getParam<VariableName>("variable"))),
_idx(getParam<unsigned int>("component")),
_value(0)
{
}
void ScalarVariable::initialize()
{
}
void ScalarVariable::execute()
{
  _var.reinit();
  _value = std::numric_limits<Real>::max();
  const DofMap & dof_map = _var.dofMap();
  const dof_id_type dof = _var.dofIndices()[_idx];
  if (dof >= dof_map.first_dof() && dof < dof_map.end_dof())
    _value = _var.sln()[_idx];
}
Real ScalarVariable::getValue()
{
  return _value;
}

void ScalarVariable::finalize()
{
  gatherMin(_value);
}

```



![image-20230117221007343](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/jO6KuL_image-20230117221007343.png)

## constant_ic

### constant_ic_test.i

```C++
[Mesh]
	[square]
		type = GeneratedMeshGenerator
		nx = 2
		ny = 2
		dim = 2
	[]
[]

[Variables]
	active = 'u'
	
	[u]
		order = FIRST
		family = LAGRANGE
		
		#Initial Condition on Nonliner variable
		[InitialCondition]
			type = ConstantIC
			value = 6.2
		[]
	[]
[]

[AuxVariables]
	activie = 'u_aux'
	
	[u_aux]
		order = FIRST
		family = LAGRANGE
	
		#Initial Condition on Auxiliary variable
		[InitialCondition]
			type = ConstantIC
			value = 9.3
		[]
	[]
[]

[Kernels]
	active = 'diff'
	
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[BCs]
	active = 'left right'
	
	[left]
		type = DirichletBC
		variable = u
		boundary = 3
		value = 0
	[]
	
	[right]
		type = DirichletBC
		variable = u
		boundary = 1
		value = 1
	[]
[]

[Executioner]
	type = Steady
	
	solve_type = 'PJFNK'
	nl_rel_tol = 1e-10
[]

[Outputs]
	file_base = out
	exodus = true
[]
```

设置一个常数的初始值，初始值可以设置在**variable**同时也可以设置在**auxvariable**。采用==InitialCondition==。

![image-20230123095956835](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/y5E1Ot_image-20230123095956835.png)

### subdomain_constant_ic_test.i

```C++
[Mesh]
	file = sq-2blk.e
	uniform_refine = 1
[]

[Variables]
	[u]
		order = FIRST
		family = LAGRANGE
	[]
[]

[AuxVariables]
	[u_aux]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[ICs]
	[ic_u_1]
		type = ConstantIC
		variable = u
		value = 42
		block = '1 2'
	[]
	[ic_u_aux_1]
		type = ConstantIC
		variable = u_aux
		value = 6.25
		block = '1'
	[]
	[ic_u_aux_2]
		type = ConstantIC
		variable = u_aux
		value = 9.99
		block = '2'
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
		boundary = 1
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = 2
		value = 1
	[]
[]

[Executioner]
	type = Steady
	
	solve_type = 'PJFNK'
	nl_rel_tol = 1e-10
[]

[Outputs]
	exodus = true
[]
```

相比于之前的[constant_ic_test.i](#const_ic_test.i)只是把初始条件不在**InitialCondition**，而是在**ICs**中单独设置。

![image-20230123104911487](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/5Oavgz_image-20230123104911487.png)

## data_struct_ic

### data_struct_ic_test.i

```C++
[Mesh]
	type = GeneratedMesh
	nx = 10
	ny = 10
	dim = 2
	
	# DataStructIC creates an IC based on node numbering
	parallel_type = replicated
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
[]

[ICs]
	[ds_ic]
		type = DataStructIC
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
		value =  1
	[]
[]

[Executioner]
	type = Steady
	
	solve_type = 'PJFNK'
	nl_rel_tol = 1e-12
[]

[Outputs]
	exodus = true
[]
```

**DataStructIC**是建立一个根据id数组成的==data structure==作为初始条件。代码中是==**node_id*2**==。

```C++
//.h
class DataStructIC : public InitialCondition
{
  public:
  static InputParameters validParams();
  DataStructIC(const InputParameters & parameters);
  virtual ~DataStructIC();
  virtual void initialSetup();
  virtual Real value(const Point & /*p*/);
private:
  MooseMesh & _mesh;
  std::map<dof_id_type, Real> _data;
}
//.C
DataStructIC::DataStructIC(const InputParameters & parameters)
  : InitialCondition(parameters), _mesh(_fe_problem.mesh())
  {}
DataStructIC::~DataStructIC() {}

void DataStructIC::initialSetup()
{
  MeshBase::const_element_iterator elem_end = _mesh.activeLocalElementsEnd();
  for (MeshBase::const_element_iterator elem_it = _mesh.activeLocalElementsBegin(); elem_it != elem_end; ++elem_it)
  {
    const Elem * current_elem = *elem_it;
    
    unsigned int n_nodes = current_elem->n_vertices();
    for (unsigned int i = 0; i < n_nodes; ++i)
    {
      const Node * current_node = current_elem->node_ptr(i);
      _data[current_node->id()] = current_node->id() * 2.0; // double the node_id
    }
  }
}

Real DataStructIC::value(const Point & /*p*/)
{
  if (_current_node == NULL)
    return -1.0;
  std::map<dof_id_type, Real>::const_iterator it = _data.find(_current_node->id());
  if (it != _data.end())
    return it->second;
  
  mooseError("The following id is not in the data structure: ", _current_node->id());
}
```

<center>	<!--将图片和文字居中-->
    <img src="https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/dHip2Y_image-20230123162754851.png"
         alt="无法显示图片时显示的文字"
         style="zoom:这里写图片的缩放百分比"/>
    <br>		<!--换行-->
    左边是id右边是u的初始值	<!--标题-->
    </center>

## depend_on_uo

### geometric_neighbors_ic.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 8
	ny = 8
	
	# testing geometric ghosted functions so have to use distributed mesh
	parallel_type = distributed
[]

[Variables]
	[ghost]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[ICs]
	[ghost_ic]
		type = ElememtUOIC
		variable = ghost
		element_user_object = ghost_uo
	 	field_name = "ghosted"
	 	field_type = long
	 []
[]

[UserObjects]
	[ghost_uo]
		type = ElementSideNeighborLayersTester
		execute_on = initial
		element_side_neighbor_layers = 1
	[]
[]

[Executioner]
	type = Steady
[]

[Problem]
	solve = false
	kernel_coverage_check = false
[]
```

**ElementUOIC**初始化从**ElementUOProvider**返回的数据。**ElementUOProvider**是==UserObjects==。

> <u>Initial Condition for returing values from an ElementUOProvider derived class</u>

```C++
//.h
class ElementUOIC : public InitialCondition
{
  public:
  static InputParameters validParams();
  ElementUOIC(const InputParameters & parameters);
  virtual Real value(const Point & /*p*/);
  private:
  MooseMesh & _mesh;
  std::map<dof_id_type, Real> _data;
  
  const ElementUOProvider & _elem_uo;
  const std::string _field_name;
  const MooseEnum _field_type;
};

//.C
Inputparameters ElementUOIC::validParams()
{
  InputParameters params = InitialCondition::validParams();
  params.addRequiredParam<UserObjectName>("element_user_object", "The ElementUOProvider to be coupled into this IC");
  params.addParam<std::sting>("field_name", "The field name to retrieve from the ElementUOProvider");
  MooseEnum field_type("long Real", "long");
  params.addParam<MooseEnum>("field_type", field_type, "The type of field to retrieve");
  return params;
}

ElementUOIC::ElementUOIC(const InputParameters & parameters) : InitialCondition(parameters),
_mesh(_fe_problem.mesh()),
_elem_uo(getUserObject<ElementUOProveider>("element_user_object")),
_field_name(isParamValid("field_name") ? getParam<std::string>("field_name") : "default"),
_field_type(getparam<MooseEnum>("field_type"))
{}

Real ElementUOIC::value(const Point & /*p*/)
{
  mooseAssert(_curent_elem, "Current Elem is nullpter");
  if (_field_type = "long")
    return _elem_uo.getElementValueLong(_curret_elem->id(), _field_name);
  else
    return _elem_uo.getElementaValueReal(_current_elem->id(), _field_name);
}
```

可以从代码中看到返回的是**field_name**中的value。

**ElemSideNeighborLayersTester**是获得**ElemSideNeighborLayer**的数据。（不太懂）

```C++
//.h
class ElemSideNeighborLayersTester : public ElementUOProvider
{
  public:
  static InputParameters validParams();
  
  ElemSideNeighborLayerTester(const InputParameters & parameters);
  
  virtual void initialize() override;
  virtual void execute() override;
  virtual void finalize() override;
  virtual unsigned long getElementalValueLong(dof_id_type element_id, const std::string & field_name) const override;
  protected:
  std::set<dof_id_type> _ghost_data;
  std::set<dof_id_type> _evaluable_data;
  
  const dof_id_type _rank;
}
//.C
InputParamters ElemSideNeighborLayersTester::validParams()
{
  InputParameters params = ElementUOProveider::validParams();
  params.addParam<unsigned int>("rank", DofOjbect::invalid_processor_id, "The rank for which the ghosted elements are recorded (Default: ALL)");
  params.addRelationshipManager(
    "ElementSideNeighborLayers", Moose::RelationshipManagerType::GEOMETRIC | Moose::RelationshipManagerType::ALGEBRAIC), [](const InputParameters & obj_params, InputParamters & rm_params){
    rm_params.set<unsigned short>("layers") = obj_params.get<unsigned short>("element_side_neighbor_layers");
  }
  );
  params.addRequiredParam<unsigned short>("element_side_neighbor_layers", "Number of layers to ghost");
  params.addClassDescription("User object to calculate ghosted elements on single processor or" "the union across all processors.");
  return params;
}

ElemSideNeighborLayersTester::ElemSideNeighborLayerTester(const InputParameters & parameters) : ElementUOProvider(parameters), _rank(getParam<unsigned int>("rank"))
{}

void ElemSideNeighborLayersTester::initialize()
{
  _ghost_data.clear();
}

void ElemSideNeighborLayersTester::execute()
{
  auto my_processor_id = processor_id();
  
  if (_rank == DofObject::invalid_processor_id || my_processor_id == _rank)
  {
    for (const auto & current_elem : _fe_problem.getNonlinearEvaluableElementRange()) _evaluable_data.emplace(current_elem->id());
    
    const auto & mesh = _subproblem.mesh().getMesh();
    for (const auto & elem : mesh.active_element_ptr_range())
      if (elem->processor_id() !=  my_processor_id)
        _ghost_data.emplace(elem->id());
  }
}

void ElemSideNeighborLayersTester::finalize()
{
  _communicator.set_union(_ghost_data);
  _communicator.set_union(_evaluable_data);
}

unsigned long ElemSideNeighborLayersTester::getElementalValueLong(dof_id_type element_id, const std::string & field_name) const
{
  if (field_name == "evaluable")
    return _evaluable_data.find(element_id) != _evaluable_data.end();
  else if (field_name == "ghosted")
    return _ghost_data.find(element_id) != _ghost_data.end();
  return std::numeric_limits<unsigned long>::max();
}
```

实话说没看懂，什么是ghosed function。

### scalar_ic_from_uo.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 8
	ny = 8
	
	parallel_type = distributed
[]

[Variables]
	[u]
	[]
	[a]
		family = SCALAR
		order = FIRST
	[]
	
[]

[ICs]
	[ghost_ic]
		type = ScalarUOIC
		variable = a
		user_object = scalar_uo
	[]
[]

[UserObjects]
	[scalar_uo]
		type = MTUserObject
	[]
[]

[Executioner]
	type = Steady
[]

[Outputs]
	csv = true
	show = 'a'
[]

[Problem]
	kernel_coverage_check = false
[]
```

**ScalarUOIC**初始化常量通过用户自定义。

> Scalar initial condition for setting values from a user object

```C++
//.h
class MTUserObject;
class ScalarUOIC : public ScalarInitialCondition
{
  public:
  static InputParameters validParams();
  ScalarUOIC(const InputParameters & parameters);
  
  virtual Real value() override;
  
  protected:
  const MTUserObject & _uo;
};

//.C
InputParameters ScalarUOIC::validParams()
{
  InputParameters params = ScalarInitialCondition::validParams();
  params.addRequiredParam<UserObjectName>("user_object", "The MTUserObject to be coupled into this IC");
  return params;
}

ScalarUOIC::ScalarUOIC(const InputParameters & parameters)
  : ScalarInitialCondition(parameters),
_uo(getUserObject<MTUserObject>("user_object"))
{}

Real ScalarUOIC::value()
{
  return _uo.doSomething();//doSomething 应该在MTUserObject中，其属于UserObject类
}
```

**MTUserObject**展示如何使用**userObject**。

> Demonstration of user-data object

```C++
//.h
class MTUserObject : public GeneralUserObject
{
  public: 
  static InputParameters validParams();
  
  MTUserObject(const InputParameters & params);
  virtual ~MTUserOjbect();
  
  // Called before execute() is ever called so that data can be cleared
  virtual void initialzie() {}
  
  // Called when this object needs to compute something

  virtual void exectue() {}
  
  virtual void finalize() {}
  
  // A function that does something
  Real doSomething() const;
  //Get scalar value
  Real getScalar() const { return _scalar;}
  //Set the scalar value @param scalar
  void setScalar(Real scalar) {_scalar = scalar;}
  
  virtual void load(std::ifstream & stream);
  virtual void store(std::ofstream & stream);
  
  protected:
  Real _scalar;
  const std::vector<Real> & _vector;
  // Dynamically allocated memory 动态分配内存
  Real * _dyn_memory;
  
  protected:
  //Number of elements to allocate
  //魔术数字（magic number）是程式设计中所谓的直接写在程式码里的具体数值（如“10”“123”等以数字直接写出的值）。虽然程式作者写的时候自己能了解数值的意义，但对其他程式员而言，甚至制作者本人经过一段时间后，会难以了解这个数值的用途，只能苦笑讽刺“这个数值的意义虽然不懂，不过至少程式会动，真是个魔术般的数字”而得名。
  static const unsigned int NUM = 10;
}
//.C
InputParameeters MTUserObject::validParams()
{
  InputParameters params = GeneralUserObject::validParams();
  params.addParam<Real>("scalar", 0, "A scalar value");
  params.addParam<std::vector<Real>>("vector", std::vector<Real>(), "A vector value");
  return params;
}

MTUserObject::MTUserObject(const InputParameters & params)
  : GeneralUserObject(params),
_scalar(getParam<Real>("scalar")),
_vector(getParam<std::vector<Real>("vector")),
_dyn_memory(NULL)
{
  //allocate some memory
  _dyn_memory = new Real[NUM];
}
MTUserOjbect::~MTUserObject() { delete[] _dyn_memory;}

Real MTUserObject::doSomething() const
{
  //let's do something here,
  return -2;
}
void MTUserObject::load(std::ifstream & stream)
{
  stream.read((char*)&_scalar, sizeof(_scalar));
}
void MTUserObject::store(std::ofstream & stream)
{
  stream.write((const char*)&_scalar, sizeof(_scalar));
}
```

结果是：

| 时间 | 变量a |
| :--: | :---: |
|  0   |  -2   |
|  1   |  -2   |

## dependency

### monomial.i

```C++
[GlobalParams]
	family = MONOMIAL
  order = FIRST
[]

[Mesh]
	type = GeneratedMesh
	dim = 2
	xmin = 0
	xmax = 1
	ymin = 0
	ymax = 1
	nx = 2
	ny = 2
[]

[AuxVariables]
	[a]
	[]
	[b]
	[]
[]

[Variables]
	[u]
	[]
	[v]
	[]
[]

[ICs]
	[u_ic]
		type = ConstantIC
		variable = u
		value = -1
	[]
	
	[v_ic]
		type = MTICSum
		variable = v
		var1 = u
		var2 = a
	[]
	[a_ic]
		type = ConstantIC
		variable = a
		value = 10
	[]
	[b_ic]
		type = MTICMult
		variable = b
		var1 = v
		factor = 2
	[]
[]

[AuxKernels]
	[a_ak]
		type = ConstantAux
		variable = a
		value = 256
	[]
	[b_ak]
		type = ConstantAux
		varaible = b
		value = 42
	[]
[]

[Kernels]
	[diff_u]
		type = Diffusion
		variable = u
	[]
	[diff_v]
		type = Diffusion
		variable = v
	[]
[]

[BCs]
	[left_u]
		type = PenaltyDirichletBC
		variable = u
		boundary = left
		value = 0
		penalty = 1000
	[]
	[right_u]
		type = PenaltyDirichletBC
		variable = u
		boundary = right
		value = 1
		penalty = 1000
	[]
	
	[left_v]
		type = PenaltyDirichletBC
		variable = v
		boundary = left
		value = 2
		penalty = 1000
	[]
	[right_v]
		type = PenaltyDirichletBC
		variable = v
		boundary = right
		value = 1
		penalty = 1000
	[]
[]

[Problem]
	solve = false
[]

[Executioenr]
	type = Steady
	solve_type = 'NEWTON'
	nl_rel_tol = 1e-10
[]

[Outputs]
	exodus = true
[]
```

**ConstantIC**是设置一个初始值。

> Just returns a constant value

**MTICSum**将输入的变量相加同时再加上==**3**==。

```C++
//.h
class MTICSum : public InitialConditon
{
  public:
  static InputParameters validParams();
  MTICSum(const InputParameters & paramters);
  virtual ~MTICSum();
  
  virtual Real value(const Point & /*p*/);
  protected:
  const VariableValue & _var1;
  const VariableValue & _var2;
};
//.C
InputParameters MTICSum::validParams()
{
 	Inputparameters params = InitialConditon::validParams();
  params.addRequiredCoupledVar("var1", "First variable");
  params.addRequiredCoupledVar("var2", "Second variable");
  
  return params;
}
MTICSum::MTICSum(const InputParameters & paramters)
  : InitialCondition(parameters), _var1(coupledValue("var1")),
_var2(coupledValue("var2"))
{
}

MTICSum::~MTICSum() {}

Real MTICSum::value(const Point & /*p*/)
{
  return _var1[_qp] + _var2[_qp] + 3;
}
```

**MTICMult**返回的输入变量乘以==**factor**==。

```C++
//.h
class MTICMult : public InitialCondition
{
  public:
  static InputParameters validParams();
  
  MTICMult(const InputParameters & parameters);
  virtual ~MTICMult();
  
  virtual Real value(const Points & /*p*/);
  protected:
  const VariableValue & _var1;
  Real _factor;
};

//.C
InputParameters MTICMult::validParams()
{
  InputParameters params = InitialConditon::validParams();
  params.addRequiredCoupledVar("var1", "Coupled variable");
  params.addRequiredParam<Real>("factor", "Some factor");
  return params;
}

MTICMult::MTICMult(const InputParameters & parameters)
  : InitialConditon(parameters), _var1(coupledValue("var1")),
_factor(getParam<Real>("factor"))
{
}
MTICMult::~MTICMult() {}
Real MTICMult::value(const Poitn & /*p*/)
{
  return _var1[_qp] * _factor;
}
```

![image-20230125202218562](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/Rossvc_image-20230125202218562.png)

因为**Problem**中`sovle = false`，所以没有Kernel的参与。
$$
a=10 \\ u=-1\\ v=u+a+3 = 12\\ b=2\times v = 24
$$

### test.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	xmin = 0
	xmax = 1
	ymin = 0
	ymax = 1
	nx = 2
	ny = 2
[]

[AuxVariables]
	[a]
	[]
	[b]
	[]
[]

[Variables]
	[u]
	[]
	[v]
	[]
[]

[ICs]
	[u_ic]
		type = ConstantIC
		variable = u
		value = -1
	[]
	[v_ic]
		type = MTICSum
		variable = v
		var1 = u
		var2 = a
	[]
	[a_ic]
		type = ConstantIC
		variable = a
		value = 10
	[]
	[b_ic]
		type = MTICMult
		variable = b
		var1 = v
		factor = 2
	[]
[]

[AuxKernels]
	[a_ak]
		type = ConstantAux
		variable = a
		value = 256
	[]
	[b_ak]
		type = ConstantAux
		variable = b
		value = 42
	[]
[]

[Kernels]
	[diff_u]
		type = Diffusion
		variable = u
	[]
	[diff_v]
		type = Diffusion
		variable = v
	[]
[]

[BCs]
	[left_u]
		type = DirichletBC
		variable = u
		boundary = left
		value = 0
	[]
	[right_u]
		type = DirichletBC
		variable = u
		boundary = right
		value = 1
	[]
	[left_v]
		type = DirichletBC
		variable = v
		boundary = left
		value = 2
	[]
	[right_v]
		type = DirichletBC
		variable = v
		boundary = right
		value = 1
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'NEWTON'
	nl_rel_tol = 1e-10
[]

[Outputs]
	exodus = true
[]
```

相比于[monomial.i](#monomial.i)区别在于真的进行计算（去除了Problem中的`solve = false`。）所以初始结果是相同的，只是进行了计算。

![image-20230125205903927](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/ut5De7_image-20230125205903927.png)

其中的uv

![image-20230125205946116](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/j2vcDp_image-20230125205946116.png)

## from_exodus_solution

### array.i

```C++
[Mesh]
	[gmg]
		type = GeneratedMeshGenerator
		dim = 2
	 	nx = 5
	 	ny = 5
	 []
[]

[Variables]
	[u]
		order = FIRST
		family = LAGRANGE
	[]
	
	[v]
		order = CONSTANT
		family = MONOMIAL
		components = 2
	[]
[]

[Kernels]
	[u_time]
		type = TimeDerivative
		variable = u
	[]
	[u_diff]
		type = Diffusion
		variable = u
	[]
	[v_time]
		type = ArrayTimeDerivative
		variable = v
		time_derivative_coefficeint = tc
	[]
	[v_reaction]
		type = ArrayCoupledForce
		variable = v
		v = u
		coef = '1 2'
	[]
[]

[Materials/tc]
	type = GenericConstantArray
	prop_name = tc
	prop_value = '2 3'
[]

[BCs]
	[left]
		type = DirichletBC
		variable = u
		boundary = left
		value = 1
	[]
	
	[right]
		type = DirichletBC
		variable = u
		boundary = right
		value = 2
	[]
[]

[Executioner]
	type = Transient
	num_steps = 2
[]

[Outputs]
	exodus = true
[]
```

**ArrayTimeDerivative**计算向量的**kernel**。相对应的弱形式是$(\vec{u}^*, T\dot{\vec{u})}$其中$\vec{u}^*$是test function，$\dot{\vec{u}}$是时间梯度的向量的有限元变量($\dot{\vec{u}}=[\frac{\partial u_1}{\partial t}, \frac{\partial u_2}{\partial t} , \cdots]^T$)，T是时间向量的系数($(T)_{n,m} = T_{n,m}$)。

```C++
params.addParam<MaterialPropertyName>("time_derivative_coefficient", "the name of the time derivative coefficient" "Can be scalar, vector, or matrix material property");
ArrayTimeDerivative::ArrayTimeDerivative(const InputParameters & parameters)
  : ArrayTimeKernel(parameters),
_has_coefficient(isParamValid("time_derivative_coefficient")), _coeff(_has_coefficient && hasMatrialProperty<Real>("time_derivative_coefficient") ？ &getMaterialProperty<Real>("time_derivative_coefficient") : nullptr),
_coeff_array(_has_ceofficient && hasMaterialProperty<RealEigenVector>("time_derivative_coefficient") ? &getMaterialProperty<RealEigenVector>("tiem_derivative_coefficient") : nullptr),
_coeff_2d_array(_has_coefficient && hasMaterialProperty<RealEigenMatrix>("time_derivative_coefficient") ? &getMaterialProperty<RealEigenMatrix>("time_derivative_coefficient") : nullptr)
{
  
}
```

**ArrrayCoupledForce**是弱形式$\vec{u}^\ast,-\vec{\sigma} v$。

```C++
//.h
protected:
virtual void computeQpResidual(RealEigenVector & residual) override;
virtual RealEigenMatrix computeQpOffDiagJacobian(const MooseVariableFEBase & jvar) override;
private:
const bool _is_v_array;
const unsigned int _v_var;
const VariableValue * const _v;
const ArrayVariableValue * const _v_array;
const RealEigenVector _coef;

//.C
InputParameters ArrayCoupledForce::validParams()
{
  InputParameters valdiParams= ArrayKernel::validParmas();
  prams.addRequiredCoupledVar("v", "The coupled variable which provides the force");
  params.addParam<bool>("is_v_array", false, "Whether v is a array variable or not");
  params.addClassDescription("Implements a source term proportional to the value of a coupled" "standard variable Weak form $\vec{u}^\ast$, -\vec{\sigma} v$")
    return params;
}

ArrayCoupledForce::ArrayCoupledForce(const InputParameters & parameters) : ArrayKernel(parameters),
_is_v_array(getparam<bool>("is_v_array")),
_v_var(coupled("v")),
_v(_is_v_array ? nullptr : &coupledValue("v")),
_v_array(_is_v_array ? &couledArrayValue("v") : nullptr),
_coef(getParam<RealEigenVector>("coef"))
{
  if (_var.number() == _v_var)
    paramError("v", "Coupled variable 'v' needs to be different from 'variable' with ArrayCoupledForce, " "consider using Reaction or somthing similar");
  if (_is_v_array && getArrayVar("v", 0)->count() != _count)
    paramError("v", "Need to be either a standard variable or an array variable with the same" "number of components of 'variable'");
}

void ArrayCoupledForce::computeQpResidual(RealEigenVector & residual)
{
  if (_is_v_array)
    residual = -_coef.cwiseProduct((*_v_array)[_qp]) * _test[_i][_qp];
  else
    residual = -_coef * (*_v)[_qp] * _test[_i][_qp];
}

RealEigenMatrix ArrayCoupledForce::computeQpOffDiagJacobian(cosnt MooseVariableFEBase & jvar)
{
  if (jvar.number() == _v_var)
  {
    RealEigenVector v = _coef * (-_phi[_j][_qp] * _test[_i][_qp]);
    if (_is_v_array)
    {
      RealEigenMatrix t = RealEigenMatrix::Zero(_var.cout(), _var.count());
      t.diagonal() = v;
      return t;
    }
    else
      return v;
  }
  else
    return RealEigenMatrix::Zero(_var.count(), jvar.cout());
}
```

方程是
$$
\triangledown^2u=\frac{\partial u}{\partial t}\\ \vec{tc}\times\frac{\partial\vec{v}}{\partial t} = \vec{coef}\times u\\BC: u_{left} = 1 \quad u_{rihgt} = 2
$$

<center>
  <img src="https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/xk2bNr_image-20230126204037478.png"
        alt="图片缺失，检查网络"/>
  <br>
  第一个时间步
</center>

<center>	<!--将图片和文字居中-->
    <img src="https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/dxOxUO_image-20230126204016202.png"
         alt="无法显示图片时显示的文字"
         style="zoom:这里写图片的缩放百分比"/>
    <br>		<!--换行-->
    第二个时间步	<!--标题-->
    </center>

### elem_part1.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	xmin = -1
	xmax = 1
	ymin = -1
	ymax = 1
	nx = 20
	ny = 20
[]

[Functions]
	[exact_fn]
		type = ParsedFunction
		expression = t*((x*x)+(y*y))
	[]
	[forcing_fn]
		type = ParsedFunction
		expression = -4+(x*x+y*y)
	[]
[]

[AuxVariables]
	[e]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[AuxKernels]
	[ak]
		type = FunctionAux
		variable = e
		function = exact_fn
	[]
[]

[Variables]
	axtive = 'u'
	
	[u]
		order = FIRST
		family = LAGRANGE
	[]
[]

[Kernels]
	active = 'ie diff ffn'
	
	[ie]
		type = TimeDerivative
		variable = u
	[]
	[diff]
		type = Diffusion
		variable = u
	[]
	[ffn]
		type = BodyForce
		variable = u
		function = forcing_fn
	[]
[]

[BCs]
	[all]
		type = FunctionDirichletBC
		variable = u
		boundary = '0 1 2 3'
		function = exact_fn
	[]
[]

[Executioner]
	type = Transient
	
	solve_type = 'PJFNK'
	dt = 0.2
	start_time = 0
	num_steps = 5
[]

[Outputs]
	exodus = true
[]
```

$$
e = t\times (x^2 +y^2)\\\triangledown^2u-4+x^2+y^2=\frac{\partial u}{\partial t}\\BC:u_{0,1,2,3}=t\times(x^2+y^2)
$$

<center class="half">
  <img src="https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/pfrgge_%E6%97%B6%E9%97%B4.0000.png" width=450/>
  <img src="https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/uoSSew_%E6%97%B6%E9%97%B4...0001.png" width=300/>
</center>

![时间...0001](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/uoSSew_%E6%97%B6%E9%97%B4...0001.png)

![](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/pfrgge_%E6%97%B6%E9%97%B4.0000.png)

![时间.0005](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/ORUw5l_%E6%97%B6%E9%97%B4.0005.png)

<img src="https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/ur7l0e_%E6%97%B6%E9%97%B4...0005.png" alt="时间...0005" style="zoom:50%;" />

### elem_part2.i

```
#Use the exodus fiel for restarting the problem
[Mesh]
	[fmg]
		type = FileMeshGenerator
		file = elem_part1_out.e
		use_for_exodus_restart = true
	[]
	#this problem uses ExodusII_IO::copy_elemental_solution(),which only works with ReplicatedMesh
	parallel_type = replicated
[]

[AuxVariables]
	[e]
		order = CONSTANT
		family = MONOMIAL
		initial_from_file_var = e
		initial_from_file_timestep = 6
	[]
[]

[AuxKernels]
	[ak]
		type = SelfAux
		variabel = e
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
	[ffn]
		type = BodyForce
		variable = u
		function = forcing_fn
	[]
[]

[BCs]
	[all]
		type = FunctionDirichletBC
		variable = u
		boundary = '0 1 2 3'
		function = exaxt_fn
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

**SelfAux**是通过辅助变量的形式将变量输出。

> Self auxiliary value

```C++
//.h
public:
static InputParameters validParams();
SelfAux(const InputParameters & parameters);
protected:
virtual Real computeValue() override;
const VariableValue & _v;
//.C
InputParameters SelfAux::validParams()
{
  InputParameters params = AuxKernel::validParams();
  params.addClassDescription("Return the specified variable as an auxilairy variable with the same value");
  params.addCoupledVar("v", "Optional variable to take the value of. If omittd the value of the" "'varaible' itself is returned.");
  return params;
}
SelfAux::SelfAux(const InputParameters & parameters) 
  : AuxKernel(parameters), _v(isCoupled("v") ? coupledValue("v") : _u)
  {}
Real SelfAux::computValue()
{
return _v[_qp];
}
```

<center>
  <img src="https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/GV86Gn_image-20230127145230555.png" alt="检查网络"/>
  <br>
      输入的e的初始值
</center>



<center>
  <img src="https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/n99tn6_image-20230127154620901.png">
  <ba>
    part1的输出的e值
  </ba>
</center>

好像可以调用之前的函数，比如**BCs**，可以调用不同的**function**。

### nodal_part1.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	xmin = -1
	xmax = 1
	ymin = -1
	ymax = 1
	nx = 20
	ny = 20
[]

[Functions]
	[ecact_fn]
		type = ParsedFunction
		expression = t*((x*x)+(y*y))
	[]
	[forcing_fn]
		type = ParsedFunction
		expression = -4+(x*x+y*y)
	[]
[]

[Variables]
	active = 'u'
	
	[u]
		order = FIRST
		family = LAGRANGE
	[]
[]

[Kernels]
	active = 'ie diff ffn'
	
	[ie]
		type = TimeDerivative
		variable = u
	[]
	[diff]
		type = Diffusion
		variable = u
	[]
	[ffn]
		type = BodyForce
		variable = u
		function = forcing_fn
	[]
[]

[BCs]
	[all]
		type = FunctionDirichletBC
		variable = u
		boundary = '0 1 2 3'
		function = exact_fn
	[]
[]

[Executioner]
	type = Transient
	
	solve_type = 'PJFNK'
	
	dt = 0.2
	start_time = 0
	num_steps = 5
[]

[Outputs]
	file_base = out_nodal_part1
	exodus = true
	xda = true
[]
```

结果和[elem_part1.i](#elem_part1.i)相同。只是在输出结果上要求`file_base = out_nodal_part1`。

### nodal_part2.i

```C++
#use the exodus file for restarting the problem
# -restart one variable
# -and have one extra variable with IC

[Mesh]
	file = out_nodal_part1.e
[]

[Functions]
	[exaxt_fn]
		type = ParsedFunction
		expression = ((x*x)+(y*y))
	[]
	[forcing_fn]
		type = ParseFunction
		expression = -4
	[]
[]

[Variables]
	active = 'u v'
	
	[u]
		order = FIRST
		family = LAGRANGE
		initial_from_file_var = u
		initial_from_file_timestep = 6
	[]
	[v]
		order = FIRST
		family = LAGRANGE
		[InitialCondition]
			type = BoundingBoxIC
			x1 = 0.0
			x2 = 1.0
			y1 = 0.0
			y2 = 1.0
			inside = 3.0
			outside = 1.0
		[]
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
	[ffn]
		type = BodyForce
		variable = u
		function = forcing_fn
	[]
	[diff_v]
		type = Diffusion
		variable = v
	[]
	
[BCs]
	[all]
		type = FunctionDirichletBC
		variable = u
		boundary = '0 1 2 3'
		function = exact_fn
	[]
	[left_v]
		type = DirichletBC
		variable = v
		boundary = '3'
		value = 0
	[]
	[rihgt_v]
		type = DirichletBC
		variable = v
		boundary = '1'
		value = 1
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'PJFNK'
[]

[Outputs]
	file_base = out_nodal_var_restart
	exodus = true
[]
```

![image-20230127164622416](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/b3uLqF_image-20230127164622416.png)

<center> 运行结果</center>



![image-20230127164654669](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/IuKTre_image-20230127164654669.png)

<center> 初始条件</center>

## function_ic

### parsed_function.i

```C++
#Test the automatically generated gradients in ParsedFunction and the gradient pass-through in FunctionIC
#OLD Moose behavior was for parsed_function to behave the same as parsed_zerograd_function
# NEW MOOSE behavior is for parsed_function to behave the same as parsed_grad_function

[Mesh]
	type = GneratedMesh
	dim = 2
	xmin = 0
	xmax = 3.141
	ymin = 0
	ymax = 3.141
	nx = 10
	ny = 10
[]

[Variables]
	[u]
		order = THIRD
		family = HERMITE
	[]
[]

[Functions]
	[parsed_function]
		type = ParsedFunction
		expression = 'sin(x)-cos(y/2)'
	[]
	[parsed_grad_function]
		type = ParsedGradFunction
		expression = 'sin(x)-cos(y/2)'
		grad_x = 'cos(x)'
		grad_y = 'sin(y/2)/2'
	[]
	[parsed_zerograd_function]
		type = ParsedGradFunction
		value = 'sin(x)-cos(y/2)'
		grad_x = '0'
		grad_y = '0'
	[]
[]

[ICs]
	[u_ic]
		type = FunctionIC
		variable = 'u'
		function = parsed_function
	[]
[]

[Executioner]
	type = Steady
[]

[Problem]
	solve = false
[]

[Outputs]
	file_base = parsed
	[OverSampling]
		type = Exodus
		refinements = 3
	[]
[]
```

![image-20230127191929051](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/wnRWB8_image-20230127191929051.png)

**FunctionIC**设置边界或者区域的初始值是一个函数或者其导数（不知道如何设置导数）。

> Defines a boundary condition that forces the value to be a user specified function at the boundary.

```c++
//.h
public:
static InputParameters validParams();
FunctionIC(const InputParametrs & parameters);
const FunctionName functionName() const; // return the function name
protected:
//Evaluate the function at the current quadrature point and time step
Real f();
virtual Real value(const Point & p) override;//the value of the variable at a point
virtual RealGradient gradient(const Point & p) override;
const Function & _func;
const Real _scaling;//Scaling factor to be able to use a function with multipleICs
//.C
InputParameters FunctionIC::validParam()
{
  InputParameters params = InitialCondition::validParams();
  params.addRequiredParam<FunctionName>("function", "The initial condition function");
  params.addClassDescription("An initial condition that uses a normal function of x, y, z to" " produce values (and optionally gradients) for a field variable");
  params.addParam<Real>("scaling_factor", 1, "Scaling factor to apply on the function");
  
  return params;
}

FunctionIC::FunctionIC(const InputParameters & parameters)
  : InitialCondition(parameters),
_func(getFunction("function")),
_scaling(getParam<Real>("scaling_factor"))
{
}

Real FunctionIC::value(const Point & p)
{
  return _scaling * _func.value(_t, p);
}

RealGradient FunctionIC::gradient(const Point & p)
{
  return _scaling * _func.gradient(_t, p);
}

const FunctionName FunctionIC::functionName() const
{
  return _func.name();
}
```

### spline_function.i

```C++
#Test the gradient cacluation in spline function and the gradient pass-through in FunctionIC

[Mesh]
	type = GneratedMesh
	dim = 2
	xmin = 0
	xmax = 3
	ymin = 0
	ymax = 1
	nx = 10
	ny = 2
[]

[Variables]
	[u]
		order = THIRD
		family = HERMITE
	[]
[]

[Function]
	[spline_function]
		type = SplineFunction
		x = '0 1 2 3'
		y = '0 1 0 1'
	[]
[]

[ICs]
	[u_ic]
		type = FunctionIC
		variable = 'u'
		function = spline_function
	[]
[]

[Executioner]
	type = Steady
[]

[Problem]
	solve = false
[]

[Outputs]
	file_base = spline
	[OverSampling]
		type = Exodus
		refinements = 3
	[]
[]
```

**SplineFunction**定义spline函数。定义一个一维的样条函数。可以通过component设置输入变量。默认值是y，横坐标是x。可以分别设置开始和最后一个点上的梯度，默认是非常大的梯度。==自动产生一阶导数和二阶导数==。

![image-20230127213731250](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/slzdZQ_image-20230127213731250.png)

## function_scalar_ic.i

### function_scalar_ic.i

```
[Mesh]
	# a dummy mesh
	type = GeneratedMesh
	dim = 2
	xmin = 0
	xmax = 1
	ymin = 0
	yma = 1
	nx = 1
	ny = 1
	elem_type = QUAD4
[]

[Variables]
	[n]
		family = SCALAR
		order = FIRST
	[]
[]

[Functions]
	[f]
		type = ParsedFunction
		expression = cos(t)
	[]
[]

[ICs]
	[f]
		type = FunctionScalarIC
		variable = n
		function = f
	[]
[]

[ScalarKernels]
	[dn]
		type = ODETimeDerivative
		variable = n
	[]
	[ode1]
		type = ParsedODEKernel
		expression = '-n'
		variable = n
	[]
[]

[Executioner]
	type = Transient
	strat_time = 0
	end_time = 1
	dt = 0.01
	scheme = bdf2
	solve_type = 'PJFNK'
	timestep_tolerance = 1e-12
[]

[Outputs]
	csv = true
[]
```

**ParsedODEKernel**添加一个源项$s(u,v,p)$。
$$
\frac{du}{dt}=s(u,v,p)
$$

$$
\frac{dn}{dt} = n \\ n_{side} = cos(t)
$$

## hermite_ic

### hermite_ic.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 10
	ny = 10
[]

[Variables]
	[u]
		order = THIRD
		family = HERMITE
	[]
[]

[Functions]
	[afunc]
		type = ParsedFunction
		expression = x^2
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
	type = Steady
	solve_type = 'PJFNK'
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]

[ICs]
	[func_ic]
		type = FunctionIC
		function = afunc
		variable = u
	[]
[]
```

![image-20230128175337308](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/HyytXt_image-20230128175337308.png)

## integral_preserving_function_ic

### sinsoidal_z.i

```C++
[Mesh]
	type = GeneratedMesh
	dm = 3
	nx = 5
	ny = 5
	nz = 20
	xmax = 1.5
	ymax = 1.7
	zmax = 1.9
	xmin = 0.0
	ymin = 0.0
	zmin = 0.0
[]

[Problem]
	type = FEProblem
	solve = false
[]

[AuxVariables]
	[power]
		family = MONOMIAL
		order = CONSTANT
	[]
[]

[ICs]
	[power]
		type = IntegralPreservingFunctionIC
		variable = power
		magnitude = 550.0
		function = 'sin(pi * z / 1.9)'
		integral = vol
	[]
[]

[Postprocessors]
	[vol]
		type = FunctionElementIntegral
		function = 'sin(pi * z /1.9)'
		exexute_on = 'initial'
	[]
	[integrated_power] # should equal 550
		type = ElementIntegralVariablePostprocessor
		variable = power
	[]
[]

[Executioner]
	type = Steady
[]

[Outputs]
	exodus = true
[]
```

**IntegralPreservingFunctionIC**使用函数积分的初值。总积分值是mgnitude。

>Initial conditions specifying an initial conditon as a general function while preserving a total integral magnitude.

```C++
//.h
public:
static InputParameters validParams();
IntegralPreservingFunctionIC(const InputParameters & parameters);
virtual void initialSetup() override;
// return the magnitude of the function
Real magnitude() const {return _magnitude;}
protected:
virtual Real value(const Point & p) override;
//name of postprocessor providing the integral of the function
const PostprocessorName & _pp_name;
//integral of the function
const PostprocessorValue & _integral;
//Magnitude of the initial condition upon integration
const Real & _magnitude;

//.C
InputParameters IntegralPreservingFunctionIC::validParams()
{
  InputParameters params = FunctionIC::validParams();
  params.addRequiredParam<PostprocessorName>("integral", "Postprocessor providing the integral of the function, for normalization");
  params.addRequiredParam<Real>("magnituede", "Desired magnitude of the initial condition upon integration");
  params.addClassDescription("Function initial condition that preserves an integral");
  return params;
}

IntegralPreservingFunctionIC::IntegralPreservingFunctionIC(const InputParameters & parameters) : FunctionIC(parameters),
_pp_name(getParam<PostprocessorName>("integral")),
_integral(getPostprocessorValue("integral")),
_magnitude(getParsm<Real>("magnitude"))
{
}

void IntegralPreservingFunctionIC::initialSetup()
{
  const UserObject & pp = _fe_problem.getUserObject<UserObject>(_pp_name);
  if (1pp.getExecuteOnEnum().contains(EXEC_INITIAL))
    mooseError("The 'execute_on' parameters for the '" + _pp_name + "'postprocessor must include 'initial'!");
}

Real IntegralPreservingFunctionIC::value(const Point & p)
{
  if (std::abs(_integral) < libMesh::TOLERANCE)
    mooseError("The integral of " + _pp_name + "cannot be zero!");
  return magnitude() * _func.value(_t, p) / _integral;
}
```

![image-20230129203159414](http://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/cwGLEh_image-20230129203159414.png)

初始条件其实是$u=\frac{Q}{\int_{\Omega}{sin(\frac{\pi z}{1.9})d\Omega}}sin(\frac{\pi z}{1.9},t)$。

## lagrange_ic

### 3d_second_order.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 3
	nx = 5
	ny = 5
	nz = 5
	elem_type = HEX27
[]

[Variables]
	[u]
		order = SECOND
	[]
[]

[Functions]
	[afunc]
		type = ParsedFunction
		expression = x^2
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
	type = Steady
	
	solve_type = 'PJFNK'
	
	petsc_options_iname = '-pc_type -pc_hypre_type'
	petsc_options_value = 'hypre boomeramg'
[]

[Outputs]
	exodus = true
[]

[ICs]
	[func_ic]
		type = FunctionIC
		variable = u
		function = afunc
	[]
[]
```

![image-20230130101047084](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/IG3k2B_image-20230130101047084.png)

## postprcessor_interface

### postprocessor_interface.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 1
	xmin = 0
	xmax = 10
	nx = 10
[]

[Functions]
	#the integral of this function is 2*3+3*6+5*2 = 34
	[test_fn]
		type = PiecewiseConstant
		axis = x
		x = '0 2 5'
		y = '3 6 2'
	[]
[]

[Postprocessors]
	[integral_pp]
		type = FunctionElementIntegral
		function = test_fn
		exexute_on = 'INITIAL'
	[]
	[pp2]
		type = FunctionValuePostprocessor
		function = 6
		exexute_on = 'INITIAL'
	[]
[]

[AuxVariables]
	[test_var]
		order = CONSTANT
		family = MONOMIAL
	[]
[]

[ICs]
	[test_var_ic]
		type = PostprocessorIC
		variable = test_var
		pp1 = integral_pp
	[]
[]

[Problem]
	solve = false
[]

[Postprocessors]
	# this pp should have sum of the other two pps: 34+6 = 40
	[test_var_pp]
		type = ElementAverageValue
		variable = test_var
		execute_on = 'INITIAL'
	[]
[]

[Outputs]
	csv = true
[]
```

**PostprocessorIC**从预处理的结果中获取值。

> This initial condition takes values from post-processor values

```C++
//.h
public:
static InputParameters validParams();
PostprocessorIC(const InputParameters & parameters);
virtual Real value(const Point & p) override;
protected:
const PostprocessorValue & _pp1;
const PostprocessorValue & _pp2;
//.C
InputParameters PostprocessorIC::validParams()
{
  InputParameters params = InitialCondition::validParams();
  params.addClassDeacription("This initial condition takes values from post-processor values");
  params.addRequiredParam<PostprocessorName>("pp1", "Name of first test post-processor");
  return params;
}

PostprocessorIC::PostprocessorIC(const InputParameters & parameters)
  : InitialCondition(parameters),
_pp1(getPostprocessorValue("pp1")),
_pp2(getPostprocessorValueByName("pp2"))//这个应该是从输入卡读取一个名字叫pp2的变量。
{}

Real PostprocessorIC::value(const Point & /*p*/)
{
  return _pp1 + _pp2;
}
```

| time | integral_pp | pp2  | test_var_pp |
| :--: | :---------: | :--: | :---------: |
|  0   |     34      |  6   |     40      |
|  1   |     34      |  6   |     40      |

## random_ic_test

### random_ic_test.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 50
	ny = 50
[]

[Variables]
	[u]
		order = FIRST
		family = LAGRANGE
	[]
[]

[AuxVariables]
	[u_aux]
		order = FIRST
		family = LAGRANGE
	[]
[]

[ICs]
	[u]
		type = RandomIC
		legacy_generator = false
		variable = u
	[]
	[u_aux]
		type = RandomIC
		legacy_generator = false
		variable = u_aux
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
		boundary = 3
		value = 0
	[]
	[right]
		type = DirichletBC
		variable = u
		boundary = 1
		value = 1
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
```

**RandomiC**使用随机数初始化变量。可以设置`min`和`max`来设置范围。可以使用`distribution`设置随机方式。

> Initialze a variable with randomly generated numbers following either a uniform distribution or a user-defined distribution.

<center>
  <img src = 'http://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/wCryZB_image-20230130193745632.png'/>
  <ba>
  左边是变量u右边是变量u_aux(max默认是1，min默认是0)</ba>
</center>

## vector_constant_ic

### vector_constant_ic.i

```
[Mesh]
	type = GeneratedMesh
	dim = 3
	nx = 2
	ny = 2
	nz = 2
[]

[Problem]
	solve = false
	kernel_coverage_check = false
[]

[Variables]
	[A]
		order = FIRST
		family = LAGRANGE_VEC
	[]
[]

[ICs]
	[A]
		type = VectorConstantIC
		variable = A
		x_value = 2
		y_value = 3
		z_value = 4
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'NEWTON'
[]

[Outputs]
	exodus = true
[]
```

**VectorConstantIC**用于设置向量的初始值。x分量通过`x_value`设置，y分量通过`y_value`设置，z分量通过`z_value`设置。其中只有`x_value`是必须的，`y_value z_value`是非必需的。

```C++
//.h
public:
static InputParameters validParams();
VectorConstantIC(const InputParameters & parameters);
virtual RealVectorValue value(const Point & p) override;
protected:
const Real _x_value;
const Real _y_value;
const Real _z_value;
//.C
InputParameters VectorConstantIC::validParams()
{
  InputParameters params = VectorInitialCondition::validParams();
  params.addRequiredParam<Real>("x_value", "The x value to be set in IC");
  params.addParam<Real>("y_value", 0, "The y value to be set in IC");
  params.addParam<Real>("z_value", 0, "The z value to be set in IC");
  params.addClassDescription("Sets constant component values for a vector field variable");
  return params;
}

VectorConstantIC::VectorConstantIC(const InputParameters & parameters)
  : VectorInitialCondition(parameters),
_x_value(getParam<Real>("x_value")),
_y_value(getParam<Real>("y_value")),
_z_value(getParam<Real>("z_value"))
{
}
RealVectorValue VectorConstantIC::value(cosnt Point & /*p*/)
{
  return {_x_value, _y_value, _z_value};
}
```

<center>
  <img src = "https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/DgoaVN_image-20230130201059040.png"/>
  <ba>
  结果是显示的三个方向的和 sqrt{2^2+3^2+4^2}
  </ba>
</center>


### vector_short_constant_ic.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 3
	nx = 2
	ny = 2
	nz = 2
[]

[Problem]
	solve = false
	kernel_coverage_check = false
[]

[Variables]
	[A]
		order = FIRST
		family = LAGRANGE_VEC
		initial_condition = '2 3 4'
	[]
[]

[Executioner]
	type = Steady
	solve_type = 'NEWTON'
[]
[Outputs]
	exodus = true
[]
```

结果和[vectot_constant_ic.i](#vector_constant_ic.i)相同。只是可以在变量内设置通过`initial_condition`进行设置。

## vector_function_ic

### vector_function_ic.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 3
	nx = 2
	ny = 2
	nz = 2
[]

[Problem]
	solve = false
	kernel_coverage_check = false
[]

[Variables/A]
	family = LAGRANGE_VEC
[]

[ICs/A]
	type = VectorFunctionIC
	variable = A
	function = func
[]

[Functions/func]
	type = ParsedVectorFunction
	expression_x = '2*x'
	expression_y = '3*y'
	expression_z = '2*z'
[]

[Executioner]
	type = Steady
[]

[Outputs]
	exodus = true
[]
```

**VectorFunctionIC**用户可以自定义函数对象。需要注意的是函数需要是==vectorValue==。

>Sets component values for a vector field variable based on a vector function.

```C++
//.h
protected:
const Function * const _function;
//Optional component function value
const Function & _function_x;
const Function & _function_y;
const Function & _function_z;
//.C
InputParameters VectorFunctionIC::validParams()
{
  InputParameters params = VectorInitialCondition::validParams();
  params.addParam<FunctionName>("functon", "The initial condition vector function this cannot be supplied" "with the component parameters");
  ……;
  return params;
}

VectorFunctionIC::VectorFunctionIC(const InputParameters & parameters)
  : VectorInitialCondition(parameters),
_function(isParamValid("function") ? &getFunction("function") : nullptr),
_function_x(getFunction("function_x"))
  ……
{
  if (_function && parameters.isParamSetByUser("function_x"))
    paramError("function_x", "the 'function' and 'function-x' parameters cannot both be set.");
}

RealVectorValue VectorFunctionIC::value(const Point & p)
{
  if (_function)
    return _function->vectorValue(_t, p);
  else
    return RealVectorValue(_function_x.value(_t, p), _function_y.value(_t, p), _function_z.value(_t, p));
}
```

![image-20230130213739626](http://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/bz6X23_image-20230130213739626.png)

### vector_function_ic_comp.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 3
	nx = 2
	ny = 2
	nz = 2
[]

[Problem]
	solve = false
	kernel_coverage_check = false
[]

[Variables/A]
	family = LAGRANGE_VEC
[]

[ICs/A]
	type = VectorFunctionIC
	variable = A
	function_A = func
[]

[Functions/func]
	type = ParsedFunction
	expression = '2*x'
[]

[Executioner]
	type = Steady
[]

[Outputs]
	exodus = true
[]
```

只有**x**方向有值。

![image-20230130214333103](https://cdn.jsdelivr.net/gh/wangzhaohao/markdown-img@main/uPic/2023/0pfCTq_image-20230130214333103.png)

## zero_ic

### test.i

```C++
#thsi test makes sure that when people use an initial condition that accesses _zero the code does not carsh The "problem" is that InitialCondition use _qp which for nodal variables loops over nodes, rather then q-points. Thus if people have more nodes that q-points (they have to dial a lower q-rule in the Executioner block), the code would do an out-of-bounds access and crash.
[Mesh]
	type = GeneratedMesh
	dim = 3
	elem_type = HEX27
[]

[Variables]
	[u]
		order = SECOND
		family = LAGRANGE
	[]
[]

[ICs/ic_u]
	type = ZeroIC
	varaible = u
[]

[Kernels]
	[diff]
		type = Diffusion
		variable = u
	[]
[]

[BCs]
	[all]
		type = DirichletBC
		variable = u
		boundary = 'left right top bottom front back'
		value = 0
	[]
[]

[Postprocessors]
	[l2_norm]
		type = ElementL2Norm
		variable = u
	[]
[]

[Executioner]
	type = Steady
	solve_type = NEWTON
	[Quadrature]
		type = GAUSS
		order = FIRST
	[]
[]

[Outputs]
	csv = true
[]
```

**ZeroIC**设置初始值为0

> Initial condition that accesses _zero
