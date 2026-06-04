<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Pack" :index="itemindex" sysID="3"/>
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
           <el-form-item label="Typ Flow" label-position="left">
                <el-input v-model="typicalflow" df-typicalflow size="small"></el-input>
            </el-form-item>
            <el-form-item label="Volume" label-position="left">
                <el-input v-model="volume" df-volume size="small"></el-input>
            </el-form-item>
            <el-form-item label="Min Temp Out" label-position="left">
                <el-input v-model="mintempout" df-mintempout size="small"></el-input>
            </el-form-item>
            <el-form-item label="Def Temp Out" label-position="left">
                <el-input v-model="deftempout" df-deftempout size="small"></el-input>
            </el-form-item>
            <el-form-item label="Pk Flow Low" label-position="left">
                <el-input v-model="packflowlow" df-packflowlow size="small"></el-input>
            </el-form-item>
            <el-form-item label="Pk Flow Norm" label-position="left">
                <el-input v-model="packflownorm" df-packflownorm size="small"></el-input>
            </el-form-item>
            <el-form-item label="Pk Flow High" label-position="left">
                <el-input v-model="packflowhigh" df-packflowhigh size="small"></el-input>
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
        const typicalflow = ref();
        const volume = ref();
        const mintempout = ref();
        const deftempout = ref();
        const packflowlow = ref();
        const packflownorm = ref();
        const packflowhigh = ref();
        const managedareas = ref();

        const managedareasList = ref([]);

        const helper = new Helper;

        const setManAreasOption = () => {
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
                    typicalflow: typicalflow.value || '',
                    volume: volume.value || '',
                    mintempout: mintempout.value || '',
                    deftempout: deftempout.value || '',
                    packflowlow: packflowlow.value || '',
                    packflownorm: packflownorm.value || '',
                    packflowhigh: packflowhigh.value || '',
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
            typicalflow.value = dataNode.value.data.typicalflow;
            volume.value = dataNode.value.data.volume;
            mintempout.value = dataNode.value.data.mintempout;
            deftempout.value = dataNode.value.data.deftempout;
            packflowlow.value = dataNode.value.data.packflowlow;
            packflownorm.value = dataNode.value.data.packflownorm;
            packflowhigh.value = dataNode.value.data.packflowhigh;
            managedareas.value = dataNode.value.data.managedareas;

            getManagedAreas();
       });
        
        return {
            el, itemname, itemindex, circuit, typicalflow, volume, mintempout, deftempout, packflowlow, packflownorm, packflowhigh, managedareas, managedareasList, setManAreasOption
              
        }

    }    
    
})
</script>
