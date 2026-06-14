<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Engine" :index="itemindex" sysID="3"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Engine Index" label-position="left">
                <el-input v-model="engineindex" df-engineindex size="small"></el-input>
            </el-form-item>

            <el-form-item label="Bleed Curve" label-position="left" size="small">
                <el-select
                  v-model="bleedcurve"
                  placeholder="Select"
                  style="width: 100%"
                  clearable
                  @change="setBleedCurveOption"
                  value-key="nodeid"
                >
                  <el-option
                    v-for="item in curveList"
                    :key="item.index"
                    :label="item.index"
                    :value="item"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="Output Flow" label-position="left">
                <el-input v-model="outputflow" df-outputflow size="small"></el-input>
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

        //const helper = new Helper;
        
        const el = ref(null);
        const nodeId = ref(0);
        let df = null
        const dataNode = ref({});
        const itemname = ref('');
        const itemindex = ref('');
        const engineindex = ref('1');
        const bleedcurve = ref();
        const outputflow = ref('0');
        const volume = ref('0');
        const curveList = ref([]);

        const helper = new Helper;

        const setBleedCurveOption = () => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        const setAllParameters = (id) => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                helper.checkselected(dataNode.value.data.bleedcurve, curveList, bleedcurve, df, nodeId, {bleedcurve: bleedcurve.value, ...dataNode.value.data});
                const data = {
                    ...dataNode.value.data, 
                    itemname: itemname.value || '',
                    bleedcurve: bleedcurve.value || '',
                    engineindex: engineindex.value || '',
                    outputflow: outputflow.value || '',
                    volume: volume.value || '',
                };
                df.updateNodeDataFromId(nodeId.value, data);
           }
        }

        const getCurves = (id) => {
            const exportdata = df.export();
            const curves = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'Curve');
            if (curves) {
                curveList.value = curves.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
            setAllParameters(id);
        }

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;
    
        onMounted(async () => {
            await nextTick()
            nodeId.value = el.value.parentElement.parentElement.id.slice(5)
            dataNode.value = df.getNodeFromId(nodeId.value)
            
            df.on('nodeDataChanged', function(id) {nextTick( () => {
                    getCurves(id);
                });
            })
            df.on('nodeCreated', function(id) {nextTick( () => {
                    getCurves(id);
                });
            })
            df.on('nodeRemoved', function(id) {nextTick( () => {
                    getCurves(id);
                });
            })
            
            itemname.value = dataNode.value.data.itemname;
            itemindex.value = dataNode.value.data.index;
            
            engineindex.value = dataNode.value.data.engineindex || itemindex.value || '1';
            bleedcurve.value = dataNode.value.data.bleedcurve;
            outputflow.value = dataNode.value.data.outputflow;
            volume.value = dataNode.value.data.volume;

            getCurves(nodeId.value);
    });
        
        return {
            el, itemname, itemindex, engineindex, bleedcurve, outputflow, volume, curveList, setBleedCurveOption,
        }

    }    
    
})
</script>
