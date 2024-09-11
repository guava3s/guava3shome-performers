# guava3shome-performers

## Terminology

#### performer
一个区域内的一个绘制项；

最基本的绘制单位

#### group
一帧内的某个拥有相同性质绘制项组；

其中1个group至少包含一个performer

#### scene
单位时间内所呈现的场景，即一个关键帧绘制

最基本的渲染单位

其中1个scene至少包含1个group

#### stage
canvas 渲染舞台，即最终呈现区域

一个canvas实例拥有一个stage，且该stage由多个不同时刻的scene组成，最终呈现仅为最大时刻的scene

## model

#### renderContainer

```js
/*
        {
            runEngine: false,
            sceneStack: {
                contextState: {},
                renderModel: 'parallel', '> parallel < | priority | random'
                renderGroup: [
                    {
                        members: [
                            {
                                id: <=> this.description.id,
                                description: {},
                                priority: number,
                                beforeRender: function
                            }
                        ],
                        priority: number,
                        duration: number,
                        beforeRender?: function,
                        type:  'line' | 'font' | 'point' | 'rect' | 'circular' | 'round' | 'line_parallel' | 'line_series' | 'line_replace'
                    }
                ],
            }
        }
 */
```

#### description

```js
/*
description:{ 节点在canvas的描述信息
  id, 描述信息编号uuid
  owner<=>this.meta.name,
  type, 'line' | 'shape' | 'font' | 'point'
  startCoordinate:{x,y},
  endCoordinate?:{x,y},
  node?<=>this.meta,
  active?, true
  shapeInfo?:{
    color: [    节点填充色,长度大于1，则使用渐变,
        '#3e2554',<==>[0.5, '#3e2554']
        [1, '#3e2554']
    ],
    followerLineColor?, 跟随线颜色
    width?,
    height?,
    nodeShape, '>rect<' | 'circular' | 'round'
  },
  lineInfo?: {
    width?,
    color?, 线填充色
  },
  pointInfo?: {
    entanglementColor: '',
    entanglementLineWidth: ''
  },
  fontInfo?: {
    color?,
    label,
  }
}
 */
```

