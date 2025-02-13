public with sharing class LWC_SearchStudentCtrl {
    public LWC_SearchStudentCtrl() {

    }
    
    @AuraEnabled (cacheable = false)
    public static List<Student__c> getAllStudents() {
        StudentManageSetting__c settings = StudentManageSetting__c.getOrgDefaults();
       // Retrieve the pagination setting
       Integer limit_record = Integer.valueOf(settings.S_MaxRecord__c) > 0 ? Integer.valueOf(settings.S_MaxRecord__c) : 100;

    
    // Optional: Set a default value if the setting is null
    if(limit_record == null || limit_record <= 0) {
        limit_record = 45; // Default value
    }
    
    try {
        return [
            SELECT Id, Firstname__c, Lastname__c, Gender__c, 
                   Birthday__c, StudentCode__c, LearningStatus__c, 
                   Class_look__c 
            FROM Student__c
            ORDER BY CreatedDate DESC 
            LIMIT :limit_record
        ];
    } catch (Exception e) {
        throw new AuraHandledException('Error fetching students: ' + e.getMessage());
    }
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
    public static Map<String, Object> getPaginationSettings() {
        // Fetch organization-wide default values from Custom Setting
        StudentManageSetting__c settings = StudentManageSetting__c.getOrgDefaults();
        Integer PageSize = Integer.valueOf(settings.S_RecordPerPage__c) > 0 ? Integer.valueOf(settings.S_RecordPerPage__c) :10 ;
        // Prepare response
        Map<String, Object> settingsMap = new Map<String, Object>();
        if (settings != null) {
            settingsMap.put('MaxStudentRecord', settings.S_MaxRecord__c);
            settingsMap.put('PageSize', PageSize);
        }
        return settingsMap;
    }

    @AuraEnabled
    public static void deleteSelectedStudents(List<Id> studentIds) {
        System.debug('student size' + studentIds.size());
         // Make sure studentIds is not empty
         if (studentIds != null && !studentIds.isEmpty()) {
            try {
                // Query the students to delete
                List<Student__c> studentsToDelete = [SELECT Id FROM Student__c WHERE Id IN :studentIds];
                
                // Delete the students
                delete studentsToDelete;
            } catch (Exception e) {
                throw new AuraHandledException('Error deleting students: ' + e.getMessage());
            }
        } else {
            throw new AuraHandledException('No student IDs provided.');
        }
    }
}