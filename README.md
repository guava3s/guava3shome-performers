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

PS: 为什么会有scene的概念？
总体来说仅仅通过group的变化就可以制作出丰富的内容，但有时候控制者需要还原最原始或者说是后退到某个时刻的画面，这时候就需要scene。

#### stage

canvas 渲染舞台，即最终呈现区域

一个canvas实例拥有一个stage，且该stage由多个不同时刻的scene组成，最终呈现仅为最大时刻的scene

## Usage

#### 创建G3Stage对象

```js
const stage = new G3Stage(dom, startParams)
```

#### 操作stage

| 可用方法              | 参数                                                                            | 返回值                               | 效果                                       |
|-------------------|-------------------------------------------------------------------------------|-----------------------------------|------------------------------------------|
| pushScene         | scene: SceneModel;<br/>run: boolean [default:true]                            | undefined                         | 插入一幅场景(scene)，若run布尔判定为true时重绘stage      |
| popScene          | index: number [default: 1];<br/>run: boolean  [default:true]                  | undefined                         | 移除最后添加的n幅场景(scene)，若run布尔判定为true时重绘stage |
| getNewestScene    |                                                                               | {scene:SceneModel, index: number} | 获取最后添加的场景对象                              |
| updateScene       | scene: SceneModel;<br/>index: number;<br/>run: boolean [default: true]        | undefined                         | 更新指定位置的场景对象，若run布尔判定为true时重绘stage        |
| updateNewestScene | callback: function;<br/>run: boolean [default: true]                          | undefined                         | 通过回调更新最后添加的场景对象，若run布尔判定为true时重绘stage    |
| addEvent          | eventName: string;<br/>callback: function                                     | undefined                         | 为该stage添加事件                              |
| removeEvent       | eventName: string;<br/>callback: function                                     | undefined                         | 为该stage移除事件                              |
| getStartParams    |                                                                               | startParams                       | 获取启动参数信息                                 |
| getActionFrames   | typeAndId: string                                                             | Array                             | 获取当前正在绘制或等待绘制的关键帧                        |
| addActionFrame    | description: DescriptionModel;<br/> frame: number                             | undefined                         | 添加绘制关键帧                                  |
| clearFrameAndRect | x: number;<br/>y: number;<br/>w: number;<br/>h: number; <br/>typeDesc: object | undefined                         | 清除指定区域的内容，并清除指定type与id下的关键帧              |

## model

#### startParams

```js
/*
{
    category: '',
    animation: {
        duration: 1000,     // 默认动画持续时间
    },
    tooltip: {
        xDistance: 30,  // x点与鼠标默认距离
        yDistance: 40,  // y点与鼠标默认距离
    },
    width: 300,     // 默认画布宽度
    height: 300,    // 默认画布高度
    drawParams: {
        lineWidth: 2    // 默认线宽
    },
    color: {
        ...chartsBaseColor
    }
}
 */
```

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
  type, 'line' | 'shape' | 'font' | 'point' | 'image'
  startCoordinate:{x,y},
  endCoordinate?:{x,y},
  node?<=>this.meta,
  active?, true,
  angle?, 0
  scale?, 1
  imageInfo?:{
    entity,
    width?,
    height?,
  },
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

