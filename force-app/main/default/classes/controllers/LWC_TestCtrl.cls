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

}