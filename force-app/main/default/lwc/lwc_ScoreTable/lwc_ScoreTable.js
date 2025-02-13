import { LightningElement } from 'lwc';

export default class Lwc_ScoreTable extends LightningElement {
    semesters = [
        {
            id: 2,
            year: '2023 - 2024',
            average: '5.26',
            courses: [
                { code: 'IT010', name: 'Project Management', credits: 4, attendance: 10, practical: 4, midterm: 3, final: 3, average: 3.80 },
                { code: 'IT013', name: 'Multimedia Communication', credits: 2, attendance: 8, practical: 3, midterm: 6, final: 5, average: 5.20 },
                { code: 'PH002', name: 'General Physics', credits: 2, attendance: 3, practical: 2, midterm: 8, final: 10, average: 5.30 },
                { code: 'IT014', name: 'Distributed Systems', credits: 2, attendance: 10, practical: 4, midterm: 6, final: 8, average: 8.20 },
            ],
        },
        {
            id: 1,
            year: '2023 - 2024',
            average: '5.26',
            courses: [
                { code: 'IT006', name: 'Operating Systems', credits: 3, attendance: 9, practical: 3, midterm: 3, final: 3, average: 3.60 },
            ],
        },
    ];
}