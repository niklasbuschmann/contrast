# thermal_expansion

## ad_constant_expansion_coeff.i

```C++
# This test involves only thermal expansion strains on a 2X2X2 cube of approximate steel material.
# An initial temperature of 25 degress C is given for the material, and an auxkernel is used to calculate the 
# temperture  in the entire cube to raise the temperature each time step. After the first timestep,
# in which the temperature jumps, the temperature increases by 6.25C each timestep. The thermal strain increment should
# therefore be 6.25C *1.3e-5 1/C = 8.125e-5 m/m
# This test is also designed to be used to identify problems with restart files

[Mesh]
	type = GeneratedMesh
	dim = 3
	nx = 2
	ny = 2
	nz = 2
[]

[GlobalParams]
	displacements = 'disp_x disp_y disp_z'
[]

[Variables]
	[temp]
	[]
[]

[Functions]
	[temperature_load]
		type = ParsedFunction
		expression = t*(500.0)+300.0
	[]
[]

[Modules]
	[TensorMechanics]
		[Master]
			[all]
				strain = SMALL
				incremental = true
				add_variables = true
				eigenstrain_names = eigenstrain
				generate_output = 'strain_xx strain_yy strain_zz'
				use_automatic_differentiation = true
			[]
		[]
	[]
[]

[Kernels]
	[tempfuncaux]
		type = Diffusion
		variable = temp
	[]
[]

[BCs]
	[x_bot]
		type = DirichletBC
		variable = disp_x
		boundary = left
		value = 0.0
	[]
	[y_bot]
		type = DirichletBC
		variable = disp_y
		boundary = bottom
		value = 0.0
	[]
	[z_bot]
		type = DirichletBC
		variables = disp_z
		boundary = back
		value = 0.0
	[]
	[temp]
		type = FunctionDirichletBC
		variable = temp
		function = temperature_load
		boundary = 'left right'
	[]
[]

[Materials]
	[elsticity_tensor]
		type = ADComputeIsotropicElasticvityTensor
		youngs_modulus = 2.1e5
		poissons_ratio = 0.3
	[]
	[small_stess]
		type = ADComputeFiniteStrainElasticStess
	[]
	[thermal_expansion_strain]
		type = ADComputeThermalExpansionEigenstrain
		stress_free_temperature = 298
		thermal_expansion_coeff = 1.3e-5
		tmperature = temp
		eigenstrain_name = eigenstrain
	[]
[]

[Preconditioning]
	[smp]
		type = SMP
		full = true
	[]
[]

[Executioner]
	type = Transient
	solve_type = 'NETWON'
	
	l_max_its = 50
	nl_max_its = 50
	nl_rel_tol = 1e-12
	nl_abs_tol = 1e-10
	start_time = 0.0
	end_time = 0.075
	dt = 0.0125
	dtmin = 0.0001
[]

[Outputs]
	exodus = true
[]

[Postprocessors]
	[strain_xx]
		type = ElementAverageValue
		variable = strain_xx
	[]
	[strain_yy]
		type = ElementAverageValue
		variable = strain_yy
	[]
	[strain_zz]
		type = ElementAverageValue
		variable = strain_zz
	[]
	[temperature]
		type = AverageNodalVariableValue
		variable = temp
	[]
[]
```

**ADComputeThermalExpansionEigenstrain**计算由于常数热膨胀系数导致的热膨胀的应变。
$$
\epsilon^{thermal} = \alpha \cdot(T-T_{stress_free})I
$$
其中$\alpha$是热膨胀系数，$T$是当前温度，$T_{stress_free}$是应力为零的温度。$I$是单位矩阵。

```c++
//.h
//moose中对于热膨胀的计算一般都是两个部分，一个是base文件，另一个才是计算文件。
//比如热膨胀，有ComputeThermalExpansionEigenstrainBase和ComputeThermalExpansionEigenstrain这两个部分组成
//ComputeThermalExpansionEgienstrainBase.h
#include "ComputeEigenstrainBase.h"
#include "DerivativeMaterialInterface.h"
#include "RankTwoTensorForward.h"
#include "ChainedReal.h"

// Return type with a single derivative
template <bool is_ad>
using ValueAndDerivative = typename std::conditional<is_ad, ADReal, ChainedReal>::type;
template <bool is_ad>
class ComputeThermalExpansionEigenstrainBaseTempl : public DerivativeMaterialInterface<ComputeEigenstrainBaseTempl<is_ad>>
{
  public:
  static InputParameters validParams();
  ComputeThermalExpansionEigenstrainBaseTempl(const InputParameters & parameters);
  // resize _temperature_buffer
  virtual void subdomainSetup() final;//派生类中将不能再重载这个虚函数
  //update _tmperature_buffer
  virtual void computeProperties() final;
  vitrual void computeQpEigenstrain() override;
  protected:
  /* computeThermalStrain must be overridden in derived classes. The return type ValueAndDerivative<is_ad> contains the value
  for the thermal strain and its temperature derivative. Derived class should use '_temperture[_qp]' to obtain the current 
  temperature. In the is_ad == false case the member variable is agumented and will be of the type ChainedReal. Ie. even with
  is_ad == false a variant of forward mode automatic differentiation will be used internally to compute the thermal strain and
  no manual implementation of temperature derivative is needed.
  @return thermal strain and derivative, where the thermal strain is the linear thermal strain(\delat L / L)
  */
  virtual ValueAndDerivative<is_ad> computeThermalStrain() = 0;
  /* Tempeature to use in the eigenstrain calculation (current value if _use_old_temperature = fasle, old value if _use_old_tmperature = true).
  We use a const reference to a private member here to prevent derived classes from accidentally overwriting any values.
  */
  const std::vector<ValueAndDerivative<is_ad>> & _temperature;
  
  /// lag temperature variable
  const bool _use_old_temperature;
  ///previous time step temperature
  const VariableValue & _temperature_old;
  // this temperature derivative property is only created and set for is_ad == false
  MaterialProperty<RankTwoTensor> * _deigenstrain_dT;
  const VariableValue & _stress_free_temperature;
  
  using ComputeEigenstrainBaseTempl<is_ad>::_qp;
  using ComputeEigenstrainBaseTempl<is_ad>::_eigenstrain;
  using ComputeEigenstrainBaseTempl<is_ad>::_eigenstrain_name;
  
  private:
  /* Temperature used in the eigenstrain calculation (current value if _use_old_temperature= false, 
  old value if _use_old_temperature= true)
  */
  std::vector<ValueAndDerivative<is_ad>> _temperature_buffer;
  //current temperature
  const GenericVariableValue<is_ad> & _temperature_prop;
  //mean coefficeint of thermal expansion (for output verification)
  MaterialProperty<Real> * _mean_thermal_expansion_coefficient;
  
};

typedef ComputeThermalExpansionEigenstrainBaseTempl<false> ComputeThermalExpansionEigenstrainBase;
typedef ComputeThermalExpansionEigenstrainBaseTempl<true> ADComputeThermalExpansionEgienstrainBase;

//ComputeThermalExpansionEigenstrainBase.C
#include "ComputeThermalExpansionEigenstrainBase.h"
#include "RankTwoTensor.h"

template <bool is_ad>
InputParameters
ComputeThermalExpansionEigenstrainBaseTempl<is_ad>::validParams()
{
  InputParamters params = ComputeEigenstrainBaseTempl<is_ad>::validParams();
  params.addCoupledVar("temperature", "Coupled temperature");
  params.addRequiredCoupledVar("stress_free_tmperature",
                              "Reference temperture at which there is no "
                              "thermal expansion for thermal eigenstrain "
                              "calculation");
  params.addParam<bool>("use_old_temperature",
                       false, 
                       "Flag to optionally use the temperature value from the previous timestep.");
  params.addParam<MaterialPropertyName>("mean_thermal_expansion_coefficient_name",
                                       "Name of the mean coefficient of thermal expansion.");
  return params;
}

template <bool is_ad>
ComputeThermalExpansionEigenstrainBaseTempl<is_ad>::ComputeThermalExpansionEigenstrainBaseTempl(cosnt InputParameters & parameters)
  : DerivativeMaterialInterface<ComputeEigenstrainBaseTempl<is_ad>>(parameters),
_temperature(_temperture_buffer),
_use_old_temperature(this->template getParam<bool>("use_old_temperature")),
_tempearute_old(this->_fe_problem.isTransient() ? this->coupledValueOld("temperature")
               : this->_zero),
_deigenstrain_dT(is_ad ? nullptr 
                : &this->template declarePropertyDerivative<RankTwoTensor>(_eigenstrain_name, this->getVar("temperature", 0)->name())),
_stress_free_temperature(this->coupledValue("stress_free_temperature")),
_temperature_prop(this->template coupledGenericValue<is_ad>("temperature")),
_mean_thermal_expansion_ceefficient(this->isParamValid("mean_thermal_expansion_coefficient_name")
                                   ? &this->template declareProperty<Real>(this->template getParam<MaterialPropertyName>("mean_thermal_expansion_coefficient_name")) : nullptr)
{
  if (_use_old_temperature && !this->_fe_problem.isTransient())
    this->paramError(
  "use_old_temperature", 
  "The old state of the temperature variable is only available in a transient simulation");
}

template <bool is_ad>
void
ComputeThermalExpansionEigenstrainBaseTempl<is_ad>::subdomainSetup()//resize temperature_buffer
{
  //call parent class subdomain setup, which ultimately calls Material::subdoaminSetup()
  ComputeEigenstrainBaseTempl<is_ad>::subdoaminSetup();
  //make sure we have enouch spece to hold the  augmented temperature values
  const auto nqp = this->_fe_problem.getMaxQps();
  _temperature_buffer.resize(nqp);
}
template <bool is_ad>
void
ComputeThermalExpansionEigenstrainBaseTempl<is_ad>::computeProperties()
{
  // we need to convert the temperature variable. to a ChainedReal in the is_ad== false case
  for (_qp = 0; _qp < this->_qrule->n_points(); ++_qp)
    if constexpr (is_ad)
      _temperature_buffer[_qp] = _use_old_temperature ? _temperature_old[_qp] : _temperature_prop[_qp];
  else
  {
    if (_use_old_temperature)
      _temperature_buffer[_qp] = {_temperature_old[_qp], 0};
    else
      _temperature_buffer[_qp] = {_temperature_prop[_qp], 1};
  }
  ComputeEigenstrainBaseTempl<is_ad>::computeProperties();
}

template <bool is_ad>
void
ComputeThermalExpansionEigenstrainBaseTempl<is_ad>::computeQpEigenstrain()
{
  _eigenstrain[_qp].zero();
  const auto thermal_strain = computeThermalStrain();
  if constexpr (is_ad)
  {
    _eigenstrain[_qp].addIa(thermal_strain);
    if (_mean_thermal_expansion_coefficeint)
    {
      if (_temperature[_qp] == _stress_free_temperature[_qp])
        (*_mean_thermal_expansion_coefficient)[_qp] = 0.0'
      else
          (*_mean_thermal_expansion_ceofficient)[_qp] = MetaPhysical::raw_value(
      thermal_strain / (_temperature[_qp] -_stress_free_temperature[_qp]));
    }
  }
  else
  {
    _eigenstrain[_qp].addIa(thermal_strain.value());
    if (_mean_thermal_expansion_coefficient)
    {
      if (_temperature[_qp].value() == _stress_free_temperature[_qp])
        (*_mean_thermal_expansion_coefficient)[_qp] = 0.0;
      else
        (*_mean_thermal_expansion_coefficient)[_qp] = 
        thermal_strain.value() / (_temperature[_qp].value() - _stress_free_tempearutre[_qp]);
    }
    (*_deigenstrain_dT)[_qp].zero();
    if (!_use_old_temperature)
      (*_deigenstrain_dT)[_qp].addIa(thermal_strain.derivatives());
  }
}

template class ComputeThermalExpansionEigenstrainBaseTempl<false>;
template class ADComputeThermalExpansionEigenstrainBaseTempl<true>;
```

