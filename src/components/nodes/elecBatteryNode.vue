<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Battery" :index="itemindex" sysID="1"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>

            <el-form-item label="Con Cfg" label-position="left">
                <el-select
                  v-model="consumerCfg"
                  placeholder="Select"
                  style="width: 100%"
                  size="small"
                  clearable
                  df-consumerCfg
                  @change="setConsumerCfgOption"
                  value-key="nodeid"
                >
                  <el-option
                    v-for="item in consumerList"
                    :key="item.index"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
            </el-form-item>

            <div v-if="consumerCfg === undefined"> =Consumer Data=
            <el-form-item label="CType" label-position="left">
                <el-select v-model="cType" df-cType placeholder="Select" size="small" disabled>
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
            <div> ====== </div>

            <el-form-item label="Sup Cfg" label-position="left">
                <el-select
                  v-model="supplierCfg"
                  placeholder="Select"
                  style="width: 100%"
                  clearable
                  df-supplierCfg
                  size="small" 
                  @change="setSupplierCfgOption"
                  value-key="nodeid"
                >
                  <el-option
                    v-for="item in supplierList"
                    :key="item.index"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
            </el-form-item>

            <div v-if="supplierCfg === undefined"> =Supplier Data=
            <el-form-item label="SType" label-position="left">
                <el-select v-model="sType" df-sType placeholder="Select" size="small" disabled>
                </el-select>
            </el-form-item>
            <el-form-item v-if="sType ==='AC'" label="Vrms" label-position="left">
                <el-input v-model="vrms" df-vrms size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="sType ==='AC'" label="Phase" label-position="left">
                <el-input v-model="phase" df-phase size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="sType ==='AC'" label="Power Rating" label-position="left">
                <el-input v-model="powerrating" df-powerrating size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="sType ==='AC'" label="Power Factor" label-position="left">
                <el-input v-model="powerfactor" df-powerfactor size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="sType ==='AC'" label="Freq" label-position="left">
                <el-input v-model="frequency" df-frequency size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="sType ==='AC'" label="Gov RPM" label-position="left">
                <el-input v-model="governedrpm" df-governedrpm size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="sType ==='AC'" label="Gov RPM Ratio" label-position="left">
                <el-input v-model="governedrpmratio" df-governedrpmratio size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="sType ==='AC'" label="Ref Freq" label-position="left">
                <el-input v-model="referencefrequency" df-referencefrequency size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="sType ==='AC'" label="Ref RPM" label-position="left">
                <el-input v-model="referencerpm" df-referencerpm size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="sType ==='AC'" label="Num Poles" label-position="left">
                <el-input v-model="numberofpoles" df-numberofpoles size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="sType ==='AC'" label="Tens Drop RPM" label-position="left">
                <el-input v-model="tensiondroprpm" df-tensiondroprpm size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="sType ==='Battery'" label="Bat Type" label-position="left">
                <el-select v-model="batterytype" df-batterytype @change="selectBatteryType" placeholder="Select" size="small" clearable>
                <el-option
                    v-for="item in batteryTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                />
                </el-select>
            </el-form-item>
            <el-form-item v-if="sType ==='DC'" label="Volt" label-position="left">
                <el-input v-model="voltage" df-voltage size="small"></el-input>
            </el-form-item>
        </div>
            <el-form-item label="Wear & Tear" label-position="left">
                <el-input v-model="wearandtear" df-wearandtear size="small" type="textarea" :rows="3"></el-input>
            </el-form-item>
        </div>
    </el-form>
    </div>
</template>

<script>
import { defineComponent, onMounted, getCurrentInstance, readonly, ref, nextTick, defineEmits } from 'vue'
import nodeHeader from './nodeHeader.vue'
import Helper from '../helper';

export default defineComponent({
    components: {
        nodeHeader
    },
    //props: {
    //    test: Number
    //},
    // emit test
    //emits: ['myEvent'],
    //setup( props, { emit } ) {
    setup( ) {

        const el = ref(null);
        const nodeId = ref(0);
        let df = null
        const dataNode = ref({});
        const itemname = ref('');
        const itemindex = ref('');

        // Data items
        const supplierCfg = ref('');
        const consumerCfg = ref('');
        const amperage = ref(0);
        const wattage = ref(0);
        const resistance = ref(0);
        const resistancemin = ref(0);
        const resistancemax = ref(0);
        const vrms = ref(0);
        const phase = ref(0);
        const powerrating = ref(0);
        const powerfactor = ref(0);
        const frequency = ref(0);
        const governedrpm = ref(0);
        const governedrpmratio = ref(0);
        const referencefrequency = ref(0);
        const referencerpm = ref(0);
        const numberofpoles = ref(0);
        const tensiondroprpm = ref(0);
        const batterytype = ref('');
        const voltage = ref(0);
        const wearandtear = ref('');
        const capacity = ref(0);
        const chargecrate = ref(0);
 
        const consumerList = ref([]);
        const supplierList = ref([]);

        // Consumer
        const cType = ref('Battery');

        const helper = new Helper;
        
        const consumerTypeOptions = readonly([
            'Battery',
            'Custom',
        ]);

        //prop test
        //const intest = props.test;

        // must reapply all data v-models when you update a select elements - or lose it!!
        // 'df-xxxxx' ids need to be lowercase
        const selectConsumerType = () => {
            nextTick( () => {
                setAllParameters();
            });
        }

        const setConsumerCfgOption = () => {
            nextTick( () => {
                setAllParameters();
            });
        }

        const getConsumers = () => {
            const exportdata = df.export();
            const consumers = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'ConsumerCfg');
            if (consumers) {
                consumerList.value = consumers.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
        }

        // Supplier
        const sType = ref('Battery');

        const supplierTypeOptions = readonly([
            'AC',
            'DC',
            'Battery',
        ]);
        
        const selectSupplierType = () => {
            nextTick( () => {
                setAllParameters();
            });
        }

        const setSupplierCfgOption = () => {
            nextTick( () => {
                setAllParameters();
            });
        }

        const getSuppliers = () => {
            const exportdata = df.export();
            const suppliers = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'SupplierCfg');
            if (suppliers) {
                supplierList.value = suppliers.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
        }

        const batteryTypeOptions = readonly([
            'NiCd',
            'NiZn',
            'LeadAcid',
            'LithiumIon',
        ]);

        const getSuppliersandConsumers = () => {
            getConsumers();
            getSuppliers();
            setAllParameters();
        }

        const selectBatteryType = () => {
            nextTick( () => {
                setAllParameters();
            });
        }

        const setAllParameters = () => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                helper.checkmultiselected(dataNode.value.data.consumerCfg, consumerList, consumerCfg, df, nodeId, { consumerCfg: consumerCfg.value, ...dataNode.value.data }, dataNode);
                helper.checkmultiselected(dataNode.value.data.supplierCfg, supplierList, supplierCfg, df, nodeId, { supplierCfg: supplierCfg.value, ...dataNode.value.data }, dataNode);
                const data = {
                    itemname: itemname.value || dataNode.value.data.name,
                    supplierCfg: supplierCfg.value || '',
                    consumerCfg: consumerCfg.value || '',
                    amperage: amperage.value || '',
                    voltage: voltage.value || '',
                    cType: cType.value || '',
                    wattage: wattage.value || '',
                    resistance: resistance.value || '',
                    resistancemin: resistancemin.value || '',
                    resistancemax: resistancemax.value || '',
                    capacity: capacity.value || '',
                    chargecrate: chargecrate.value || '',
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

            df.on('nodeDataChanged', getSuppliersandConsumers)
            df.on('nodeCreated', getSuppliersandConsumers);
            df.on('nodeRemoved', getSuppliersandConsumers);
            
            itemname.value = dataNode.value.data.itemname;
            itemindex.value = dataNode.value.data.index;

            supplierCfg.value = dataNode.value.data.supplierCfg;
            consumerCfg.value = dataNode.value.data.consumerCfg;
            amperage.value = dataNode.value.data.amperage;
            voltage.value = dataNode.value.data.voltage;
            wattage.value = dataNode.value.data.wattage;
            resistance.value = dataNode.value.data.resistance;
            resistancemin.value = dataNode.value.data.resistancemin;
            resistancemax.value = dataNode.value.data.resistancemax;
            capacity.value = dataNode.value.data.capacity;
            chargecrate.value = dataNode.value.data.chargecrate;
            vrms.value = dataNode.value.data.vrms;
            phase.value = dataNode.value.data.phase;
            powerrating.value = dataNode.value.data.powerrating;
            powerfactor.value = dataNode.value.data.powerfactor;
            frequency.value = dataNode.value.data.frequency;
            governedrpm.value = dataNode.value.data.governedrpm;
            governedrpmratio.value = dataNode.value.data.governedrpmratio;
            referencerpm.value = dataNode.value.data.referencerpm;
            referencefrequency.value = dataNode.value.data.referencefrequency;
            numberofpoles.value = dataNode.value.data.numberofpoles;
            tensiondroprpm.value = dataNode.value.data.tensiondroprpm;
            batterytype.value = dataNode.value.data.batterytype;
            wearandtear.value = dataNode.value.data.wearandtear;

            // default to Battery - don't really need all the params
            dataNode.value.data.sType = 'Battery';
            dataNode.value.data.cType = 'Battery';
            sType.value = dataNode.value.data.sType;
            cType.value = dataNode.value.data.cType;

            getSuppliersandConsumers();
        });
        
        return {
            el, itemname, itemindex, supplierCfg, consumerCfg, cType, voltage, amperage, wattage, resistance, resistancemin, resistancemax, sType, vrms, phase, powerrating, powerfactor, frequency, governedrpm, governedrpmratio, 
            referencefrequency, referencerpm, numberofpoles, tensiondroprpm, wearandtear, batterytype, capacity, chargecrate, consumerTypeOptions, supplierTypeOptions, batteryTypeOptions, consumerList, supplierList, 
            selectConsumerType, selectSupplierType, setConsumerCfgOption, setSupplierCfgOption, selectBatteryType
        }

    }    
    
})
</script>
