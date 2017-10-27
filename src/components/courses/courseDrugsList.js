import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { H1 } from 'nachos-ui';
import Icon from 'react-native-vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';
import DatePicker from 'react-native-datepicker'



import ListItem from './../shared/listItem'
import { courseDrugsListStyles as styles } from './../../styles'

export default class CourseDrugsList extends Component {
  constructor(props) {
    super(props);
    const { name, finished, startedAt, medicineList} = this.props.courseItem;
    // const { icon, color, definition } = this.defineStatus(finished, startedAt)
    // const { height, width } = Dimensions.get('window');
    this.state = {
      name,
      finished,
      startedAt,
      medicineList,
      openedDrug: null
      // icon,
      // color,
      // definition,
      // height,
      // width
    }
  }

  defineStatus(finished, startedAt){
    if (finished) {
      return {icon: 'ios-checkbox-outline', color: '#00CC00', definition: 'finished'}
    } else {
      if (startedAt == 'null') {
        return {icon: 'ios-close', color: '#CCCCCC', definition: 'pending'}
      }
      return {icon: 'ios-walk', color: '#0000CC', definition: 'in progress'}
    }
  }

  getDrugsList(){
    return this.props.courseItem.medicineList.map((drug, index)=>
      <View key={index}>
        <ListItem
          leftIcon="ios-medkit-outline"
          iconSize={30}
          leftIconColor="#0000CC"
          text={drug.medication.charAt(0).toUpperCase() + drug.medication.slice(1)}
          onPress={()=>{
            if (this.state.openedDrug == index) {
              this.setState({openedDrug: null})
            } else {
              this.setState({openedDrug: index})
            }
          }}/>
        <Collapsible collapsed={this.state.openedDrug == index ? false : true}>
          {this.getAdmissions(drug.admissions)}
        </Collapsible>
      </View>)
  }

  getAdmissions(admissions){
    return admissions.map((admission, index) =>
      <DatePicker
        key={index}
        style={{width: 200}}
        date={admission}
        mode="time"
        placeholder="Select time"
        format="HH-mm-ss"
        showIcon={false}
        is24Hour={true}
        // minDate="2016-05-01"
        // maxDate="2016-06-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            borderRightWidth: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
            backgroundColor: '#99CC33',
            alignItems: 'flex-start',
            alignSelf: 'stretch',
          },
          dateText: {
            borderRadius: 0,
            color: '#FF0000'
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => console.log(date)}
      />
    )
  }

  render(){
    return(
      <View style={styles.container}>
        <H1 style={{color: '#000000'}}>Drugs</H1>
        {this.getDrugsList()}
      </View>
    )
  }
}
