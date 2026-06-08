<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Circuit" :index="itemindex" sysID="1"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Cir Type" label-position="left" size="small">
                <el-select
                  v-model="circuittype"
                  placeholder="Select"
                  style="width: 100%"
                  size="small"
                  clearable
                  filterable
                  df-circuittype
                  @change="setCircuitTypeOption"
                >
                  <el-option
                    v-for="item in circuitTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
            </el-form-item>

            <el-form-item label="Con Cfg" label-position="left" size="small">
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

            <div v-if="consumerCfg === undefined ">=Consumer Data=
                <el-form-item label="CType" label-position="left" size="small">
                    <el-select v-model="cType" @change="setConsumerTypeOption" df-cType placeholder="Select" size="small" clearable filterable>
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
        const amperage = ref();
        const voltage = ref();
        const wattage = ref();
        const resistance = ref();
        const resistancemin = ref();
        const resistancemax = ref();
        const circuittype = ref();
        const wearandtear = ref('');
        const capacity = ref();
        const chargecrate = ref();

        const consumerCfg = ref('');
        const consumerList = ref([]);

        const cType = ref();

        const helper = new Helper;

        const circuitTypeOptions = readonly([
            'CIRCUIT_INVALID',
            'CIRCUIT_XML',
            'CIRCUIT_GENERAL_PANEL',
            'CIRCUIT_FLAP_MOTOR',
            'CIRCUIT_GEAR_MOTOR',
            'CIRCUIT_AUTOPILOT',
            'CIRCUIT_AVIONICS',
            'CIRCUIT_PITOT_HEAT',
            'CIRCUIT_PROP_SYNC',
            'CIRCUIT_AUTO_FEATHER',
            'CIRCUIT_AUTO_BRAKES',
            'CIRCUIT_STANDBY_VACUUM',
            'CIRCUIT_MARKER_BEACON',
            'CIRCUIT_GEAR_WARNING',
            'CIRCUIT_HYDRAULIC_PUMP',
            'CIRCUIT_HYDRAULIC_VALVE',
            'CIRCUIT_FUEL_PUMP',
            'CIRCUIT_FUEL_TRANSFER_PUMP',
            'CIRCUIT_PROP_DEICE',
            'CIRCUIT_STARTER',
            'CIRCUIT_LIGHT_NAV',
            'CIRCUIT_LIGHT_BEACON',
            'CIRCUIT_LIGHT_LANDING',
            'CIRCUIT_LIGHT_TAXI',
            'CIRCUIT_LIGHT_STROBE',
            'CIRCUIT_LIGHT_PANEL',
            'CIRCUIT_LIGHT_RECOGNITION',
            'CIRCUIT_LIGHT_WING',
            'CIRCUIT_LIGHT_LOGO',
            'CIRCUIT_LIGHT_CABIN',
            'CIRCUIT_LIGHT_PEDESTAL',
            'CIRCUIT_LIGHT_GLARESHIELD',
            'CIRCUIT_DIRECTIONAL_GYRO',
            'CIRCUIT_DIRECTIONAL_GYRO_SLAVING',
            'CIRCUIT_NAV',
            'CIRCUIT_COM',
            'CIRCUIT_PFD_NU',
            'CIRCUIT_MFD_NU',
            'CIRCUIT_ADC_AHRS_NU',
            'CIRCUIT_FIS_NU',
            'CIRCUIT_ADF_DME_NU',
            'CIRCUIT_XPNDR',
            'CIRCUIT_TURN_COORDINATOR',
            'CIRCUIT_AUDIO',
            'CIRCUIT_AVNFAN_NU',
            'CIRCUIT_GPS',
            'CIRCUIT_INST_NU',
            'CIRCUIT_INST_LIGHTS_NU',
            'CIRCUIT_ALTFLD_NU',
            'CIRCUIT_WARN_NU',
            'CIRCUIT_LTS_PWR_NU',
            'CIRCUIT_ATTITUDE_INDICATOR',
            'CIRCUIT_STALL_WARNING',
            'CIRCUIT_APU_STARTER',
            'CIRCUIT_FUEL_VALVE',
            'CIRCUIT_WING_FOLD',
            'CIRCUIT_ELECTRIC_ENGINE',
            'CIRCUIT_PNEUMATICS_VALVE',
            'CIRCUIT_PNEUMATICS_PACK',
            'CIRCUIT_CABIN_SIGNAL_GO',
            'CIRCUIT_CABIN_SIGNAL_STANDBY',
            'CIRCUIT_CABIN_SIGNAL_STOP',
            'CIRCUIT_LIQUID_DROPPING_DOOR',
            'CIRCUIT_LIQUID_DROPPING_SCOOP_NU',
            'CIRCUIT_ROTOR_BRAKE',
            'CIRCUIT_HOIST',
            'CIRCUIT_SLING',
            'CIRCUIT_PNEUMATICS_FAN',
            'CIRCUIT_ROTOR_CLUTCH_NU',
            'CIRCUIT_INTERACTIVE_POINT_NU',
            'CIRCUIT_DEICE',            
        ])
        
        const consumerTypeOptions = readonly([
            'Battery',
            'Custom',
        ]);

        const setCircuitTypeOption = () => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        const setConsumerTypeOption = () => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        const setConsumerCfgOption = () => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        const getConsumers = (id) => {
            const exportdata = df.export();
            const consumers = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'ConsumerCfg');
            if (consumers) {
                consumerList.value = consumers.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
            setAllParameters(id);
        }

        const setAllParameters = (id) => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                helper.checkmultiselected(dataNode.value.data.consumerCfg, consumerList, consumerCfg, df, nodeId, { consumerCfg: consumerCfg.value, ...dataNode.value.data }, dataNode);
                const data = {
                    ...dataNode.value.data, 
                    itemname: itemname.value || '',
                    consumerCfg: consumerCfg.value || '',
                    circuittype: circuittype.value || '',
                    amperage: amperage.value || '',
                    voltage: voltage.value || '',
                    cType: cType.value || '',
                    wattage: wattage.value || '',
                    resistance: resistance.value || '',
                    resistancemin: resistancemin.value || '',
                    resistancemax: resistancemax.value || '',
                    capacity: capacity.value || '',
                    chargecrate: chargecrate.value || '',
                    wearandtear: wearandtear.value || '',
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

            df.on('nodeDataChanged', function(id) {nextTick( () => {
                    getConsumers(id);
                });
            })
            df.on('nodeCreated', function(id) {nextTick( () => {
                    getConsumers(nodeId.value);
                });
            })
            df.on('nodeRemoved', function(id) {nextTick( () => {
                    getConsumers(nodeId.value);
                });
            })

            itemname.value = dataNode.value.data.itemname;
            itemindex.value = dataNode.value.data.index;
            
            consumerCfg.value = dataNode.value.data.consumerCfg;
            circuittype.value = dataNode.value.data.circuittype;
            cType.value = dataNode.value.data.cType;
            amperage.value = dataNode.value.data.amperage;
            voltage.value = dataNode.value.data.voltage;
            wattage.value = dataNode.value.data.wattage;
            resistance.value = dataNode.value.data.resistance;
            resistancemin.value = dataNode.value.data.resistancemin;
            resistancemax.value = dataNode.value.data.resistancemax;
            wearandtear.value = dataNode.value.data.wearandtear;
            capacity.value = dataNode.value.data.capacity;
            chargecrate.value = dataNode.value.data.chargecrate;

            getConsumers(nodeId.value);
        });
        
        return {
            el, itemname, itemindex, circuittype, consumerCfg, cType, amperage, voltage, wattage, resistance, resistancemin, resistancemax, wearandtear, capacity, chargecrate, consumerList, circuitTypeOptions, consumerTypeOptions,
            setConsumerCfgOption, setConsumerTypeOption, setCircuitTypeOption
        }

    }    
    
})
</script>
