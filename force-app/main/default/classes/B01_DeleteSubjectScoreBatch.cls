public with sharing class B01_DeleteSubjectScoreBatch implements Database.Batchable<SObject>, Database.Stateful{
    public Integer recordsProcessed = 0;
    public Integer recordsFailed = 0;


    public B01_DeleteSubjectScoreBatch() {

    }
    //get all the score needed to remove
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator('SELECT Id FROM SubjectScore__c LIMIT 10');
    }

    // Removing the records
    public void execute(Database.BatchableContext bc, List<SubjectScore__c> records) {
        if (records.isEmpty()) return;

        Database.DeleteResult[] deleteResults = Database.delete(records, false);
        for (Database.DeleteResult dr : deleteResults) {
            if (dr.isSuccess()) {
                recordsProcessed++;
            } else {
                recordsFailed++;
            }
        }
    }

    //Finish function save the result and execute batch 2
    public void finish(Database.BatchableContext bc) {    
        try {
            // Truy vấn AsyncApexJob
            List<AsyncApexJob> jobs = [SELECT Id, NumberOfErrors FROM AsyncApexJob WHERE Id = :bc.getJobId() LIMIT 1];
            if (jobs.isEmpty()) {
                return;
            }
            AsyncApexJob job = jobs[0];
    
            String result = (job.NumberOfErrors > 0) ? 'Error' : 'Success';
    
            BatchLog__c batchLog = new BatchLog__c(
                Name = 'B01_科目得点削除バッチ',
                StartTime__c = System.now(),
                EndTime__c = System.now(),
                Result__c = result,
                ErrorMessage__c = (job.NumberOfErrors > 0) ? 'Batch encountered errors.' : null 
            );
            try {
                insert batchLog;
            } catch (Exception e) {
                System.debug('❌ Lỗi khi insert BatchLog__c: ' + e.getMessage());
            }
    
            // Run Batch 2
            if (job.NumberOfErrors == 0) {
                Integer batchSize = 200;
                try {
                    StudentManageSetting__c setting = StudentManageSetting__c.getInstance();
                    if (setting != null && setting.B02_BatchSize__c != null) {
                        batchSize = setting.B02_BatchSize__c.intValue();
                    }
                } catch (Exception e) {
                }
    
                // B02_CreateSubjectScoreBatch b02Batch = new B02_CreateSubjectScoreBatch();  <-- release when finish Batch 2
                // Database.executeBatch(b02Batch, batchSize);
            } else {
                System.debug('❌ Batch finished with errors. Not starting B02.');
            }
    
        } catch (Exception e) {
            System.debug('❌ [ERROR] Exception in finish method: ' + e.getMessage());
            try {
                BatchLog__c errorLog = new BatchLog__c(
                    Name = 'B01_科目得点削除バッチ',
                    StartTime__c = System.now(),
                    EndTime__c = System.now(),
                    Result__c = 'Error',
                    ErrorMessage__c = e.getMessage()
                );
                insert errorLog;
            } catch (Exception logEx) {
                System.debug('⚠️ Failed to insert error log: ' + logEx.getMessage());
            }
        }
    }

}