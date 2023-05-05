# heat_conduction

## ad_convective_heat_flux

### coupled .i

```
[Mesh]
	type = GeneratedMesh
	dim = 3
	nx = 10
[]

[Variables]
	[temp]
		initial_condition = 200.0
	[]
[]

[Kernels]
	[heat_dt]
		type = ADTimeDerivative
		variable = temp
	[]
	[heat_conduction]
		type = Diffusion
		variable = temp
	[]
	[heat]
		type = ADBodyForce
		variable = temp
		value = 0
	[]
[]

[BCs]
	[right]
		type = ADConvectiveHeatFluxBC
		variable = temp
		boundary = 'right'
		T_infinity = T_inf
		heat_transfer_coefficient = htc
	[]
[]

[Materials]
	[chf_mat]
		type = ADConvectiveHeatFluxTest
		temperature = temp
		boundary = 'right'
	[]
[]

[Postprocessors]
	[left_temp]
		type = SideAverageValue
		variable = temp
		boundary = left
		execute_on = 'TIMESTEP_END initial'
	[]
	[right_temp]
		type = SideAverageValue
		variable = temp
		boundary = right
	[]
	[right_flux]
		type = SideDiffusiveFluxAverage
		variable = temp
		boundary = right
		diffusivity = 1
	[]
[]

[Executioner]
	type = Transient
	
	num_steps = 10
	dt = 1
	
	nl_abs_tol = 1e-12
[]

[Outputs]
	[out]
		type = CSV
		interval = 10
	[]
[]
```

**ADConvectiveHeatFluxBC**是一个热通量的边界条件，其中温度和换热系数都是通过材料给定的。计算热通量的表达式是$q^{''}=-H\cdot (T-T_{inf})$。其中H是换热系数（convective heat transfer coefficient），T是温度，$T_{inf}$是远端的温度。H和$T_{inf}$都是可以以材料的形式进行耦合。

> Boundary condition for vonvective heat flux where tepmerature and heat transfer coefficient are given by material properties.

```C++
//.h
class ADConvectiveHeatFluxBC : public ADIntegratedBC
{
  public:
  static InputParameters validParams();
  ADConvectiveHeatFluxBC(const InputParameters & parameters);
  protected:
  virtual ADReal computeQpResidual() override;
  const ADMaterialProperty<Real> & _T_infinity;
  const ADMaterialProperty<Real> & _htc;
};
//.C
InputParameters ADConvectiveHeatFluxBC::validParams()
{
  InputParameters params = AdIntegratedBC::validParams();
  params.addClassDescription("Convetive heat transfer boundary condition with temperatuer and heat" "transfer coefficent give by material properties");
  params.addRequiredParam<MaterialPropertyName>("T_infinity", "Material property for far-field temperature");
  params.addRequiredParam<MaterialPropertyName>("heat_transfer_coefficient", "Material property for heat transfer coefficient");
  
  return params;
}

ADConvectiveHeatFluxBC::ADConvectiveHeatFluxBC(const InputParameters & parameters) :
ADIntegratedBC(parameters),
_T_infinity(getADMaterialProperty<Real>("T_infinity")),
_htc(getADMaterialProperty<Real>("heat_transfer_coefficient"))
{
}
ADReal ADConvectiveHeatFluxBC::computeQpResidual()
{
  return -_test[_i][_qp] * _htc[_qp] * (_T_infinity[_qp] - _u[_qp]);//感觉写错了吧，应该是_T_inifity在后面吧
}
}
```

**ADConvectiveHeatFluxTest**返回$T_{inf} = T+1$   $H =\frac{T}{100}+1$。

```C++
//.h
class ADConvectiveHeatFluxTest : public Material
{
  public:
  ADConvectiveHeatFluxTest(const InputParameters & parameters);
  static InputParameters validParams();
  protected:
  virtual void computeQpProperties();
  private:
  const ADVariableValue & _temperature;
  ADMaterialProperty<Real> & _t_inf;
  ADMaterialProperty<Real> & _htc;
};
//.C
InputParameters ADConvectiveHeatFluxTest::validParams()
{
  auto params = Material:validParams(); //为什么数据类型不使用InputParameters呢？
  params.addRequiredCoupledVar("temperature", " Coupled temperature");
  return params;
}

ADConvectiveHeatFluxTest::ADConvectiveHeatFluxTest(const InputParameters & parameters)
  : Material(parameters),
_temperature(adCoupledValue("temperature")),
_t_inf(declareADProperty<Real>("T_inf")),
_htc(declareADProperty<Real>("htc"))
{
}
void ADConvectiveHeatFluxTest::computeQpProperties()
{
  _t_inf[_qp] = _temperature[_qp] + 1;
  _htc[_qp] = _temperature[_qp] / 100 + 1;
}

```

**SideDiffusiveFluxAverage**对边界通量进行积分。

```C++
//.h
template <bool>
class SideDiffusiveFluxAverageTempl;
typedef SideDiffusiveFluxAverageTempl<fasle> SideDiffusiveFluxAverage;
typedef SideDiffusiveFluxAverageTempl<true> ADSideDiffusiveFluxAverage;

template <bool is_ad>
class SideDiffusiveFluxAverageTempl : public SideDifffusiveFluxIntegralTempl<is_ad, Real>
{
  public:
  static InputParameters validParams();
  SideDiffusiveFluxAverageTempl(const InputParameters & parameters);
  virtual void initialize() override;
  virtual void execute() override;
  virtual void finalize() override;
  virtual Real getValue() override;
  virtual void threadJoin(const UserObject & y) override;
  protected:
  Real _volume;
  using SideDiffusiveFluxIntegralTempl<is_ad, Real>::_integral_value;
};
//.C
registerMooseObject("MooseApp", SideDiffusiveFluxAverage);
registerMooseObject("MooseApp", ADSideDiffusiveFluxAverage);
registerMooseObjectRenamed("MooseApp", SideFluxAverage, "06/30/2021 24:00", SideDiffusivieFluxAverage);
registerMooseObjectRenamed("MooseApp", ADSideFluxAverage, "06/30/2021 24:00", ADSideDiffusiveFluxAverage);

template <bool is_ad>
InputParameters
SideDiffusiveFluxAverageTempl<is_ad>::validParams()
{
  InputParameters params = SideDiffusiveFluxIntegralTempl<is_ad, Real>::validParams();
  return params;
}

template <bool is_ad>
SideDiffusiveFluxAverageTempl<is_ad>::SideDiffusiveFluxAverageTempl(const InputParameters & parameters)
  : SideDiffusiveFluxIntegralTempl<is_ad, Real>(parameters), _voluume(0)
  {}
template <bool is_ad>
SideDiffusiveFluxAverageTempl<is_ad>::initialize()
{
  SideDiffusiveFluxIntegralTempl<is_ad, Real>::initialzie();
  _volume = 0.;
}

template <bool is_ad>
SideDiffusiveFluxAverageTempl<is_ad>::execute()
{
  SideDiffusiveFluxIntegralTempl<is_ad, Real>::execute();
  _volume += this->_current_side_volume;
}
template <bool is_ad>
SideDiffusiveFluxAverageTempl<is_ad>::getValue()
{
  return _integral_value / _volume;
}
template <bool is_ad>
SideDiffusiveFluxAverageTempl<is_ad>::finalize()
{
  SideDiffusiveFluxIntegralTempl<is_ad, Real>::gatherSum(_integral_value);
  SideDiffusiveFluxIntegralTempl<is_ad, Real>::gatherSum(_volume);
}

template <bool is_ad>
void
SideDiffusiveFluxAverageTempl<is_ad>::threadJoin(const UserObject & y)
{
  SideDiffusiveFluxIntegralTempl<is_ad, Real>::threadJoin(y);
  const SideDiffusiveFluxAverageTempl<is_ad> & pps = static_cast<const SideDiffusiveFluxAverageTempl<is_ad> &>(y);
  _volume += pps._volume;
}
template class SideDiffusiveFluxAverageTempl<false>;
template class SdieDiffusiveFluxAverageTempl<true>;
```

$$
\triangledown^2T=\frac{\part T}{\part t}\\BC:q_{right}=-(\frac{T}{100}+1)\times(T-(T+1))
$$

### equilibrium.i

```C++
[Mesh]
	type = GeneratedMesh
	dim = 3
	nx = 10
[]

[Variables]
	[temp]
		initial_condition = 200.0
	[]
[]

[Kernels]
	[heat_dt]
		type = ADTimeDerivative
		variable = temp
	[]
	[heat_concuction]
		type = ADDiffusion
		variable = temp
	[]
[]

[BCs]
	[right]
		type = ADConvectiveHeatFluxBC
		variable = temp
		boundary = 'right'
		T_infinity = 100.0
		heat_transfer_coefficient = 1
	[]
[]

[Postprocessors]
	[left_temp]
		type = SideAverageValue
		variable = temp
		boundary = left
		execute_on = 'TIMESTEP_END initial'
	[]
	[right_temp]
		type = SideAverageValue
		variable = temp
		boundary = right
	[]
	[right_flux]
		type = SideDiffusiveFluxAverage
		variable = temp
		boundary = right
		diffusivity = 1
	[]
[]

[Executioner]
	type = Transient
	
	num_steps = 10
	dt = 1e1
	
	nl_abs_tol = 1e-12
[]

[Outputs]
	[out]
		type = CSV
		interval = 10
	[]
[]
```

与[coupled.i](#coupled.i)相比，只是把其中的==T_infinity heat_transfer_coefficient==换成了数据，而不是从材料中读取。这是因为`params.addRequiredParam<MaterialPropertyName>("T_infinity")`。

### flux.i

这是一个测试**ConvectiveHeatFluxBC**的输入。初始条件是1✖️1的网格，左边边界有一个预置的温度，右边有一个通量的边界条件。左边的温度是100，无穷远处的温度是200，体热导（热导率*长度）是10。如果边界上的热导也是10，那么右边的温度应该是150。原因是体上的温度应该会下降一半边界上会下降一半。

边界上的积分通量是`daltaT * conductance`，也就是-50*10 = -500。负值表示热通量方向是向着体。

```
[Mesh]
	type = GeneratedMesh
	dim = 2
[]

[Problem]
	extra_tag_vectors = 'bcs' #应该是输出计算残差和雅可比矩阵的对象（kernels BCs, etc）
[]

[Kernels]
	[heat_conduction]
		type = ADHeatConduction
		variable = temp
		thermal_conductivity = 10
	[]
[]

[BCs]
	[left]
		type = ADDirichletBC
		variable = temp
		boundary = left
		value = 100.0
	[]
	[right]
		type = ADConvectiveHeatFluxBC
		variable = temp
		boundary = right
		T_inifity = 200.0
		heat_transfer_coefficient = 10
	[]
[]

[Postprocessors]
	[right_flux]
		type = SideDiffusivieFluxAverage
		variable = temp
		boundary = right
		diffusivity = 10
	[]
[]

[Executioner]
	typer = Transient
	
	num_steps = 1.0
	nl_rel_tol = 1e-12
[]

[Outputs]
	csv = true
[]
```

$$
10\triangledown^2(temp)=0\\BC:temp_{left} = 100.0 \quad	\triangledown {temp}_{right} = -10\times(temp-200)
$$

## ad_heat_conduction

### test.i

```C++
#This test solves a 1D transient heat equation with a complicated thermal conductivity in order to verfiy jacobian calculation via AD
[Mesh]
	type = GeneratedMesh
	dim = 2
	nx = 5
	ny = 5
	xmax = 0.001
	ymax = 0.001
[]

[Variables]
	[T]
		initial_condition = 1.5
	[]
	[c]
		initial_condition = 1.5
	[]
[]

[Kernels]
	[HeatDiff]
		type = ADHeatConduction
		variable = T
		thermal_conductivity = thermal_conductivity
	[]
	[heat_dt]
		type = ADHeatConductionTimeDerivative
		varaible = T
		specific_heat = thermal_conductivity
		density_name = thermal_conductivity
	[]
	[c]
		type = ADDiffusion
		variable = c
	[]
[]

[kernels]
	[c_dt]
		type = TimeDerivative
		variable = c
	[]
[]

[BCs]
	[left_c]
		type = DirichletBC
		variable = c
		boundary = left
		value = 2
	[]
	[right_c]
		type = DirichletBC
		variable = c
		boundary = right
		value = 1
	[]
	[left_T]
		type = DirichletBC
		variable = T
		boundary = top
		value = 1
	[]
	[right_T]
		type = DirichletBC
		varialbe = T
		boundary = bottom
		value = 2
	[]
[]

[Materials]
	[k]
		type = ADThermalConductivityTest
		c = c
		temperature = T
	[]
[]

[Preconditioning]
	[full]
		tpe = SMP
		full = true
	[]
[]

[Executioner]
	type = Transient
	num_steps = 1
[]
```

**ADHeatConductionTimeDerivative**是计算时间项。

```C++
//.h 看来普通的材料没有什么区别
const ADMaterialProperty<Real> & _density;
const ADMaterialProperty<Real> & _specific_heat;
//.C
registerMooseOjbect("HeatConductionApp", ADHeatConductionTimeDerivative);

InputParameters ADHeatConductionTimeDerivative::validParams()
{
  InputParamters params = ADTimeDerivative::validParams();
  params.addClassDescription("AD Time derivative term $\rho c_p \frac{\partial T}{partial t}$ of" "the heat equation for quasi-constant specific heat $c_p$ and the density $\rho$");
  params.set<bool>("use_displaced_mesh") = true;
  params.addParam<MaterialPropertyName>("specific_heat", "specific_heat", "Property name of the specific heat material property");
  params.addParam<MaterialPropertyName>("density_name", "density", "Property name of the density material property");
  return params;
}
ADHeatConductionTimeDerivative::ADHeatConductionTimeDerivative(const InputParametrs & parameters)
  : ADTimeDerivative(parameters),
_specific_heat(getADMaterialProperty<Real>("specific_heat")),
_density(getADMaterialProperty<Real>("density_name"))
{}
ADReal ADHeatConductionTimeDerivative::precomputeQpResidual()
{
  return _specific_heat[_qp] * _density[_qp] * ADTimeDerivative::precomputeQpResidual();
}
```

输入卡要计算的表达式如下，==注意k为thernal_conductivity代指==
$$
k\triangledown^2T=\rho\C_p\frac{\part T}{\part t}\\ \triangledown^2c=\frac{\part c}{\part t}\\BC:c_{left} = 2\quad c_{right} = 1\\T_{top}=1\quad T_{bottom} = 2
$$
其中thermal_conductivity来自于ADThermalConductivityTest。

ADThermalConductivityTest

```C++
//.h
class ADThermalConductivityTest : public Material
{
  public:
  static InputParamters validParams();
  ADThermalConductivityTest(const InputParameters & parameters);
  protected:
  virtual void computeQpProperties();
  private:
  ADMaterialProperty<Real> & _diffusivity;
  const ADVariableValue & _temperature;
  const ADVariableValue & _c;
};
//.C
registerMooseObject("HeatConductionTestApp", ADThermalConductivityTest);

InputParameters ADThermalConductivityTest::validParams()
{
  InputParametrs params = Material::validParams();
  params.addRequiredCoupledVar("temperature", "Coupled temperature");
  params.addRequiredCoupledVar("c", "Coupled variable used to help verfiy automatic differentiation capability");
  return params;
}

ADThermalConductivityTest::ADThermalConductivityTest(const InputParameters & parameters)
  : Material(parameters),
_diffusivity(declareADProperty<Real>("thermal_conductivity")),//注意declar的材料属性是thermal_conductivity
_temperature(adcoupledValue("temperature")),
_c(adcoupledValue("c"))
{
}
void ADThermalConductivityTest::computeQpProperties()
{
  _diffusivity[_qp] = _temperature[_qp] * _c[_qp];
}
```

可以看出==热导率==等于输入的温度✖️c。$k=T\times c$。

## code_verification

### cartesian_test_no1.i

### cartesian_test_no1.i

```C++
#Problem I.i
# An infinite plate with constant thermal conductivity k and internal heat heat generation q. It is exposed on each boundary to a constant
# temperature: u(0) = ui and u(L) = u0;
[Mesh]
	[geom]
		type = GeneratedMeshGenerator
		dim = 1
		elem_type = EDGE2
		nx = 1
	[]
[]

[Variables]
	[u]
		order = FIRST
	[]
[]

[Functions]
	[exact]
		type = ParsedFunction
		symbol_names = 'q L k ui uo'
		symbol_values = '1200 1 12 100 0'
		expression = 'ui + (u0-ui)*x/L+(q/k)*x*(L-x)/2'
	[]
[]

[Kernels]
	[heat]
		type = HeatConduction
		variable = u
	[]
	[heatsource]
		type = HeatSource
		function = 1200
		varaible = u
	[]
[]

[BCs]
	[ui]
		type = DirichletBC
		boundary = left
		variable = u
		value = 100
	[]
	[uo]
		type = DirichletBC
		boundary = right
		variable = u
		value = 0
	[]
[]

[Materials]
	[property]
		type = GenericConstantMaterial
		prop_names = 'density specific_heat thermal_conductivity'
		prop_values = '1.0 1.0 12.0'
	[]
[]

[Executioner]
	type = Steady
[]

[Postprocessor]
	[error]
		type = ElementL2Error
		function = exact
		variable = u
	[]
	[h]
		type = AverageElementSize
	[]
[]

[Outputs]
	csv = true
[]
```

求解方程如下：
$$
12\triangledown^2u+1200=0\\BC:u_{left}=100 \quad u_{right} = 0
$$
其中的ecact的表达式$exact = 100 +(0-100)\times \frac{x}{1} + \frac{1200}{12}\times x \times (1-x)/2$。

**ElementL2Error**计算某一个变量和已知的函数之间的欧几里得距离（Euclidean distance）。如果想要计算两个变量之间的欧几里得距离使用**ElementL2Difference**。

```C++
//.h
static InputParameters validParams();
ElementL2Error(const InputParameters & parameters);
virtual Real getValue() override;
protected:
virtual Real computeQpIntegral() override;
const Function & _func;
//.C
InputParameters ElementL2Error::validParams()
{
  InputParameters params = ElementIntegralVariablePostprocessor::validParams();
  params.addRequiredParam<FunctionName>("function", "The analytic aolution to compare against");
  params.addClassDescription("Compute L2 error between a field variable and an analytical function");
  return params;
}

ElementL2Error::ElementL2Error(const InputParameters & parametres)
: ElementIntegralVariablePostprocessor(parameters),
_func(getFunction("function"))
{}

Real ElementL2Error::getValue()//将每个点上的误差相加，同时开根号
{
  return std::sqrt(ElementIntegralPostprocessor::getValue());
}

Real ElementL2Error::computeQpIntegral()//应该是计算每一个点上的误差
{
  Real diff = _u[_qp] - _func.value(_t, _q_point[_qp]);
  return diff*diff;
}
```

**AverageElementSize**计算平均的element大小。

但是不知道为啥这个结果输出是1 0.5 0.25 0.125 0.00625。

### caresian_test_no2.i

```C++
[Mesh]
	[geom]
		type = GeneratedMeshGenerator
		dim = 1
		elem_type = EDGE2
		nx = 1
	[]
[]

[Variables]
	[u]
		order = FIRST
	[]
[]

[Functions]
	[exact]
		type = ParsedFunction
		symbol_names = 'L beta ki ko ui uo'
		symbol_values = '1 1e-3 5.3 5 300 0'
		expression = 'u0+(k0/beta)*((1+L*beta*(ki+ko)*(ui-u0)*((L-x)/(ko*L)^2))^0.5 -1)'
	[]
[]

[Kernels]
	[heat]
		type = HeatConduction
		variable = u
	[]
[]

[BCs]
	[ui]
		type  = DirichletBC
		boundary = left
		variable = u
		value = 300
	[]
	[uo]
		type = DirichletBC
		boundary = right
		variable = u
		value = 0
	[]
[]

[Materials]
	[property]
		type = GenericConstanceMaterial
		prop_names = 'density specific_heat'
		prop_values = '1.0 1.0'
	[]
	[thermal_conductivity]
		type = ParsedMaterial
		property_name = 'thermal_conductivity'
		coupled_variables = u
		expression = '5 + 1e-3 *(u-0)'
	[]
[]

[Executioner]
	type = Steady
[]

[Postprocessors]
	[error]
		type = ElementL2Error
		function = exact
		variable = u
	[]
	[h]
		type = AverageElementSize
	[]
[]

[Outputs]
	csv = true
[]
```

$$
(5+10^{-3}u)\triangledown^2u=0\\BC:u_{left} = 300\quad u_{right} = 0
$$

$$
u=0+(\frac{5}{10^{-3}})\times((1+1\times10^{-3}\times(5.3+5)\times(300-0)\times(\frac{(1-x)}{(5\times 1)^2})^{0.5}-1)
$$

### cartesian_test_no3.i

```C++
# Ther thermal concuctivity of an infinite plate varies linearly with temperature: k = k0(1+beat*u).
#It has a constant internal heat generation q, 
# and has the boundary conditions du/dx =0 at x=L and u(L) = u0
[Mesh]
	[geom]
		type = GeneratedMeshGenerator
		dim = 1
		elem_type = EDGE2
		nx = 4
	[]
[]

[Variables]
	[u]
		order = FIRST
	[]
[]

[Functions]
	[exact]
		type = ParasedFunction
		symbol_names = 'q L beta uo ko'
		symbol_values = '1200 1 1e-3 0 1'
		expression = 'u0+(1/beta)*((1+(1-(x/L)^2) * (beta*q*L^2)/ko)^0.5-1)'
	[]
[]

[Kernels]
	[heat]
		type = HeatConduction
		variable = u
	[]
	[heatsource]
		type = HeatSource
		function = 1200
		variable = u
	[]
[]

[BCs]
	[ui]
		type = NeumanBC
		boundary = left
		variable = u
		value = 0
	[]
	[uo]
		type = DirichletBC
		boundary = right
		variable = u
		value = 0
	[]
[]

[Materials]
	[property]
		type = GenericConstantMaterial
		prop_names = 'density specific_heat'
		prop_vlues = '1.0 1.0'
	[]
	[thermal_conductivity]
		type = ParsedMaterial
		property_name = 'thermal_concuctivity'
		coupled_variables = u
		expression = '1*(1+1e-3*u)'
	[]
[]

[Executioner]
	type = Steady
[]

[Postprocessors]
	[error]
		type = ElementL2Error
		function = exact
		variable = u
	[]
	[h]
		type = AverageElementSize
	[]
[]
```

$$
(1+10^{-3}u)\triangledown^2u+1200 = 0 \\BC:\quad u_{right} = 0 \quad \triangledown u_{left} = 0
$$

### cartesian_test_no4.i

```C++
#An infinite plate with constant thernmal conductivity k and inernal heat generator q.
#The left boundary is exposed to a constant heat flux q0.
#the right boundary is exposed to a fluid with the constant temperature uf and heat transfer coefficient h,
#with results in the covective boundary condition.
[Mesh]
	[geom]
		type = GeneratedMeshGenerator
		dim = 1
		elem_type = EDGE2
		nx = 1
	[]
[]

[Variables]
	[u]
		order = FIRST
	[]
[]

[Functions]
	[exact]
		type = ParsedFunction
		symbol_names = 'q q0 k L uf h'
		symbol_values = '1200 200 1 1 100 10.0'
		expression = 'uf + (q0 +L*q)/h+0.5*(2*q0+q*(L+x))*(L-x)/k'
	[]
[]

[Kernels]
	[heat]
		type = HeatConduction
		variable = u
	[]
	[heatsource]
		type = HeatSource
		function = 1200
		variable = u
	[]
[]

[BCs]
	[ui]
		type = NeumanBC
		boundary = left
		variable = u
		value = 200
	[]
	[uo]
		type = CoupledConvectiveHeatFluxBC
		boundary = right
		variable = u
		htc = 10.0
		T_infintiy = 100
	[]
[]

[Mateirals]
	[property]
		type = GenericConstantMaterial
		prop_names = 'density specific_heat thermal_conductivity'
		prop_values = '1.0 1.0 1.0'
	[]
[]

[Executioner]
	type = Steady
[]

[Postprocessors]
	[error]
		type = ElementL2Error
		function  = exact
		variable = u
	[]
	[h]
		type = AverageElementSize
	[]
[]

[Outputs]
	csv = true
[]
```

$$
\triangledown^2u+1200 = 0 \\BC: \triangledown u=200 \quad \triangledown u= 10*(u-100)
$$

### cartesian_test_no5,i

```C++
# the veloumetric heat generation in an infinite plate varies linearly
# with spatial location. It has constant thermal conducitivity. It is insulated ont the # left boundary and exposed to a constant temperature on the right.
[Mesh]
	[geom]
		type = GeneratedMeshGenerator
		dim = 1
		elem_type = EDGE2
		nx = 1
	[]
[]

[Variables]
	[u]
		order = FIRST
	[]
[]

[Functions]
	[volumetric_heat]
		type = Parsedfunction
		symbol_names = 'q L beta'
		symbol_values = '1200 1 0.1'
		expression = 'q * (1-beta*x/L)'
	[]
	[exact]
		type = ParsedFunction
		symbol_names = 'uo q k L beta'
		symbol_values = '300 1200 1 1 0.1'
		expression = 'uo+(0.5*q*L^2/k)*((1-(x/L)^2)-(1-(x/L)^3*beta/3)'
	[]
[]

[Kerneles]
	[heatconduction]
		type = HeatConduction
		variable = u
	[]
	[heatsource]
		type = HeatSource
		function = vloumteric_heat
		variable = u
	[]
[]

[BCs]
	[uo]
		type = DirichletBC
		boundary = right
		variable = u
		value = 300
	[]
[]

[Materials]
	[property]
		type = GenericConstantMaterial
		prop_names = 'density specific_heat thermal_conductivity'
		prop_values = '1.0 1.0 1.0'
	[]
[]

[Executioner]
	type = Steady
[]

[Postprocessors]
	[error]
		type = ElementL2Error
		function = exact
		variable = u
	[]
	[h]
		type = AveragElementSize
	[]
[]

[Outputs]
	csv = true
[]
```

和之前的类似，只是把体热源换成了一个和位置相关的函数。
$$
\triangledown^2u+1200\times(1-0.1x)=0 \\ BC:u_{right}= 300
$$

### cylindrical_test_no1.i

```C++
#An infinitely long hollow cylinder has an inner radius ri and outer radius ro. It has
# a constant thermal conductivity k and internal heat geneation q. It is allowed to reach 
# thermal eqqulibrium while being exposed to constant temperatures on its inside an out
# side bounaries: u(ri) = ui and u(r0) = uo.
[Mesh]
	[geom]
		type = GneratedMeshGenerator
		dim = 1
		elem_type = EDGE2
		xmin = 0.2
		nx = 4
	[]
[]

[Variables]
	[u]
		order = FIRST
	[]
[]

[Problem]
	coord_type = RZ #later should in Mesh
[]

[Functions]
	[exact]
		type = ParsedFunction
		symbol_names = 'ri r0 ui uo'
		symbol_values = '0.2 1.0 300 0'
		expression = '(uo*log(ri)-ui*log(ro)+(ui-u0)*log(x))/log(ri/ro)'
	[]
[]

[Kernels]
	[heat]
		type = HeatConduction
		variable = u
	[]
[]

[BCs]
	[ui]
		type = DirichletBC
		boundary = left
		varaible = u
		value = 300
	[]
	[uo]
		type = DirichletBC
		boundary = right
		variable = u
		value = 0
	[]
[]

[Materials]
	[property]
		type = GenericConstantMaterial
		prop_names = 'density specific_heat thermal_conductivity'
		prop_values = '1.0 1.0 5.0'
	[]
[]

[Executioner]
	type = Steady
[]

[Postprocessors]
	[error]
		type = ElementL2Error
		variable = u
		function = exact
	[]
	[h]
		type = AverageElementSize
	[]
[]

[Outputs]
	csv = true
[]
```

