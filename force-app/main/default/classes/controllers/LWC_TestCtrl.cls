public with sharing class LWC_TestCtrl {
    public LWC_TestCtrl() {

    }
    @AuraEnabled(cacheable=true)
    public static Student__c getStudentDetails(Id studentId) {
        return [
            SELECT Id, Firstname__c, Lastname__c, StudentCode__c, Gender__c,
                   Birthday__c, TotalCredit__c, GPAScore__c, LearningStatus__c, Class_look__c
            FROM Student__c WHERE Id = :studentId LIMIT 1
        ];
    }


    @AuraEnabled(cacheable=true)
    public static List<Student__c> getStudents() {
        return [SELECT Id, Name, StudentCode__c, FirstName__c, LastName__c FROM Student__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Subject__c> getSubjects() {
        return [SELECT Id, Name, SubjectCode__c, SubjectType__c FROM Subject__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<SubjectScore__c> getSubjectScores() {
        return [SELECT Id, Status__c, AverageScore__c, Student_look__r.Name, Subject_look__r.Name, Semester_look__r.Name 
                FROM SubjectScore__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Semester__c> getSemesters() {
        return [SELECT Id, Name, StartDate__c, EndDate__c FROM Semester__c];
    }
   
    @AuraEnabled(cacheable=true)
    public static List<Score__c> getAllScores() {
        // Query all Score__c records
        List<Score__c> scores = [SELECT Id, Score__c, Name, ExamType__c, SubjectScore_look__c FROM Score__c];
        return scores;
    }
    // @AuraEnabled(cacheable=true)
    // public static List<Semester__c> getAllInformationForStudent(Id studentId) {
    //     if(studentId != null && studentId != ''){
    //         return  [SELECT Id, Name, StartDate__c, EndDate__c, 
    //         (SELECT Id, Status__c, AverageScore__c, 
    //            Student_look__r.Name, Subject_look__r.Name, Semester_look__r.Name,
    //               (SELECT Id,Score__c, Name, ExamType__c, SubjectScore_look__c FROM SBJC_look__r)   
    //             FROM SMT_look__r WHERE Student_look__r.Id = :studentId) 
    //         FROM Semester__c];
    //     }else {
    //         return null;
    //     }
    // }


    @AuraEnabled(cacheable=true)
    public static List<Semester__c> getAllInformationForStudent(Id studentId) {
   
        return [SELECT Id, Name, StartDate__c, EndDate__c, 
                (SELECT Id, Status__c, AverageScore__c, 
                    Student_look__r.Name, Subject_look__r.Name, Semester_look__r.Name,
                    (SELECT Id, Score__c, Name, ExamType__c, SubjectScore_look__c FROM SBJC_look__r)
                FROM SMT_look__r WHERE Student_look__r.Id = :studentId)
                FROM Semester__c];
    }

    @AuraEnabled
    public static void InsertStaticData(){
        try {
            List<Score__c> scoresToInsert = new List<Score__c>();

// Define the SubjectScore record
Id subjectScoreId = 'a05WU00000B8KT6YAN';

// Define exam types with example scores
Map<String, Decimal> examScores = new Map<String, Decimal>{
            '進捗' => 7.5,   // Progress
            '実技' => 8.0,   // Practical
            '中間試験' => 6.5, // Midterm Exam
            '期末試験' => 9.0  // Final Term Exam
        };

        // Create Score__c records
        for (String examType : examScores.keySet()) {
            Score__c scoreRecord = new Score__c(
                SubjectScore_look__c = subjectScoreId,
                ExamType__c = examType,
                Score__c = examScores.get(examType)
            );
            scoresToInsert.add(scoreRecord);
        }

        // Insert the records
        if (!scoresToInsert.isEmpty()) {
            insert scoresToInsert;
            System.debug('Inserted scores successfully: ' + scoresToInsert);
        } else {
            System.debug('No scores to insert.');
        }

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}