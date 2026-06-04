<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="APU" :index="itemindex" sysID="3"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>

            <el-form-item label="Bleed T Curve" label-position="left" size="small">
                <el-select
                  v-model="bleedcurve"
                  placeholder="Select"
                  style="width: 100%"
                  clearable
                  @change="setBleedCurveOption"
                  value-key="nodeid"
                  df-bleedcurve
                >
                  <el-option
                    v-for="item in curveList"
                    :key="item.index"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="Out Flow" label-position="left">
                <el-input v-model="outflow" df-outflow size="small"></el-input>
            </el-form-item>
            <el-form-item label="Volume" label-position="left">
                <el-input v-model="volume" df-volume size="small"></el-input>
            </el-form-item>
        </div>
    </el-form>
    </div>
</template>

<script>
import { defineComponent, onMounted, getCurrentInstance, readonly, ref, nextTick, } from 'vue'
import nodeHeader from './nodeHeader.vue'
import Helper from '../helper.js'

export default defineComponent({
    components: {
        nodeHeader
    },
    setup() {
        const el = ref(null);
        const nodeId = ref(0);
        let df = null
        const dataNode = ref({});
        const itemname = ref('');
        const itemindex = ref('');
        const bleedcurve = ref();
        const outflow = ref('');
        const volume = ref('');
        const curveList = ref({});

        const helper = new Helper;

        const setBleedCurveOption = () => {
            nextTick( () => {
                setAllParameters();
            });
        }

        const setAllParameters = () => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                helper.checkselected(dataNode.value.data.bleedcurve, curveList, bleedcurve, df, nodeId, {bleedcurve: bleedcurve.value, ...dataNode.value.data});
                const data = {
                    itemname: itemname.value || dataNode.value.data.name,
                    bleedcurve: bleedcurve.value || '',
                    outflow: outflow.value || '',
                    volume: volume.value || '',
                    ...dataNode.value.data };
                df.updateNodeDataFromId(nodeId.value, data);
            }
        }

        const getCurves = () => {
            const exportdata = df.export();
            const curves = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'Curve');
            if (curves) {
                curveList.value = curves.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
            setAllParameters();
        }

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;

        onMounted(async () => {
            await nextTick()
            nodeId.value = el.value.parentElement.parentElement.id.slice(5)
            dataNode.value = df.getNodeFromId(nodeId.value)

            df.on('nodeCreated', getCurves);
            df.on('nodeRemoved', getCurves);
            df.on('nodeDataChanged', getCurves);           

            itemname.value = dataNode.value.data.itemname;
            itemindex.value = dataNode.value.data.index;

            bleedcurve.value = dataNode.value.data.bleedcurve;
            outflow.value = dataNode.value.data.outflow;
            volume.value = dataNode.value.data.volume;

            getCurves();
        });
        
        return {
            el, itemname, itemindex, bleedcurve, outflow, volume, curveList, setBleedCurveOption,
        }

    }    
    
})
</script>
