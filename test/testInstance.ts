import {PERFORMER_TYPE} from "../src/common/enums";
import {G3Stage} from "../src/model/Stage";
import {StageScene} from "../src/model/Scene";

function testInstance(dom: HTMLCanvasElement) {
    const stage: G3Stage = new G3Stage(dom)

    stage.globalProperties.height = 200


    const scene = new StageScene('test')
    console.log(scene)
    // scene.id = 1
    /*
        可在任意时刻对任意场景添加组，且仅最大时刻的场景才会受到run参数影响
        scene在创建时，自动完善scene相关字段值，添加group时，自动完善group相关字段值，所以在Stage插入scene时，传入的是Strong的scene
        scene更新group，将本次提供的属性值赋予给已有的对应属性，未提供的则不做更改；members字段则直接替换
        Stage不提供更新scene操作，
     */
    scene.addGroups([{
        name: "lighting",
        priority: 1,
        members: [
            {
                description: {
                    type: PERFORMER_TYPE.LINE,
                    startCoordinate: {x: 1, y: 1},
                    endCoordinate: {x: 5, y: 1}
                }
            }
        ]
    }])

    scene.updateGroups([{
        name: "lighting",
        members: [
            {
                description: {
                    type: PERFORMER_TYPE.LINE,
                    startCoordinate: {x: 1, y: 1},
                    endCoordinate: {x: 5, y: 1}
                }
            }
        ]
    }])

    scene.getGroups()
    // scene.removeGroups()
    // scene.updateGroups(() => {
    //

    // stage.globalProperties.useForceAutoRefresh = true
    // })

    scene.updateGroups([{
        name: "lighting",
        members: [
            {
                description: {
                    type: PERFORMER_TYPE.LINE,
                    startCoordinate: {x: 1, y: 1},
                    endCoordinate: {x: 5, y: 1}
                }
            }
        ]
    }])
    // scene.setProperty({
    //     name: '',
    //     model: ''
    // })

    // stage.pushScene(scene)
    // stage.popScene(scene)


}
