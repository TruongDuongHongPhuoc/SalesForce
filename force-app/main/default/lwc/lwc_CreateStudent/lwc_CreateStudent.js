import { LightningElement, api, track, wire } from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';


import getGenderOptions from '@salesforce/apex/LWC_CreateStudentCtrl.getGenderOptions';
import getClassOptions from '@salesforce/apex/LWC_CreateStudentCtrl.getClassOptions';
import getLearningStatusOptions from '@salesforce/apex/LWC_CreateStudentCtrl.getLearningStatusOptions';
import createStudent from '@salesforce/apex/LWC_CreateStudentCtrl.createStudent';
export default class Lwc_CreateStudent extends LightningElement {

    @track firstName = '';
    @track lastName = '';
    @track birthday ='';
    @track gender = '';
    @track selectedClass = '';
    @track learningStatus = '';
    
    @track genderOptions = [];
    @track classOptions = [];
    @track learningStatusOptions = [];

    @wire(getGenderOptions)
    wiredGenderOptions({ error, data }) {

        if (data) {
            console.log('Raw Gender Options:', JSON.stringify(data)); // Debug dữ liệu
            this.genderOptions = data.map(item => ({
                label: item.picklistLabel, // Đảm bảo có label
                value: item.pickListValue  // Đảm bảo có value
            }));
            console.log('Formatted Gender Options:', JSON.stringify(this.genderOptions));
        } else if (error) {
            console.error("Error fetching gender options:", error);
        }
    }

    @wire(getClassOptions)
    wiredClassOptions({ error, data }) {
        if (data) {
            console.log('Raw Class Options:', JSON.stringify(data)); // Debug dữ liệu
            this.classOptions = data.map(item => ({
                label: item.picklistLabel, // Đảm bảo có label
                value: item.pickListValue  // Đảm bảo có value
            }));
            console.log('Formatted Class Options:', JSON.stringify(this.classOptions));
        } else if (error) {
            console.error("Error fetching Class options:", error);
        }
    }

    @wire(getLearningStatusOptions)
    wiredLearningStatusOptions({ error, data }) {
        if (data) {
            console.log('Raw learning status Options:', JSON.stringify(data)); // Debug dữ liệu
            this.learningStatusOptions = data.map(item => ({
                label: item.picklistLabel, // Đảm bảo có label
                value: item.pickListValue  // Đảm bảo có value
            }));
            console.log('Formatted learning status Options:', JSON.stringify(this.learningStatusOptions));
        } else if (error) {
            console.error("Error fetching learning status options:", error);
        }
    }

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.value;
    }

    
    handleSave() {
        if (!this.firstName || !this.lastName || !this.gender || !this.selectedClass || !this.learningStatus) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please fill all required fields.',
                    variant: 'error'
                })
            );
            return;
        }
    
        createStudent({
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
            birthday: this.birthday,
            learningStatus: this.learningStatus,
            selectedClass: this.selectedClass
        })
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Student record created successfully!',
                    variant: 'success'
                })
            );
            this.sendCloseMessageEvent(); // close modal
        })
        .catch(error => {
            console.error('Error:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body ? error.body.message : 'An error occurred.',
                    variant: 'error'
                })
            );
        });
    }

    // close message to parent (search page)
    sendCloseMessageEvent() {
        const message = 'Hello Parent, I am your Child!';

        // Create a custom event
        const event = new CustomEvent('childmessage', {
            detail: message, // Pass data inside detail
            bubbles: true, // Allow event to bubble up
            composed: true // Allow crossing Shadow DOM
        });

        // dispatch the event
        this.dispatchEvent(event);

        // Stop event from bubbling further
        event.stopPropagation();
    }
}