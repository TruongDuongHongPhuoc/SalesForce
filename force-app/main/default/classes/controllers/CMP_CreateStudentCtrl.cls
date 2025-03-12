public with sharing class CMP_CreateStudentCtrl {
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
    @AuraEnabled
    public static String createStudent(String firstName, String lastName, String gender, Date birthday, String learningStatus, String selectedClass) {
        try {
            System.debug('First Name: ' + firstName);
            System.debug('Last Name: ' + lastName);
            System.debug('Gender: ' + gender);
            System.debug('Birthday: ' + birthday);
            System.debug('Learning Status: ' + learningStatus);
            System.debug('Selected Class: ' + selectedClass);

            Student__c student = new Student__c(
                FirstName__c = firstName,
                LastName__c = lastName,
                Gender__c = gender,
                Birthday__c = birthday,
                Class_look__c = selectedClass,
                LearningStatus__c = learningStatus
            );
            insert student;
            return 'Student record created successfully!';
        } catch (Exception e) {
            throw new AuraHandledException('Error creating student record: ' + e.getMessage());
        }
}

}