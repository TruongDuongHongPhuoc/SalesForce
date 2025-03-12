    //this class handle student trigger functionalities
    public class T01_StudentTriggerHandler {
        public T01_StudentTriggerHandler() {

        }
        // this function call when create new student to validate data
        public void HandleBeforeInsert(List<Student__c> studentList) {
            for (Student__c student : studentList) {
                // 🔹 Check required fields
                if (String.isBlank(student.FirstName__c) || 
                    String.isBlank(student.LastName__c) || 
                    String.isBlank(student.Gender__c) || 
                    student.Class_look__c == null ||  // 🔹 Fixed: Lookup fields are IDs, not Strings
                    String.isBlank(student.LearningStatus__c)) {
                    
                    student.addError('All of the fields must not empty before creating new student');
                }
    
                // 🔹 Check age (must be 18+)
                if (student.Birthday__c != null && student.Birthday__c > Date.today().addYears(-18)) {
                    student.addError('Student must reach 18 years old or more');
                }
            }
        }
        
        public void HandleAfterInsert(List<Student__c> studentList) {
            // 🔹 Collect Class_look__c IDs
            Set<Id> classIds = new Set<Id>();
            for (Student__c student : studentList) {
                if (student.Class_look__c != null) {
                    classIds.add(student.Class_look__c);
                }
            }
    
            if (!classIds.isEmpty()) {
                // 🔹 Query related Class__c records
                List<Class__c> classList = [SELECT Id, NumberOfStudent__c FROM Class__c WHERE Id IN :classIds];
    
                // 🔹 Update the student count // add an if here if needed to check everything in student
                for (Class__c classRecord : classList) {
                    classRecord.NumberOfStudent__c = (classRecord.NumberOfStudent__c == null ? 0 : classRecord.NumberOfStudent__c) + 1;
                }
    
                // 🔹 Perform DML update
                update classList;
            }
        }

        public void HandleBeforeUpdate(List<Student__c> studentList) {
            // 🔹 Collect old and new Class_look__c IDs
            Set<Id> oldClassIds = new Set<Id>();
            Set<Id> newClassIds = new Set<Id>();
            Map<Id, Id> studentClassChanges = new Map<Id, Id>(); // Maps studentId → oldClassId
        
            for (Student__c student : studentList) {
                Student__c oldStudent = (Student__c) Trigger.oldMap.get(student.Id); // Get the old record
        
                if (oldStudent.Class_look__c != student.Class_look__c) {  // 🔹 Class changed?
                    if (oldStudent.Class_look__c != null) {
                        oldClassIds.add(oldStudent.Class_look__c);
                        studentClassChanges.put(student.Id, oldStudent.Class_look__c);
                    }
                    if (student.Class_look__c != null) {
                        newClassIds.add(student.Class_look__c);
                    }
                }
            }
        
            // 🔹 Query related Class__c records
            Map<Id, Class__c> classMap = new Map<Id, Class__c>();
        
            if (!oldClassIds.isEmpty() || !newClassIds.isEmpty()) {
                List<Class__c> classList = [SELECT Id, NumberOfStudent__c FROM Class__c WHERE Id IN :oldClassIds OR Id IN :newClassIds];
                for (Class__c classRecord : classList) {
                    classMap.put(classRecord.Id, classRecord);
                }
            }
        
            // 🔹 Decrease student count in old classes
            for (Id studentId : studentClassChanges.keySet()) {
                Id oldClassId = studentClassChanges.get(studentId);
                if (classMap.containsKey(oldClassId)) {
                    Class__c oldClass = classMap.get(oldClassId);
                    oldClass.NumberOfStudent__c = (oldClass.NumberOfStudent__c == null || oldClass.NumberOfStudent__c == 0) ? 0 : oldClass.NumberOfStudent__c - 1;
                }
            }
        
            // 🔹 Increase student count in new classes
            for (Id newClassId : newClassIds) {
                if (classMap.containsKey(newClassId)) {
                    Class__c newClass = classMap.get(newClassId);
                    newClass.NumberOfStudent__c = (newClass.NumberOfStudent__c == null ? 0 : newClass.NumberOfStudent__c) + 1;
                }
            }
        
            // 🔹 Perform DML update
            if (!classMap.isEmpty()) {
                update classMap.values();
            }
        }

        public void HandleBeforeDelete(List<Student__c> studentList) {
            // 🔹 Collect Student IDs
            Set<Id> studentIds = new Set<Id>();
            for (Student__c student : studentList) {
                studentIds.add(student.Id);
            }
        
            if (!studentIds.isEmpty()) {
                // 🔹 Query related SubjectScore__c records
                List<SubjectScore__c> scoresToDelete = [SELECT Id FROM SubjectScore__c WHERE Student_look__c  IN :studentIds];
        
                // 🔹 Perform DML delete
                if (!scoresToDelete.isEmpty()) {
                    delete scoresToDelete;
                    System.debug('✅ Deleted ' + scoresToDelete.size() + ' related SubjectScore__c records.');
                }
            }
        }
        // minus quantity of student
        public void HandleAfterDelete(List<Student__c> studentList) {
            // 🔹 Collect Class IDs from deleted students
            Set<Id> classIds = new Set<Id>();
        
            for (Student__c student : studentList) {
                if (student.Class_look__c != null) {
                    classIds.add(student.Class_look__c);
                }
            }
        
            if (!classIds.isEmpty()) {
                // 🔹 Query the related Class__c records
                Map<Id, Class__c> classMap = new Map<Id, Class__c>(
                    [SELECT Id, NumberOfStudent__c FROM Class__c WHERE Id IN :classIds]
                );
        
                // 🔹 Reduce the student count
                for (Class__c classRecord : classMap.values()) {
                    classRecord.NumberOfStudent__c = (classRecord.NumberOfStudent__c == null || classRecord.NumberOfStudent__c == 0) 
                        ? 0 
                        : classRecord.NumberOfStudent__c - 1;
                }
        
                // 🔹 Perform DML update
                update classMap.values();
                System.debug('✅ Updated student count for ' + classMap.size() + ' classes.');
            }
        }
        
        

    
    }