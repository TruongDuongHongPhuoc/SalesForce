public with sharing class CMP_UpdateStudentCtrl {
    @AuraEnabled
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

    @AuraEnabled
    public static List<picklistWrapper> getGenderOptions() {
        List<picklistWrapper> options = new List<picklistWrapper>();
        
        // Add a default "None" option
        options.add(new picklistWrapper('--なし--', ''));

        // Retrieve picklist values for Gender__c
        Schema.DescribeFieldResult fieldResult = Student__c.Gender__c.getDescribe();
        List<Schema.PicklistEntry> picklistValues = fieldResult.getPicklistValues();
    
        // Loop through picklist values and add to the list
        for (Schema.PicklistEntry value : picklistValues) {
            options.add(new picklistWrapper(value.getLabel(), value.getValue()));
        }

        return options;
    }

    @AuraEnabled
    public static List<picklistWrapper> getClassOptions() {
        List<picklistWrapper> options = new List<picklistWrapper>();
        options.add(new picklistWrapper('--なし--', ''));

        try {
            for (Class__c cls : [SELECT Id, Name FROM Class__c]) {
                options.add(new picklistWrapper(cls.Name, cls.Id));
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching classes: ' + e.getMessage());
        }

        return options;
    }

    @AuraEnabled
    public static List<picklistWrapper> getLearningStatusOptions() {
        List<picklistWrapper> options = new List<picklistWrapper>();
        options.add(new picklistWrapper('--なし--', ''));

        try {
            // Retrieve picklist values for Learning_Status__c
            Schema.DescribeFieldResult fieldResult = Student__c.LearningStatus__c.getDescribe();
            List<Schema.PicklistEntry> picklistValues = fieldResult.getPicklistValues();

            for (Schema.PicklistEntry value : picklistValues) {
                options.add(new picklistWrapper(value.getLabel(), value.getValue()));
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching learning status: ' + e.getMessage());
        }

        return options;
    }
}
