import { LightningElement, api, track, wire } from 'lwc';
import getStudentDetails from '@salesforce/apex/LWC_TestCtrl.getStudentDetails';
import getStudents from '@salesforce/apex/LWC_TestCtrl.getStudents';
import getSubjects from '@salesforce/apex/LWC_TestCtrl.getSubjects';
import getSubjectScores from '@salesforce/apex/LWC_TestCtrl.getSubjectScores';
import getSemesters from '@salesforce/apex/LWC_TestCtrl.getSemesters';
import getAllScores from '@salesforce/apex/LWC_TestCtrl.getAllScores';
import getAllInformationForStudent from '@salesforce/apex/LWC_TestCtrl.getAllInformationForStudent';



export default class FirstLightinningComponentWeb extends LightningElement {
    students;
    subjects;
    subjectScores;
    semesters;
    scores;
    @api studentId = 'a00WU00000V8KMI';
    @wire(getAllInformationForStudent,{studentId: '$studentId' }) 
wireStudentResources({ data, error }) {
    if (data) {
        console.log('Data received:', JSON.stringify(data)); // Successfully received data
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


    @wire(getAllScores)
    wiredScores({ data, error }) {
        if (data) {
            this.scores = data;  // Store the scores data
        } else if (error) {
            console.error('Error retrieving scores:', error);
        }
    }
    @wire(getStudents)
    wiredStudents({ error, data }) {
        if (data) {
            this.students = data;
        } else if (error) {
            console.error('Error fetching students:', error);
        }
    }

    @wire(getSubjects)
    wiredSubjects({ error, data }) {
        if (data) {
            this.subjects = data;
        } else if (error) {
            console.error('Error fetching subjects:', error);
        }
    }

    @wire(getSubjectScores)
    wiredSubjectScores({ error, data }) {
        if (data) {
            this.subjectScores = data;
        } else if (error) {
            console.error('Error fetching subject scores:', error);
        }
    }

    @wire(getSemesters)
    wiredSemesters({ error, data }) {
        if (data) {
            this.semesters = data;
        } else if (error) {
            console.error('Error fetching semesters:', error);
        }
    }

}