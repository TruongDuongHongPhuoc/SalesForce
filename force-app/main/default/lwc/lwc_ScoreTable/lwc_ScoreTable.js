import { LightningElement, track,api,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAllInformationForStudent from '@salesforce/apex/LWC_DetailStudentCtrl.getAllInformationForStudent';
import addStaticData from '@salesforce/apex/LWC_TestCtrl.InsertStaticData';

export default class Lwc_ScoreTable extends LightningElement {
    @track semesters = [];
    @track displayedSemesters = []; // Filtered list to show
    @track selectedSemester = '';
    @track semesterOptions = [];
    @track overallAverage = 0;
    @track viewMore = 1;
    @api studentId = 'a00WU00000awLow'

    get isDisableViewMore() {
        console.log("isDisableViewMore triggered");
        
        // if(this.selectedSemester === ''){
        //     return false;
        // }else if (this.displayedSemesters.length >= this.semesters.length) {
        //     return false; 
        // } else {
        //     return true;
        // }

        if(this.displayedSemesters.length >= this.semesters.length || this.selectedSemester != ''){
            return true;
        }else{
            return false;
        }
    }
    
    async addStaticData() {
        try {
            const result = await addStaticData();
            console.log('Insert successful: ', result);

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Static data inserted successfully!',
                    variant: 'success'
                })
            );
        } catch (error) {
            console.error('Error inserting static data: ', error);

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Failed to insert static data.',
                    variant: 'error'
                })
            );
        }
    }

    @wire(getAllInformationForStudent, { studentId: '$studentId' })
    wiredData({ data, error }) {
        if (data) {
            console.log('Data received:', JSON.stringify(data));
            this.processData(data);
        } else if (error) {
            console.error('Error retrieving data:', error);
        }
    }

    processData(data) {
        let allSemesters = [];
        let totalScore = 0;
        let totalSubjects = 0;
    
        data.forEach((semester) => {
            let subjectScores = [];
            let semesterTotal = 0;
            let semesterSubjects = 0;
            let subjectScoreTotal = 0; // Sum of all subjects' average scores
    
            if (semester.SMT_look__r) {
                semester.SMT_look__r.forEach((subjectScore) => {
                    let scores = {
                        Progress: null,
                        Practical: null,
                        Midterm: null,
                        Final: null
                    };
    
                    let scoreCount = 0;
                    let scoreSum = 0;
    
                    if (subjectScore.SBJC_look__r) {
                        subjectScore.SBJC_look__r.forEach((score) => {
                            let scoreValue = parseFloat(score.Score__c);
                            if (!isNaN(scoreValue)) {
                                switch (score.ExamType__c) {
                                    case '進捗':
                                        scores.Progress = scoreValue;
                                        break;
                                    case '実技':
                                        scores.Practical = scoreValue;
                                        break;
                                    case '中間試験':
                                        scores.Midterm = scoreValue;
                                        break;
                                    case '期末試験':
                                        scores.Final = scoreValue;
                                        break;
                                }
                                scoreSum += scoreValue;
                                scoreCount = 3;
                            }
                        });
                    }
    
                    scores.average_score = scoreCount > 0 ? (scoreSum / scoreCount).toFixed(2) : '-';
    
                    subjectScores.push({
                        Id: subjectScore.Id,
                        SubjectCode__c: subjectScore.SubjectCode__c ,
                        Subject_look__r: subjectScore.Subject_look__r,
                        AverageScore__c: subjectScore.AverageScore__c,
                        scores: scores,
                        isPass: subjectScore.AverageScore__c < 5
                    });
    
                    // Add subject average score to total
                    let avgScore = parseFloat(scores.average_score);
                    if (!isNaN(avgScore)) {
                        subjectScoreTotal += avgScore;
                        semesterSubjects++;
                    }

                    semesterTotal += parseFloat(scores.average_score) || 0;
                });
            }
    
            allSemesters.push({
                Id: semester.Id,
                Name: semester.Name,
                StartDate__c: semester.StartDate__c,
                EndDate__c: semester.EndDate__c,
                SubjectScores: subjectScores,
                AverageSubjectsScores: semesterSubjects > 0 ? (subjectScoreTotal / semesterSubjects).toFixed(2) : '-', // <-- This is what you need
                average: semesterSubjects ? (semesterTotal / semesterSubjects).toFixed(2) : '-',
                isPass: (semesterSubjects > 0 ? (subjectScoreTotal / semesterSubjects) : 0) > 4,
            });
    
            totalScore += semesterTotal;
            totalSubjects += semesterSubjects;
        });
    
        this.semesters = allSemesters;
        // this.displayedSemesters = allSemesters;  // Show all by default
        this.displayedSemesters = allSemesters.slice(0,3);
        this.overallAverage = totalSubjects ? (totalScore / totalSubjects).toFixed(2) : '-';
    
        this.semesterOptions = [{ label: '全て', value: '' }].concat(
            allSemesters.map((sem) => ({ label: sem.Name, value: sem.Id }))
        );
    }
    

    handleSemesterChange(event) {
        this.selectedSemester = event.detail.value;
        if (this.selectedSemester === '') {
            this.displayedSemesters = this.semesters.slice(0,3);  // Show all if "全て" is selected
        } else {
            this.displayedSemesters = this.semesters.filter(
                (sem) => sem.Id === this.selectedSemester
            );
        }
    }
    viewMoreHandler(event) {
        if (this.displayedSemesters.length >= this.semesters.length) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'There are no more semesters to display.',
                    variant: 'error'
                })
            );
            this.isDisableViewMore = false;
        } else {
            // Determine how many more semesters we can add (up to 3)
            let remaining = this.semesters.length - this.displayedSemesters.length;
            let countToAdd = Math.min(3, remaining);
    
            // Add the next 3 semesters (or fewer if there aren't 3 left)
            this.displayedSemesters = [
                ...this.displayedSemesters, 
                ...this.semesters.slice(this.displayedSemesters.length, this.displayedSemesters.length + countToAdd)
            ];
        }
    }
    
}