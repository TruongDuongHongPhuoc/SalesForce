public with sharing class B02_CreateSubjectScoreBatch implements Database.Batchable<SObject>, Database.Stateful{
    
    private Datetime startTime;
    private Integer recordsProcessed = 0;
    private Integer recordsFailed = 0;
    
    private List<Semester__c> allSemesters;
    private List<Subject__c> allSubjects;
    private List<String> examTypes = new List<String>{'Progress', 'Practical', 'Midterm_Exam', 'FinalTerm_Exam'};

    public B02_CreateSubjectScoreBatch() {
        this.startTime = System.now();
        allSemesters = [SELECT Id, Name FROM Semester__c];
        allSubjects = [SELECT Id, Name, CourseCredit__c FROM Subject__c];
    }
    
    //get all the score needed to remove
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator(
            'SELECT Id, Name FROM Student__c WHERE LearningStatus__c = \'Enrolled\''
        );
    }

    public void execute(Database.BatchableContext bc, List<Student__c> students) {

        if (students.isEmpty()) return;
        
        // if there is no semester or subject won't execute
        if (allSemesters.isEmpty() || allSubjects.isEmpty()) {
            return;
        }

        List<SubjectScore__c> subjectScoresToInsert = new List<SubjectScore__c>();
        List<Score__c> scoresToInsert = new List<Score__c>();

        for (Student__c student : students) {
            Set<Id> usedSubjects = new Set<Id>();
            Decimal totalCredits = 0;

            //Random Semester
            List<Semester__c> selectedSemesters = new List<Semester__c>();
            while (selectedSemesters.size() < 2) {
                Semester__c randomSemester = allSemesters[Integer.valueOf(Math.floor(Math.random() * allSemesters.size()).intValue())];
                if (!selectedSemesters.contains(randomSemester)) {
                    selectedSemesters.add(randomSemester);
                }
            }
        
            for (Semester__c semester : selectedSemesters) {
                Integer subjectCount = 0;
                while (subjectCount < 5 && totalCredits < 25) {
                    //get random subject
                    Subject__c randomSubject = allSubjects[Integer.valueOf(Math.floor(Math.random() * allSubjects.size()).intValue())];

                    // check if the credit is less than 25
                    if (!usedSubjects.contains(randomSubject.Id) && (totalCredits + randomSubject.CourseCredit__c) <= 25) {
                        usedSubjects.add(randomSubject.Id);
                        totalCredits += randomSubject.CourseCredit__c;
                        subjectCount++;

                        // Create subject score
                        SubjectScore__c newScore = new SubjectScore__c(
                            Student_look__c = student.Id,
                            Subject_look__c = randomSubject.Id,
                            Semester_look__c = semester.Id,
                            AverageScore__c = 0 
                        );
                        subjectScoresToInsert.add(newScore);
                    }
                }
            }
        }

        try {
            insert subjectScoresToInsert;
            recordsProcessed += subjectScoresToInsert.size();

            // ✅ Tạo Score cho mỗi SubjectScore (4 loại điểm: Midterm, Final, Quiz, Assignment)
            for (SubjectScore__c score : subjectScoresToInsert) {
                for (String examType : examTypes) {
                    Score__c newScore = new Score__c(
                        SubjectScore_look__c = score.Id,
                        ExamType__c = examType,
                        Score__c = Math.floor(Math.random() * 10) + 1 // Random 1-10
                    );
                    scoresToInsert.add(newScore);
                }
            }

            insert scoresToInsert;
            recordsProcessed += scoresToInsert.size();

        } catch (Exception e) {
            System.debug('❌ Lỗi khi tạo dữ liệu: ' + e.getMessage());
            recordsFailed += subjectScoresToInsert.size() + scoresToInsert.size();
        }

    } // --> execute

    // ✅ Lưu Batch Log sau khi chạy
    public void finish(Database.BatchableContext bc) {
        Datetime endTime = System.now();
        List<AsyncApexJob> jobs = [SELECT Id, NumberOfErrors FROM AsyncApexJob WHERE Id = :bc.getJobId() LIMIT 1];

        String result = (jobs.isEmpty() || jobs[0].NumberOfErrors > 0) ? 'Error' : 'Success';

        BatchLog__c batchLog = new BatchLog__c(
            Name = 'B02_Subject score creation',
            StartTime__c = startTime,
            EndTime__c = endTime,
            Result__c = result,
            ErrorMessage__c = (result == 'Error') ? 'Batch encountered errors.' : null
        );

        try {
            insert batchLog;
        } catch (Exception e) {
            System.debug('⚠️ Không thể tạo Batch Log: ' + e.getMessage());
        }
    }
} // --> class