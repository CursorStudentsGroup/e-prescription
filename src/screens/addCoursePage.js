import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput } from 'react-native';
import { H1, Button } from 'nachos-ui';

import ListItem from './../components/shared/listItem'
import { app } from './../feathers'
import { addCoursePageStyles as styles } from './../styles';

export default class AddCourse extends Component<{}> {
  constructor(){
    super();
    this.state = {
      courseName: '',
      courseDuration: 0,
      drugs: [],
      plainDrugsList: []
    }
  }

  applySavedDrug(drug){
    const plainDrugsList = this.state.plainDrugsList.concat(drug)
    const drugs = this.state.drugs.concat(
    <ListItem
      leftIcon="ios-medkit-outline"
      iconSize={30}
      leftIconColor="#0000CC"
      text={drug.drugName.charAt(0).toUpperCase() + drug.drugName.slice(1)}
      onPress={()=>console.log(drug)}
      key={drug.drugName}
    />);
    this.setState({drugs, plainDrugsList})
  }

  isFormValid(){
    return !(this.state.courseName.length &&
           this.state.courseDuration &&
           this.state.drugs.length);
  }

  saveCourse(){
    app.service('users').update(app.get('user')._id, {
      $push: { courses: {
          "finished" : false,
          "name" : this.state.courseName,
          "duration" : this.state.courseDuration,
          "startedAt" : "null",
          "medicineList" : this.generateMedList(this.state.plainDrugsList)
      } }
    }).then(() => {
      this.props.navigator.pop({
        animated: true, // does the pop have transition animation or does it happen immediately (optional)
      });
    });
  }

  generateMedList(list){
    const generated = list.map((medication) => {
        return {
          "medication" : medication.drugName,
          "instructions" : medication.instructions || '',
          "doctorComment" : '',
          "admissions" : medication.admissions,
          "fromDay" : 0,
          "duration" : 3
        }
      }
    )
    return generated;
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Course name"
          autoCorrect={false}
          style={styles.nameInput}
          onChangeText={(courseName)=>this.setState({courseName})}/>
        <TextInput
          placeholder="Duration"
          keyboardType='decimal-pad'
          style={styles.durationInput}
          onChangeText={(courseDuration)=>this.setState({courseDuration})}/>
        <H1 style={{color: '#000000'}}>Drugs</H1>

        {this.state.drugs}
        <ListItem
          leftIcon="ios-add-circle-outline"
          iconSize={30}
          leftIconColor="#0000CC"
          text='Add drug'
          onPress={()=>this.props.navigator.showModal({
            screen: "epres.addDrugPage", // unique ID registered with Navigation.registerScreen
            title: "Modal", // title of the screen as appears in the nav bar (optional)
            passProps: {applySavedDrug: this.applySavedDrug.bind(this) }, // simple serializable object that will pass as props to the modal (optional)
            navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
            animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
          })}/>

          <Button
            kind='squared'
            type='success'
            disabled={this.isFormValid()}
            onPress={()=>this.saveCourse()}>
            Save Course
          </Button>
      </View>
    );
  }
}

AddCourse.propTypes = {
  navigator: PropTypes.object,
}
