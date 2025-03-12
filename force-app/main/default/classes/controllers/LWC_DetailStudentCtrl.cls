public with sharing class LWC_DetailStudentCtrl {
    public LWC_DetailStudentCtrl() {

    }
    @AuraEnabled(cacheable=true)
    public static Student__c getStudentDetails(Id studentId) {
        return [
            SELECT Id, Firstname__c, Lastname__c, StudentCode__c, Gender__c,
                   Birthday__c, TotalCredit__c, GPAScore__c, LearningStatus__c, Class_look__c
            FROM Student__c WHERE Id = :studentId LIMIT 1
        ];
    }

    //get data academic student
    @AuraEnabled(cacheable=true)
    public static List<Semester__c> getAllInformationForStudent(Id studentId) {
    try{
         return [SELECT Id, Name, StartDate__c, EndDate__c, // semester
                 (SELECT Id, Status__c, AverageScore__c, // subject score
                     Student_look__r.Name, Subject_look__r.Name,Subject_look__r.SubjectCode__c , Semester_look__r.Name,
                     (SELECT Id, Score__c, Name, ExamType__c, SubjectScore_look__c FROM SBJC_look__r) // score
                 FROM SMT_look__r WHERE Student_look__r.Id = :studentId)
                 FROM Semester__c];
     }catch(Exception ex){
         throw new AuraHandledException('Error retrieve student score information records: ' + ex.getMessage());
     }
    }
}