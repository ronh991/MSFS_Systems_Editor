<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="ConsumerCfg" :index="itemindex" sysID="1"/>
      <el-form
        label-width="auto"
      >
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="CType" label-position="left">
                <el-select v-model="cType" @change="selectConsumerType" placeholder="Select" size="small" clearable>
                  <el-option
                    v-for="item in consumerTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="Amp" label-position="left">
                <el-input v-model="amperage" df-amperage size="small"></el-input>
            </el-form-item>
            <el-form-item label="Volt" label-position="left">
                <el-input v-model="voltage" df-voltage size="small"></el-input>
            </el-form-item>
            <el-form-item label="Watt" label-position="left">
                <el-input v-model="wattage" df-wattage size="small"></el-input>
            </el-form-item>
            <el-form-item label="Res" label-position="left">
                <el-input v-model="resistance" df-resistance size="small"></el-input>
            </el-form-item>
            <el-form-item label="Res Min" label-position="left">
                <el-input v-model="resistancemin" df-resistancemin size="small"></el-input>
            </el-form-item>
            <el-form-item label="Res Max" label-position="left">
                <el-input v-model="resistancemax" df-resistancemax size="small"></el-input>
            </el-form-item>
                <div v-if="cType !== 'Custom' && cType !== undefined">
                    <el-form-item label="Capacity" label-position="left">
                        <el-input v-model="capacity" df-capacity size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="ChrgC Rate" label-position="left">
                        <el-input v-model="chargecrate" df-chargecrate size="small"></el-input>
                    </el-form-item>
                </div>
        </div>
    </el-form>
    </div>
</template>

<script>
import { defineComponent, onMounted, getCurrentInstance, readonly, ref, nextTick, } from 'vue'
import nodeHeader from './nodeHeader.vue'

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

        // data Items
        const amperage = ref();
        const voltage = ref();
        const wattage = ref(0);
        const resistance = ref();
        const resistancemin = ref();
        const resistancemax = ref();
        const capacity = ref();
        const chargecrate = ref();

        const cType = ref();

        const consumerTypeOptions = readonly([
            'Battery',
            'Custom',
        ]);
        
        const selectConsumerType = () => {
            nextTick( () => {
                setAllParameters();
            });
        }

        const setAllParameters = () => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                const data = {
                    itemname: itemname.value || dataNode.value.data.name,
                    amperage: amperage.value || '',
                    voltage: voltage.value || '',
                    cType: cType.value || '',
                    wattage: wattage.value || '',
                    resistance: resistance.value || '',
                    resistancemin: resistancemin.value || '',
                    resistancemax: resistancemax.value || '',
                    capacity: capacity.value || '',
                    chargecrate: chargecrate.value || '',
                    ...dataNode.value.data };
                df.updateNodeDataFromId(nodeId.value, data);
            }
        }

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;
    
        onMounted(async () => {
            await nextTick()
            nodeId.value = el.value.parentElement.parentElement.id.slice(5)
            dataNode.value = df.getNodeFromId(nodeId.value)

            df.on('nodeDataChanged', setAllParameters);

            itemname.value = dataNode.value.data.itemname;
            itemindex.value = dataNode.value.data.index;

            cType.value = dataNode.value.data.cType;
            amperage.value = dataNode.value.data.amperage;
            voltage.value = dataNode.value.data.voltage;
            wattage.value = dataNode.value.data.wattage;
            resistance.value = dataNode.value.data.resistance;
            resistancemin.value = dataNode.value.data.resistancemin;
            resistancemax.value = dataNode.value.data.resistancemax;
            capacity.value = dataNode.value.data.capacity;
            chargecrate.value = dataNode.value.data.chargecrate;
            
            setAllParameters();
        });
        
        return {
            el, itemname, itemindex, cType, amperage, voltage, wattage, resistance, resistancemin, resistancemax, capacity, chargecrate, consumerTypeOptions, selectConsumerType,
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