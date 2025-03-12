public with sharing class LWC_ScoreTable {
    public LWC_ScoreTable() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Semester__c> getAllInformationForStudent(Id studentId) {
   try{
        return [SELECT Id, Name, StartDate__c, EndDate__c, // semester
                (SELECT Id, Status__c, AverageScore__c,  // subject scor 
                    Student_look__r.Name, Subject_look__r.Name, Semester_look__r.Name,
                    (SELECT Id, Score__c, Name, ExamType__c, SubjectScore_look__c FROM SBJC_look__r)  //score
                FROM SMT_look__r WHERE Student_look__r.Id = :studentId)
                FROM Semester__c];
    }catch(Exception ex){
        throw new AuraHandledException('Error retrieve student score information records: ' + ex.getMessage());
    }
}

}