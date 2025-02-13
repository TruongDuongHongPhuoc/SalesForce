public with sharing class LWC_UpdateStudentCtrl {
    public LWC_UpdateStudentCtrl() {

    }
    @AuraEnabled(cacheable=true)
    public static Student__c getStudentDetails(String studentId) {
        // Fetch the student record based on the studentId
        try {
            return [SELECT Id, Firstname__c, Lastname__c, Gender__c, Birthday__c, Class_look__c, LearningStatus__c 
                    FROM Student__c WHERE Id = :studentId LIMIT 1];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching student details: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static String updateStudent(String studentId, String firstName, String lastName, String gender, Date birthday, String selectedClass, String learningStatus) {
        try {
            Student__c student = [SELECT Id FROM Student__c WHERE Id = :studentId LIMIT 1];
            
            student.FirstName__c = firstName;
            student.LastName__c = lastName;
            student.Gender__c = gender;
            student.Birthday__c = birthday;
            student.Class_look__c = selectedClass;
            student.LearningStatus__c = learningStatus;
            
            update student;
            
            return 'Student record updated successfully!';
        } catch (Exception e) {
            throw new AuraHandledException('Error updating student record: ' + e.getMessage());
        }
    }
}