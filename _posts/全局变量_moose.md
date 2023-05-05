|           全局变量            |                             解释                             |           出现的地方            |
| :---------------------------: | :----------------------------------------------------------: | :-----------------------------: |
|        *_current_node         | 应该是和Nodal相关的，如果isNodal()为真，则通过这个获得当前节点 | /framework/SpatialUserOjbectAux |
| _current_elem->vertex_average |   和上面相对，如果isNodal()为假，则通过获得element类型的值   |              同上               |
|         _var.count()          |                      变量的组成componet                      |    /framwork/ArrayDiffusion     |

