需要将燃料棒的壁面通量传递给单通道流体，这个需要使用**MultiAppUserObjectTransfer**，然后需要将壁面温度传递给燃料棒，这个需要使用**MultiAppNearesNodalTransfer**。

**MultiAppUserObjectTransfer**在父类选取点上的变量值，将这个值复制给后处理模块。

> Samples a variabel's value in the Parent app domain at the pint where the MultiApp is and copies that value into a post processor in the MultiApp.

MultiAppUserObjectTransfer从父类/子类的UserObject转向父类/子类的辅助变量，这个方向和参数(to_multiapp/from_multiApp)有关系。这个传递范围可以通过参数block或者boundary限制。

```
[Transfers]
	[layered_transfer_from_sub_app]
		type = MultiAppUserObjectTransfer
		user_object = sub_app_uo # MultiApp.i 中的用户自定义变量，可能是一个UserObject输入变量
		varaible = from_sub_app_var
		from_multi_app = sub_app
		diaplaced_source_mesh = true
		skip_bounding_box_check = true
	[]
[]
```

**MultiAppNearestNodeTransfer**等同于==MultiAppGeometricInterpolationTransfer==。

```
[Transfer]
	[fromsub]
		type = MultiAppGeometricInetrpolationTransfer
		from_multi_app = sub
		source_variable = u
		variable = from_sub
	[]
[]
```


