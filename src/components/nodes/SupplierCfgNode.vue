<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="SupplierCfg" :index="itemindex" sysID="1"/>
      <el-form
        label-width="auto"
      >
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname size="small"></el-input>
            </el-form-item>
            <el-form-item label="SType" label-position="left">
                <el-select v-model="sType" @change="selectSupplierType" placeholder="Select" size="small" clearable>
                  <el-option
                    v-for="item in supplierTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
            </el-form-item>
            <div v-if="sType === 'AC' || sType === undefined">
                <el-form-item label="Vrms" label-position="left">
                    <el-input v-model="vrms" df-vrms size="small"></el-input>
                </el-form-item>
                <el-form-item label="Phase" label-position="left">
                    <el-input v-model="phase" df-phase size="small"></el-input>
                </el-form-item>
                <el-form-item label="Power Rating" label-position="left">
                    <el-input v-model="powerrating" df-powerrating size="small"></el-input>
                </el-form-item>
                <el-form-item label="Power Factor" label-position="left">
                    <el-input v-model="powerfactor" df-powerfactor size="small"></el-input>
                </el-form-item>
                <el-form-item label="Frequency" label-position="left">
                    <el-input v-model="frequency" df-frequency size="small"></el-input>
                </el-form-item>
                <el-form-item label="Gov RPM" label-position="left">
                    <el-input v-model="governedrpm" df-governedrpm size="small"></el-input>
                </el-form-item>
                <el-form-item label="Gov RPM Ratio" label-position="left">
                    <el-input v-model="governedrpmratio" df-governedrpmratio size="small"></el-input>
                </el-form-item>
                <el-form-item label="Ref RPM" label-position="left">
                    <el-input v-model="referencerpm" df-referencerpm size="small"></el-input>
                </el-form-item>
                <el-form-item label="Ref Frequency" label-position="left">
                    <el-input v-model="referencefrequency" df-referencefrequency size="small"></el-input>
                </el-form-item>
                <el-form-item label="Num Poles" label-position="left">
                    <el-input v-model="numberofpoles" df-numberofpoles size="small"></el-input>
                </el-form-item>
                <el-form-item label="Tens Drop RPM" label-position="left">
                    <el-input v-model="tensiondroprpm" df-tensiondroprpm size="small"></el-input>
                </el-form-item>
            </div>
            <div v-if="sType === 'Battery'">
                <el-form-item label="Bat Type" label-position="left">
                    <el-select v-model="batterytype" df-batterytype @change="selectBatteryType" placeholder="Select" size="small" clearable>
                    <el-option
                        v-for="item in batteryTypeOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                    />
                    </el-select>
                </el-form-item>
            </div>
            <div v-if="sType === 'DC'">
                <el-form-item label="Voltage" label-position="left">
                    <el-input v-model="voltage" df-voltage size="small"></el-input>
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
        const vrms = ref();
        const phase = ref();
        const powerrating = ref();
        const powerfactor = ref();
        const frequency = ref();
        const governedrpm = ref();
        const governedrpmratio = ref();
        const referencefrequency = ref();
        const referencerpm = ref();
        const numberofpoles = ref();
        const tensiondroprpm = ref();
        const batterytype = ref('');
        const voltage = ref();

        const sType = ref();

        const supplierTypeOptions = readonly([
            'AC',
            'DC',
            'Battery',
        ]);
        
        const selectSupplierType = () => {
            nextTick( () => {
                dataNode.value.data.sType = sType;
                const data = { ...dataNode.value.data };
                df.updateNodeDataFromId(nodeId.value, data);
            });
        }

        const batteryTypeOptions = readonly([
            'NiCd',
            'NiZn',
            'LeadAcid',
            'LithiumIon',
        ]);

        const selectBatteryType = () => {
            nextTick( () => {
                setAllParameters();
            });
        }

        const setAllParameters = () => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                const data = {
                    itemname: itemname.value || '',
                    vrms: vrms.value || '',
                    phase: phase.value || '',
                    powerrating: powerrating.value || '',
                    powerfactor: powerfactor.value || '',
                    frequency: frequency.value || '',
                    governedrpm: governedrpm.value || '',
                    governedrpmratio: governedrpmratio.value || '',
                    referencerpm: referencerpm.value || '',
                    referencefrequency: referencefrequency.value || '',
                    numberofpoles: numberofpoles.value || '',
                    tensiondroprpm: tensiondroprpm.value || '',
                    batterytype: batterytype.value || '',
                    sType: sType.value || '',
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

            sType.value = dataNode.value.data.sType;
            vrms.value = dataNode.value.data.vrms;
            phase.value = dataNode.value.data.phase;
            powerrating.value = dataNode.value.data.powerrating;
            powerfactor.value = dataNode.value.data.powerfactor;
            frequency.value = dataNode.value.data.frequency;
            governedrpm.value = dataNode.value.data.governedrpm;
            governedrpmratio.value = dataNode.value.data.governedrpmratio;
            referencefrequency.value = dataNode.value.data.referencefrequency;
            referencerpm.value = dataNode.value.data.referencerpm;
            numberofpoles.value = dataNode.value.data.numberofpoles;
            tensiondroprpm.value = dataNode.value.data.tensiondroprpm;
            batterytype.value = dataNode.value.data.batterytype;
            voltage.value = dataNode.value.data.voltage;
            
            setAllParameters();
        });
        
        return {
            el, itemname, itemindex, sType, vrms, phase, powerrating, powerfactor, frequency, governedrpm, governedrpmratio, referencefrequency, referencerpm, numberofpoles, tensiondroprpm, batterytype, voltage, supplierTypeOptions, batteryTypeOptions, selectSupplierType, selectBatteryType
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