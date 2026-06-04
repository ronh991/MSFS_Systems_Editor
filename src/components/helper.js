export default class Helper {
	constructor() {
        //df = getCurrentInstance().appContext.config.globalProperties.$df.value;
    }

    setitemname(itemname, dataNode) {
        if (itemname.value === null || itemname.value === undefined || itemname.value ==='') {
            //return dataNode.value.data.name;
            itemname.value = dataNode.value.data.name;  
        } //else {
            //dataNode.value.data.name = itemname.value;  
        //}
    }

    setparameter(dataNodevalue, paramvalue) {
        if (paramvalue !== undefined)
            dataNodevalue = paramvalue;
    }

    checkmultiselected(dataNodevaluedata, selectList, selectValues, df, nodeId, dataparamobj, dataNode) {
                // check all selected - compare and update names for config export
            if (selectValues.value !== undefined) {
                if (dataNodevaluedata !== undefined && dataNodevaluedata !== "") {
                    selectList.value.forEach((obj) => {
                        let counter = 0;
                        dataNodevaluedata.forEach(element => {
                            if (element.nodeid === obj.nodeid && element.name !== obj.name)
                            {
                                selectValues.value[counter].name = obj.name;
                            }
                            counter++;
                        });
                        //dataNode = selectValues;
                        //const data = { ...dataNode.value.data };
                        df.updateNodeDataFromId(nodeId.value, dataparamobj);
                    });
                    // find any deleted 
                    dataNodevaluedata.forEach(element => {
                        let found = false;
                        selectList.value.forEach((obj) => {
                            if(element.nodeid === obj.nodeid) {
                                found = true;
                            }
                        });
                        if (!found) {
                            let listCounter = 0;
                            selectValues.value.forEach((obj) => {
                                if (obj.nodeid === element.nodeid) {
                                    selectValues.value.splice(listCounter, 1);
                                }
                                listCounter++;
                            })
                        }
                    });
                } else {
                    //selectValues.value = '';
                    df.updateNodeDataFromId(nodeId.value, dataparamobj);
                }
            }
        }

        //not needed dataNodevaluedata is alway undefined - but should be for naming
    checkselected(dataNodevaluedata, selectList, selectValues, df, nodeId, dataparamobj) {
                // check all selected - compare and update names for config export
            // if(dataNodevaluedata === undefined && selectValues.value !== undefined) {
            //    dataNodevaluedata = { name: selectValues.name, index: 1, nodeid: 0 };
            // }
            if (selectValues.value !== undefined) {
                if (dataNodevaluedata !== undefined) {
                    selectList.value.forEach((obj) => {
                        let counter = 0;
                        //dataNode.forEach(element => {
                            if (dataNodevaluedata.nodeid === obj.nodeid && dataNodevaluedata.name !== obj.name)
                            {
                                selectValues.value[counter].name = obj.name;
                            }
                        //    counter++;
                        //});
                        dataNodevaluedata = selectValues;
                        //const data = { oneway: oneWay.value, ...dataNode.value.data };
                        //const data = { paramstr,  ...dataNode.value.data };
                        df.updateNodeDataFromId(nodeId.value, dataparamobj);
                    });
                    // find any deleted 
                    //dataNode.forEach(element => {
                        let found = false;
                        selectList.value.forEach((obj) => {
                            if(dataNodevaluedata.value.nodeid === obj.nodeid) {
                                found = true;
                            }
                        });
                        if (!found) {
                            //let listCounter = 0;
                            //selectValues.value.forEach((obj) => {
                                if (selectValues.nodeid === dataNodevaluedata.nodeid) {
                                    selectValues.value = '';
                                }
                                //listCounter++;
                            //})
                        }
                    //});
                } else {
                    //selectValues.value = '';
                    df.updateNodeDataFromId(nodeId.value, dataparamobj);
                }
            }
        }

    checklinemultiselected(dataNodevaluedata, selectList, selectValues, df, dataparamobj, dataNode) {
                // check all selected - compare and update names for config export
            if (selectValues.value !== undefined) {
                if (dataNodevaluedata !== undefined && dataNodevaluedata !== "") {
                    selectList.value.forEach((obj) => {
                        let counter = 0;
                        dataNodevaluedata.forEach(element => {
                            if (element.nodeid === obj.nodeid && element.name !== obj.name)
                            {
                                selectValues.value[counter].name = obj.name;
                            }
                            counter++;
                        });
                        //dataNode = selectValues;
                        //const data = { ...dataNode.value.data };
                        //df.updateNodeDataFromId(nodeId.value, dataparamobj);
                    });
                    // find any deleted 
                    dataNodevaluedata.forEach(element => {
                        let found = false;
                        selectList.value.forEach((obj) => {
                            if(element.nodeid === obj.nodeid) {
                                found = true;
                            }
                        });
                        if (!found) {
                            let listCounter = 0;
                            selectValues.value.forEach((obj) => {
                                if (obj.nodeid === element.nodeid) {
                                    selectValues.value.splice(listCounter, 1);
                                }
                                listCounter++;
                            })
                        }
                    });
                } //else {
                    //selectValues.value = '';
                    //df.updateNodeDataFromId(nodeId.value, dataparamobj);
                //}
            }
        }

        checkNodeidindfxxx(nodeId, df)
        {
            let found = false;
            Object.entries(df.drawflow.drawflow.Home.data).forEach(([ioKey, ioValue]) => {
                if (ioValue.id.toString() === nodeId) {
                    found = true;
                }
            });

            return found;
        }

}