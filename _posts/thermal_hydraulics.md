<center>thermal_hydraulics</center>

> 单通道 给入口流量和速度和出口压力

```C++
T_in = 300.         # K
m_dot_in = 1e-4     # kg/s
press = 1e5         # Pa

[GlobalParams]
  initial_p = ${press} # 设定初始值
  initial_vel = 0
  initial_T = ${T_in}

  rdg_slope_reconstruction = full # 建议一直设置成full，可以在rDG中进行全斜率计算
  closures = simple_closures #设置的管道名字，注意匹配
  fp = he # flow components 流体是he和下面的相对
[]

[FluidProperties]
  [he]
    type = IdealGasFluidProperties
    molar_mass = 4e-3
    gamma = 1.67
    k = 0.2556
    mu = 3.22639e-5
  []
[]

[Closures]
  [simple_closures]
    type = Closures1PhaseSimple #通道是单相通道
  []
[]

[Components] # 用于设置边界条件，Inlet和Outlet的名字是为了以后连接的接口。
  [inlet]
    type = InletMassFlowRateTemperature1Phase
    input = 'core_chan:in'
    m_dot = ${m_dot_in}
    T = ${T_in}
  []

  [core_chan]
    type = FlowChannel1Phase
    position = '0 0 0'
    orientation = '0 0 1'
    length = 1
    n_elems = 10
    A = 7.2548e-3
    D_h = 7.0636e-2
    f = 1.6
  []

  [outlet]
    type = Outlet1Phase
    input = 'core_chan:out'
    p = ${press}
  []
[]

[Executioner]
  type = Transient
  start_time = 0
  end_time = 2
  dt = 0.1

  line_search = basic
  solve_type = NEWTON

  nl_rel_tol = 1e-5
  nl_abs_tol = 1e-5
  nl_max_its = 5
[]

[Outputs]
  exodus = true
[]
```



> 添加热源的单相单通道的流动

---

```C++
T_in = 300.         # K
m_dot_in = 1e-4     # kg/s
press = 1e5         # Pa

# core parameters
core_length = 1.    # m
core_n_elems = 10
core_dia = ${units 2. cm -> m} # 单位变化
core_pitch = ${units 8.7 cm -> m}

tot_power = 100       # W

[GlobalParams]
  initial_p = ${press}
  initial_vel = 0
  initial_T = ${T_in}

  rdg_slope_reconstruction = full
  closures = simple_closures
  fp = he
[]

[FluidProperties]
  [he]
    type = IdealGasFluidProperties
    molar_mass = 4e-3
    gamma = 1.67
    k = 0.2556
    mu = 3.22639e-5
  []
[]

[Closures]
  [simple_closures]
    type = Closures1PhaseSimple
  []
[]

[HeatStructureMaterials]
  [steel]
    type = SolidMaterialProperties
    rho = 8050
    k = 45
    cp = 466
  []
[]

[Components]
  [total_power] # 总功率
    type = TotalPower
    power = ${tot_power}
  []

  [inlet]
    type = InletMassFlowRateTemperature1Phase
    input = 'core_chan:in'
    m_dot = ${m_dot_in}
    T = ${T_in}
  []

  [core_chan]
    type = FlowChannel1Phase
    position = '0 0 0'
    orientation = '0 0 1'
    length = ${core_length}
    n_elems = ${core_n_elems}
    A = ${fparse core_pitch * core_pitch - pi * core_dia * core_dia / 4.}
    D_h = ${fparse (4 * core_pitch * core_pitch - pi * core_dia * core_dia) / (4 * core_pitch + pi * core_dia)}
    f = 1.6
  []

  [core_hs] #设置加热段材料属性
    type = HeatStructureCylindrical
    position = '0 0 0'
    orientation = '0 0 1'
    length = ${core_length}
    n_elems = ${core_n_elems}

    names = 'block'
    widths = '${fparse core_dia / 2.}'
    materials = 'steel'
    n_part_elems = 3
  []

  [core_heating] # 从热源读取总功率
    type = HeatSourceFromTotalPower
    hs = core_hs
    regions = block
    power = total_power
  []

  [core_ht] # 流体和导热之间的热传导
    type = HeatTransferFromHeatStructure1Phase
    flow_channel = core_chan # 连接通道的名字
    hs = core_hs # 热结构部件的名字
    hs_side = outer # 边界
    P_hf = ${fparse pi * core_dia}
    Hw = 1.36
  []

  [outlet]
    type = Outlet1Phase
    input = 'core_chan:out'
    p = ${press}
  []
[]

[Executioner]
  type = Transient
  start_time = 0
  end_time = 1000
  dt = 10

  line_search = basic
  solve_type = NEWTON

  nl_rel_tol = 1e-5
  nl_abs_tol = 1e-5
  nl_max_its = 5
[]

[Outputs]
  exodus = true

  [console]
    type = Console
    max_rows = 1
    outlier_variable_norms = false
  []
  print_linear_residuals = false
[]
```



> 三维的流体和传热之间的热传导

```
# Testing energy conservation at steady state

P_hf = ${fparse 0.6 * sin (pi/24)}

[GlobalParams]
  scaling_factor_1phase = '1 1 1e-3'
  gravity_vector = '0 0 0'
[]

[Materials]
  [mat]
    type = ADGenericConstantMaterial
    block = 'blk:0'
    prop_names = 'density specific_heat thermal_conductivity'
    prop_values = '1000 10 30'
  []
[]

[FluidProperties]
  [fp]
    type = StiffenedGasFluidProperties
    gamma = 2.35
    cv = 1816.0
    q = -1.167e6
    p_inf = 1.0e9
    q_prime = 0
  []
[]

[Closures]
  [simple_closures]
    type = Closures1PhaseSimple
  []
[]


[Components]
  [in1]
    type = InletVelocityTemperature1Phase
    input = 'fch1:in'
    vel = 1
    T = 300
  []
  [fch1]
    type = FlowChannel1Phase
    position = '0.15 0 0'
    orientation = '0 0 1'
    fp = fp
    n_elems = 10
    length = 1
    initial_T = 300
    initial_p = 1.01e5
    initial_vel = 1
    closures = simple_closures
    A = 0.00314159
    f = 0.0
  []
  [out1]
    type = Outlet1Phase
    input = 'fch1:out'
    p = 1.01e5
  []

  [in2]
    type = InletVelocityTemperature1Phase
    input = 'fch2:in'
    vel = 1
    T = 350
  []
  [fch2]
    type = FlowChannel1Phase
    position = '0 0.15 0'
    orientation = '0 0 1'
    fp = fp
    n_elems = 10
    length = 1
    initial_T = 350
    initial_p = 1.01e5
    initial_vel = 1
    closures = simple_closures
    A = 0.00314159
    f = 0
  []
  [out2]
    type = Outlet1Phase
    input = 'fch2:out'
    p = 1.01e5
  []

  [blk]
    type = HeatStructureFromFile3D
    file = mesh.e
    position = '0 0 0'
    initial_T = 325
  []
  [ht]
    type = HeatTransferFromHeatStructure3D1Phase
    flow_channels = 'fch1 fch2'
    hs = blk
    boundary = blk:rmin
    Hw = 10000
    P_hf = ${P_hf}
  []
[]

[Postprocessors]
  [E_in1]
    type = ADFlowBoundaryFlux1Phase
    boundary = in1
    equation = energy
    execute_on = 'initial timestep_end'
  []
  [E_out1]
    type = ADFlowBoundaryFlux1Phase
    boundary = out1
    equation = energy
    execute_on = 'initial timestep_end'
  []
  [hf_pipe1]
    type = ADHeatRateConvection1Phase
    block = fch1
    T_wall = T_wall
    T = T
    Hw = Hw
    P_hf = ${P_hf}
    execute_on = 'initial timestep_end'
  []
  [E_diff1]
    type = DifferencePostprocessor
    value1 = E_in1
    value2 = E_out1
    execute_on = 'initial timestep_end'
  []
  [E_conservation1]
    type = SumPostprocessor
    values = 'E_diff1 hf_pipe1'
  []
  [E_in2]
    type = ADFlowBoundaryFlux1Phase
    boundary = in2
    equation = energy
    execute_on = 'initial timestep_end'
  []
  [E_out2]
    type = ADFlowBoundaryFlux1Phase
    boundary = out2
    equation = energy
    execute_on = 'initial timestep_end'
  []
  [hf_pipe2]
    type = ADHeatRateConvection1Phase
    block = fch2
    T_wall = T_wall
    T = T
    Hw = Hw
    P_hf = ${P_hf}
    execute_on = 'initial timestep_end'
  []
  [E_diff2]
    type = DifferencePostprocessor
    value1 = E_in2
    value2 = E_out2
    execute_on = 'initial timestep_end'
  []
  [E_conservation2]
    type = SumPostprocessor
    values = 'E_diff2 hf_pipe2'
  []
  [E_conservation_hs]
    type = SumPostprocessor
    values = 'hf_pipe1 hf_pipe2'
  []
[]

[Preconditioning]
  [pc]
    type = SMP
    full = true
  []
[]

[Executioner]
  type = Transient
  scheme = bdf2
  dt = 5
  end_time = 100

  solve_type = NEWTON
  line_search = basic
  abort_on_solve_fail = true
  nl_abs_tol = 1e-8
[]

[Outputs]
  file_base = 'phy.conservation_ss'
  [csv]
    type = CSV
    show = 'E_conservation1 E_conservation2 E_conservation_hs'
    execute_on = 'FINAL'
  []
[]
```

