<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Valve" :index="itemindex" sysID="2"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname size="small"></el-input>
            </el-form-item>
            <el-form-item label="Type" label-position="left">
                <el-select v-model="valvetype" df-valvetype @change="selectValveType" placeholder="Select" size="small">
                  <el-option
                    v-for="item in valveTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
            </el-form-item> 
            <el-form-item v-if="valvetype ==='PressureRelief' || valvetype ==='PressureReducer' || valvetype ==='Priority'" label="Pres Thr" label-position="left">
                <el-input v-model="pressurethreshold" df-pressurethreshold size="small"></el-input>
            </el-form-item>
            <el-form-item label="Circuit" label-position="left">
                <el-input v-model="circuitname" df-circuitname size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="circuitname === '' || circuitname === undefined" label="Circuit Index" label-position="left">
                <el-input v-model="circuitindex" df-circuitindex size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="valvetype ==='Shutoff'" label="Rest Pos" label-position="left">
                <el-input v-model="restposition" df-restposition size="small"></el-input>
            </el-form-item> 
            <el-form-item label="Wear & Tear" label-position="left">
                <el-input v-model="wearandtear" df-wearandtear size="small" type="textarea" :rows="3"></el-input>
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
        const valvetype = ref('');
        const pressurethreshold = ref(0);
        const circuitname = ref(0);
        const circuitindex = ref('0');
        const restposition = ref(0);
        const wearandtear = ref('');

        const valveTypeOptions = readonly([
            'Shutoff',
            'PressureRelief',
            'PressureReducer',
            'Priority',
            'Differential',
        ]);

        const helper = new Helper;
        
        const selectValveType = () => {
            nextTick( () => {
                setAllParameters();
            });
        }

        const setAllParameters = () => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                const data = {
                    itemname: itemname.value || '',
                    valvetype: valvetype.value || '',
                    pressurethreshold: pressurethreshold.value || '',
                    circuitname: circuitname.value || '',
                    circuitindex: circuitindex.value || '',
                    restposition: restposition.value || '',
                    wearandtear: wearandtear.value || '',
                    ...dataNode.value.data };
                df.updateNodeDataFromId(nodeId.value, data);
            }
        }

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;
    
        onMounted(async () => {
            await nextTick()
            nodeId.value = el.value.parentElement.parentElement.id.slice(5)
            dataNode.value = df.getNodeFromId(nodeId.value)

            //df.on('nodeCreated', setAllParameters);
            //df.on('nodeRemoved', setAllParameters);
            df.on('nodeDataChanged', setAllParameters);           
            
            itemname.value = dataNode.value.data.itemname;
            itemindex.value = dataNode.value.data.index;

            valvetype.value = dataNode.value.data.valvetype;
            pressurethreshold.value = dataNode.value.data.pressurethreshold;
            circuitname.value = dataNode.value.data.circuitname;
            circuitindex.value = dataNode.value.data.circuitindex;
            restposition.value = dataNode.value.data.restposition;
            wearandtear.value = dataNode.value.data.wearandtear;

            setAllParameters();
        });
        
        return {
            el, itemname, itemindex, pressurethreshold, valvetype, circuitname, circuitindex, restposition, wearandtear, valveTypeOptions, selectValveType,
        }

    }    
    
})
</script>
