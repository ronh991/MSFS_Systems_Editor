<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Generator" :index="itemindex" sysID="1"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemName  size="small"></el-input>
            </el-form-item>
            <div> ====== </div>

            <el-form-item label="Supplier Cfg" label-position="left" size="small" clearable>
                <el-select
                  v-model="supplierCfg"
                  placeholder="Select"
                  style="width: 100%"
                  size="small"
                  clearable
                  df-supplierCfg
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
            <div v-if="supplierCfg == undefined"> =Supplier Data=
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
            <el-form-item label="Wear and Tear" label-position="left">
                <el-input v-model="wearandtear" df-wearandtear size="small" type="textarea" :rows="3"></el-input>
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
        const supplierCfg = ref('');
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
        const wearandtear = ref(0);

        const supplierList = ref([]);

        const sType = ref('AC');

        const helper = new Helper;

        const supplierTypeOptions = readonly([
            'AC',
            'DC',
            'Battery',
        ]);

        const batteryTypeOptions = readonly([
            'NiCd',
            'NiZn',
            'LeadAcid',
            'LithiumIon',
        ]);
       
        const selectSupplierType = () => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        const setSupplierCfgOption = () => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });

        }

        const getSuppliers = (id) => {
            const exportdata = df.export();
            const suppliers = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'SupplierCfg');
            if (suppliers) {
                supplierList.value = suppliers.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
            setAllParameters(id);
        }

        const selectBatteryType = () => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        const setAllParameters = (id) => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                helper.checkmultiselected(dataNode.value.data.supplierCfg, supplierList, supplierCfg, df, nodeId, { supplierCfg: supplierCfg.value, ...dataNode.value.data }, dataNode);
                const data = {
                    ...dataNode.value.data, 
                    itemname: itemname.value || '',
                    supplierCfg: supplierCfg.value || '',
                    vrms: vrms.value || '',
                    phase: phase.value || '',
                    powerrating: powerrating.value || '',
                    powerfactor: powerfactor.value || '',
                    frequency: frequency.value || '',
                    governedrpm: governedrpm.value || '',
                    governedrpmratio: governedrpmratio.value || '',
                    referencefrequency: referencefrequency.value || '',
                    referencerpm: referencerpm.value || '',
                    numberofpoles: numberofpoles.value || '',
                    tensiondroprpm: tensiondroprpm.value || '',
                    batterytype: batterytype.value || '',
                    voltage: voltage.value || '',
                    wearandtear: wearandtear.value || '',
                    sType: sType.value || '',
                };
                df.updateNodeDataFromId(nodeId.value, data);
                }
            }
        }

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;

        onMounted(async () => {
            await nextTick()
            nodeId.value = el.value.parentElement.parentElement.id.slice(5)
            dataNode.value = df.getNodeFromId(nodeId.value)
            
            if (itemname === null) {
               itemname.value = "Generator." + dataNode.value.data.index;  
            } else{
               itemname.value = dataNode.value.data.itemname;   
            }

            df.on('nodeDataChanged', function(id) {nextTick( () => {
                    getSuppliers(id);
                });
            })
            df.on('nodeCreated', function(id) {nextTick( () => {
                    getSuppliers(nodeId.value);
                });
            })
            df.on('nodeRemoved', function(id) {nextTick( () => {
                    getSuppliers(nodeId.value);
                });
            })
            
            itemname.value = dataNode.value.data.itemname;
            itemindex.value = dataNode.value.data.index;

            supplierCfg.value = dataNode.value.data.supplierCfg;
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
            wearandtear.value = dataNode.value.data.wearandtear;

            sType.value = dataNode.value.data.sType;
            getSuppliers(nodeId.value);
        });
        
        return {
            el, itemname, itemindex, supplierCfg, sType, vrms, phase, powerrating, powerfactor, frequency, governedrpm, governedrpmratio, referencefrequency, referencerpm, numberofpoles, tensiondroprpm, batterytype, voltage, wearandtear, supplierTypeOptions, batteryTypeOptions, supplierList,
            selectSupplierType, setSupplierCfgOption, selectBatteryType
        }

    }    
    
})
</script>
