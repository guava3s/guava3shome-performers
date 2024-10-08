import {generateUUID} from "../common/util.js";
import G3Stage from "../core.js"
import {drawType} from "../common/enum.js";
export default function exeElectWave(dom, startParams = {category: 'lightning', width: 600, height: 600}, instanceParams) {

    const stage = new G3Stage(dom, startParams)

    function generatePointerList() {
        const {width, height} = stage.getStartParams()
        const cPoint = {x: width / 2, y: height / 2}
        const heightHalf = height / 100
        const borderTop = cPoint.y - heightHalf
        let count = 0
        return new Array(100).fill('').map((_, i) => {
            const id = generateUUID()
            return {
                id,
                description: {
                    id,
                    type: drawType.POINT,
                    startCoordinate: {
                        x: Math.random() + (10 * i),
                        y: borderTop + (2 * heightHalf * Math.random())
                    },
                    pointInfo: {
                        entanglementLineWidth: 1,
                        entanglementColor: '#2443d0'
                    }
                },
                priority: count++,
            }
        })
    }

    stage.pushScene({
        renderGroup: [{
            members: generatePointerList(),
            type: drawType.LINE_CONTINUOUS_COMPOSITE,
            priority: 1
        }]
    })

    setInterval(() => {
        stage.updateNewestScene(({scene}) => {
            scene.renderGroup = [{
                members: generatePointerList(),
                type: drawType.LINE_CONTINUOUS_COMPOSITE,
                priority: 1
            }]
        })
    }, 100)
}