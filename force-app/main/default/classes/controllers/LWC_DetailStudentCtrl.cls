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
}