<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Door" :index="itemindex" sysID="4"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Fixed Rate" label-position="left">
                <el-input v-model="fixedrate" df-fixedrate size="small"></el-input>
            </el-form-item>

            <el-form-item label="Curve Rate" label-position="left" size="small">
                <el-select
                  v-model="curverate"
                  placeholder="Select"
                  style="width: 100%"
                  clearable
                  @change="setCurveRateOption"
                  value-key="nodeid"
                  df-curverate
                >
                  <el-option
                    v-for="item in curveList"
                    :key="item.index"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="Drop Speed" label-position="left">
                <el-input v-model="dropspeed" df-dropspeed size="small"></el-input>
            </el-form-item>
            <el-form-item label="Circuit Name" label-position="left">
                <el-input v-model="circuitname" df-circuitname size="small"></el-input>
            </el-form-item>
            <el-form-item label="Circuit" label-position="left">
                <el-input v-model="circuitindex" df-circuitindex size="small"></el-input>
            </el-form-item>
            <el-form-item label="Acuator" label-position="left">
                <el-input v-model="actuator" df-actuator size="small"></el-input>
            </el-form-item>
            <el-form-item label="Open Time" label-position="left">
                <el-input v-model="opentime" df-opentime size="small"></el-input>
            </el-form-item>            
            <el-form-item label="Command Group" label-position="left">
                <el-input v-model="commandgroup" df-commandgroup size="small"></el-input>
            </el-form-item>            
       </div>
    </el-form>
    </div>
</template>

<script>
import { defineComponent, onMounted, getCurrentInstance, readonly, ref, nextTick,} from 'vue'
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
        const itemindex = ref('');
        const itemname = ref('');
        const fixedrate = ref(0);
        const curverate = ref();
        const circuitindex = ref(0);
        const circuitname = ref('');
        const actuator = ref('');
        const opentime = ref(0);
        const dropspeed = ref(0);
        const commandgroup = ref(0);
        const curveList = ref([]);

        //const doortype = ref('');

        const helper = new Helper;

        // const doorTypeOptions = readonly([
        //     'Electric',
        //     'Non-Electric'
        // ]);

        // const setDoorTypeOption = () => {
        //    nextTick( () => {
        //         setAllParameters();                
        //         const data = { ...dataNode.value.data };
        //         df.updateNodeDataFromId(nodeId.value, data);
        //     });
        // }

        const setCurveRateOption = () => {
            nextTick( () => {
                setAllParameters();
            });
            //helper.setitemname(itemname, dataNode);
        }

        const setAllParameters = () => {
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                helper.checkselected(dataNode.value.data.curverate, curveList, curverate, df, nodeId, {curverate: curverate.value, ...dataNode.value.data});
                const data = {
                    itemname: itemname.value || dataNode.value.data.name,
                    fixedrate: fixedrate.value || '',
                    dropspeed: dropspeed.value || '',
                    circuitindex: circuitindex.value || '',
                    circuitname: circuitname.value || '',
                    actuator: actuator.value || '',
                    opentime: opentime.value || '',
                    commandgroup: commandgroup.value || '',
                    curverate: curverate.value || '',
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

            //helper.setitemname(itemname, dataNode);
            setAllParameters();
        }

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;
    
        onMounted(async () => {
            await nextTick()
            nodeId.value = el.value.parentElement.parentElement.id.slice(5)
            dataNode.value = df.getNodeFromId(nodeId.value)

            df.on('nodeDataChanged', getCurves);
            df.on('nodeCreated', getCurves);
            df.on('nodeRemoved', getCurves);           
             
            itemindex.value = dataNode.value.data.index;
            itemname.value = dataNode.value.data.itemname;

            fixedrate.value = dataNode.value.data.fixedrate;
            curverate.value = dataNode.value.data.curverate;
            dropspeed.value = dataNode.value.data.dropspeed;
            circuitindex.value = dataNode.value.data.circuitindex;
            circuitname.value = dataNode.value.data.circuitname;
            actuator.value = dataNode.value.data.actuator;
            opentime.value = dataNode.value.data.opentime;
            commandgroup.value = dataNode.value.data.commandgroup;
            //doortype.value = dataNode.value.data.doortype;

            getCurves();
        });
        
        return {
            el, itemindex, itemname, fixedrate, curverate, dropspeed, circuitindex, circuitname, actuator, opentime, commandgroup, curveList, setCurveRateOption
        }

    }    
    
})
</script>
