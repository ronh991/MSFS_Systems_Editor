<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Valve" :index="itemindex" sysID="3"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Circuit" label-position="left">
                <el-input v-model="circuit" df-circuit size="small"></el-input>
            </el-form-item>
            <el-form-item label="Man Areas" label-position="left" size="small">
                <el-select
                  v-model="managedareas"
                  placeholder="Select"
                  style="width: 100%"
                  size="small"
                  clearable
                  multiple
                  df-managedareas
                  @change="setManAreasOption"
                  value-key="nodeid"
                >
                  <el-option
                    v-for="item in managedareasList"
                    :key="item.index"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
            </el-form-item>
           <el-form-item label="Open Time" label-position="left">
                <el-input v-model="openingtime" df-openingtime size="small"></el-input>
            </el-form-item>
            <el-form-item label="Type" label-position="left">
                <el-select v-model="valvetype" @change="selectValveType" df-valvetype placeholder="Select" size="small">
                  <el-option
                    v-for="item in valveTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
            </el-form-item> 
            <el-form-item v-if="managedareas !== undefined && managedareas !== ''" label="PID" label-position="left">
                <el-input v-model="valvepid" df-valvepid size="small"></el-input>
            </el-form-item>
        </div>
    </el-form>
    </div>
</template>

<script>
import { defineComponent, onMounted, getCurrentInstance, readonly, ref, nextTick, } from 'vue'
import nodeHeader from './nodeHeader.vue'
import Helper from '../helper';

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

        // Data items
        const circuit = ref();
        const managedareas = ref({});
        const openingtime = ref();
        const valvetype = ref('');
        const valvepid = ref();

        const managedareasList = ref();

        const valveTypeOptions = readonly([
            'Generic',
            'OutFlow',
            'CrossBleed',
            'HotAir',
        ]);

        const helper = new Helper;

        const setManAreasOption = () => {
            nextTick( () => {
                setAllParameters();
            });
        }
        
        const selectValveType = () => {
            nextTick( () => {
                setAllParameters();
            });
        }

        const setAllParameters = () => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                helper.checkmultiselected(dataNode.value.data.managedareas, managedareasList, managedareas, df, nodeId, { managedareas: managedareas.value, ...dataNode.value.data }, dataNode);
                const data = {
                    itemname: itemname.value || dataNode.value.data.name,
                    circuit: circuit.value || '',
                    openingtime: openingtime.value || '',
                    valvetype: valvetype.value || '',
                    valvepid: valvepid.value || '',
                    managedareas: managedareas.value || '',
                    ...dataNode.value.data };
                df.updateNodeDataFromId(nodeId.value, data);
            }
        }

        const getManagedAreas = () => {
            const exportdata = df.export();
            const areas = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'Area');
            if (areas) {
                managedareasList.value = areas.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
            setAllParameters();
         }

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;

        onMounted(async () => {
            await nextTick()
            nodeId.value = el.value.parentElement.parentElement.id.slice(5)
            dataNode.value = df.getNodeFromId(nodeId.value)

            df.on('nodeCreated', getManagedAreas);
            df.on('nodeRemoved', getManagedAreas);
            df.on('nodeDataChanged', getManagedAreas);
            
            itemindex.value = dataNode.value.data.index;
            itemname.value = dataNode.value.data.itemname;
            
            circuit.value = dataNode.value.data.circuit;
            managedareas.value = dataNode.value.data.managedareas;
            openingtime.value = dataNode.value.data.openingtime;
            valvetype.value = dataNode.value.data.valvetype;
            valvepid.value = dataNode.value.data.valvepid;

            getManagedAreas();
       });
        
        return {
            el, itemname, itemindex, circuit, openingtime, valvetype, valvepid, managedareas, managedareasList, valveTypeOptions, setManAreasOption, selectValveType, 
              
        }

    }    
    
})
</script>
