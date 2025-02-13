public with sharing class TestController {
    
    @AuraEnabled
    public static List<Student__c> getAllStudents() {
        try {
            return [
                SELECT Id, Firstname__c, Lastname__c, Gender__c, 
                       Birthday__c, StudentCode__c, LearningStatus__c, 
                       Class_look__r.Name 
                FROM Student__c
                ORDER BY CreatedDate DESC
            ];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching students: ' + e.getMessage());
        }
    }      
    @AuraEnabled
    public static List<picklistWrapper> getGenderOptions() {
        List<picklistWrapper> options = new List<picklistWrapper>();
        
        // Add a default "None" option
        options.add(new picklistWrapper('--なし--', '')); // Label and value must be non-null

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
        options.add(new picklistWrapper('--なし--', '')); // Default option

        try {
            for (Class__c cls : [SELECT Id, Name FROM Class__c]) {
                options.add(new picklistWrapper(cls.Name, cls.Id)); // Name as label, Id as value
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching classes: ' + e.getMessage());
        }

        return options;
    }
    @AuraEnabled
    public static List<Student__c> searchStudents(String searchName, String selectedGender, String selectedClass, String searchStudentCode, Date selectedBirthday) {
        try {
            String query = 'SELECT Id, StudentCode__c, Firstname__c, Lastname__c, Birthday__c, ' +
                           'Gender__c, Class_look__c ' +
                           'FROM Student__c WHERE Id != null';
        
            // Dynamically add conditions based on user input
            if (String.isNotBlank(searchName)) {
                query += ' AND ( Firstname__c LIKE \'%' + String.escapeSingleQuotes(searchName) + '%\'';
                query += ' OR Lastname__c LIKE \'%' + String.escapeSingleQuotes(searchName) + '%\')';
            }
            
            if (String.isNotBlank(selectedGender)) {
                query += ' AND Gender__c = \'' + String.escapeSingleQuotes(selectedGender) + '\'';
            }
            
            if (String.isNotBlank(selectedClass)) {
                query += ' AND Class_look__c = \'' + String.escapeSingleQuotes(selectedClass) + '\'';
            }
            
            if (String.isNotBlank(searchStudentCode)) {
                query += ' AND StudentCode__c LIKE \'%' + String.escapeSingleQuotes(searchStudentCode) + '%\'';
            }
            
            if (selectedBirthday != null) {
                query += ' AND Birthday__c = :selectedBirthday'; // Use bind variable
            }
            
            query += ' ORDER BY StudentCode__c DESC';
            
            // Execute the query and return results
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException('Error during search: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Score__c> getAllScores() {
        // Query all Score__c records
        List<Score__c> scores = [SELECT Id, Score__c, ExamType__c, SubjectScore_look__c FROM Score__c];
        
        return scores;
    }
   
}