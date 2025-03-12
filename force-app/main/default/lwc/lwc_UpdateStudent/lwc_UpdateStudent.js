import { LightningElement, wire, api,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getGenderOptions from '@salesforce/apex/LWC_CreateStudentCtrl.getGenderOptions';
import getClassOptions from '@salesforce/apex/LWC_CreateStudentCtrl.getClassOptions';
import getLearningStatusOptions from '@salesforce/apex/LWC_CreateStudentCtrl.getLearningStatusOptions';
import updateStudent from '@salesforce/apex/LWC_UpdateStudentCtrl.updateStudent';
import getStudentDetails from '@salesforce/apex/LWC_UpdateStudentCtrl.getStudentDetails';
export default class Lwc_UpdateStudent extends LightningElement {
    @api studentId ='a00WU00000V8KMIYA3';
    @track firstName = '';
    @track lastName = '';
    @track birthday = '';
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

        handleUpdate() {
            if (!this.studentId || !this.firstName || !this.lastName || !this.gender || !this.selectedClass || !this.learningStatus) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Please fill in all required fields.',
                        variant: 'error'
                    })
                );
                return;
            }
    
            updateStudent({
                studentId: this.studentId,
                firstName: this.firstName,
                lastName: this.lastName,
                gender: this.gender,
                birthday: this.birthday,
                selectedClass: this.selectedClass,
                learningStatus: this.learningStatus
            })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Student record updated successfully!',
                        variant: 'success'
                    })
                );
                this.sendCloseMessageEvent();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Error updating student record: ' + error.body.message,
                        variant: 'error'
                    })
                );
            });
        }
        // Fetch Student Details
    @wire(getStudentDetails, { studentId: '$studentId' })
    wiredStudent({ error, data }) {
        if (data) {
            console.log('Fetched student:', JSON.stringify(data)); // Debug

            this.firstName = data.Firstname__c;
            this.lastName = data.Lastname__c;
            this.gender = data.Gender__c;
            this.birthday = data.Birthday__c;
            this.selectedClass = data.Class_look__c;
            this.learningStatus = data.LearningStatus__c;
        } else if (error) {
            console.error('Error fetching student:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Failed to fetch student details',
                    variant: 'error'
                })
            );
        }
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

        // Dispatch the event
        this.dispatchEvent(event);

        event.stopPropagation();
    }
}