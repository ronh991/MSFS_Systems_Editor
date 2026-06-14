<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Eleccurve" :index="itemindex" />
      <el-form
        label-width="auto"
      >
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Smoothen" label-position="left" size="small">
                  <el-switch
                    v-model="smoothen"
                    @change="setSmoothen"
                    class="ml-2"
                    style="--el-switch-on-color: #7f449e; --el-switch-off-color: #737373"
                  />
            </el-form-item>
            <el-form-item label="Points" label-position="left">
                <el-input v-model="points" df-points :rows="2" type="textarea" size="small"></el-input>
            </el-form-item>
            <div class="graph" ref="graph"></div>
        </div>
    </el-form>
    </div>
</template>

<script>
import { defineComponent, onMounted, getCurrentInstance, readonly, ref, nextTick, useTemplateRef, watch, } from 'vue'
import nodeHeader from './nodeHeader.vue'

const defaultCurve = '0:0, 0.5:0.5, 1:1';

export default defineComponent({
    components: {
        nodeHeader
    },
    setup() {
        const el = ref(null);
        const nodeId = ref(0);
        let df = null
        const dataNode = ref({});
        const itemindex = ref('');
        const itemname = ref('');
        const smoothen = ref(0);
        const points = ref(defaultCurve);
        const graph = useTemplateRef('graph');

        watch(params, async () => {
          drawPath();
        })

        const createSmoothPath = (data, w, h, max_x, max_y, smoothing = 0.1) => {
            if (data.length < 2) {
                return '';
            }
            const coord = data.map( p => ({x: p.x * w / max_x, y: (p.y * -h/max_y) + h}));
            let pathData = `M ${coord[0].x},${coord[0].y}`;
            for (let i = 1; i < coord.length; i++) {
                const pStart = coord[i - 1];
                const pEnd = coord[i];
                const pPrev = coord[i - 2] || pStart;
                const pNext = coord[i + 1] || pEnd;
        
                const cpsX = pStart.x + (smoothing * (pEnd.x - pPrev.x));
                const cpsY = pStart.y + (smoothing * (pEnd.y - pPrev.y));
                const cpeX = pEnd.x - (smoothing * (pNext.x - pStart.x));
                const cpeY = pEnd.y - (smoothing * (pNext.y - pStart.y));
                pathData += ` C ${cpsX},${cpsY} ${cpeX},${cpeY} ${pEnd.x},${pEnd.y}`;
            }
            return pathData;
        }

        const createSVGPath = (data) => {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            var x_values = data.map(a => a.x);
            var y_values = data.map(a => a.y);
            const max_x = x_values.reduce((a, b) => Math.max(a, b), -Infinity);
            const max_y = y_values.reduce((a, b) => Math.max(a, b), -Infinity);
            const w = 200;
            const h = 200;
            svg.setAttribute('width', w);
            svg.setAttribute('height', h);

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', createSmoothPath(data, w, h, max_x, max_y));
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', '#E2E2E2');
            path.setAttribute('stroke-width', '2px');

            svg.appendChild(path);
            return svg;     
        }


        const drawPath = () => {
           if (graph.value && points.value) {
                const svg = createSVGPath(convertPoints(points.value));
                graph.value.innerHTML = '';
                graph.value.appendChild(svg);
           }
        }

        const convertPoints = (points) => {
            return points.split(',').map(d => {
                const coords = d.trim().split(':');
                return {y: parseFloat(coords[1]), x: parseFloat(coords[0])}; 
            });
        }
        const setSmoothen = (val) => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;
    
        onMounted(async () => {
            await nextTick()
            nodeId.value = el.value.parentElement.parentElement.id.slice(5)
            dataNode.value = df.getNodeFromId(nodeId.value)
            
            itemindex.value = dataNode.value.data.index;
            points.value = dataNode.value.data.points || defaultCurve;
            nextTick( () => {
                const data = { points: points.value, ...dataNode.value.data };
                df.updateNodeDataFromId(nodeId.value, data);
            });

            drawPath();
        });
        
        return {
            el, itemname, itemindex, points, smoothen, graph,
            setSmoothen,
        }

    }    
    
})
</script>
<style scoped>
.graph {
    width: 200px;
    height: 200px;
    margin: auto;
    margin-top: 12px;
    background: #121212;
}

</style>