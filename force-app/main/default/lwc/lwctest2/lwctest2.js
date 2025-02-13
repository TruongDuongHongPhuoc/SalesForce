import { LightningElement,wire,api,track } from 'lwc';
import getAllInformationForStudent from '@salesforce/apex/LWC_TestCtrl.getAllInformationForStudent';
export default class Lwctest2 extends LightningElement {

    @api studentId = 'a00WU00000awLow';
    @track data
    @wire(getAllInformationForStudent,{studentId: '$studentId' }) 
    wireStudentResources({ data, error }) {
        if (data) {
            console.log('Data received:', JSON.stringify(data)); // Successfully received data
            this.data = data;
        } else if (error) {
            console.error('Error occurred: ', error);  // Print the error object

            // You can extract more specific error details if needed:
            if (error.body) {
                console.error('Error body: ', error.body);
            }
            if (error.body.message) {
                console.error('Error message: ', error.body.message); // General error message
            }
            if (error.body.stackTrace) {
                console.error('Stack trace: ', error.body.stackTrace); // Stack trace if available
            }
        }
    }
}