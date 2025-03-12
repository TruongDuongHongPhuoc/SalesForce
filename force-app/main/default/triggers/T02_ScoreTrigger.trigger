trigger T02_ScoreTrigger on Score__c (after insert, after update, after delete) {
    
    StudentManageSetting__c setting = StudentManageSetting__c.getOrgDefaults();
    if (setting.T02_InActive_flg__c == true) {
        return;
    }



    T02_ScoreTriggerHandler handler = new T02_ScoreTriggerHandler();
    
    Set<Id> subjectScoreIds = new Set<Id>();

    // Collect affected SubjectScore__c IDs
    if (Trigger.isInsert || Trigger.isUpdate || Trigger.isDelete) {
        for (Score__c score : Trigger.new != null ? Trigger.new : Trigger.old) {
            if (score.SubjectScore_look__c != null) {
                subjectScoreIds.add(score.SubjectScore_look__c);
            }
        }
    }

    if (!subjectScoreIds.isEmpty()) {
        handler.updateAverageScores(subjectScoreIds);
    }
}


