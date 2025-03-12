trigger T01_StudentTrigger on Student__c (before insert,after insert, before update, before delete, after delete) {
    
    StudentManageSetting__c setting = StudentManageSetting__c.getOrgDefaults();
    if (setting.T01_InActive_flg__c == true) {
        return;
    }


    T01_StudentTriggerHandler handler = new T01_StudentTriggerHandler();

    if (Trigger.isInsert && Trigger.isBefore) {
        System.debug('✅ Before Insert Trigger Running...');
        handler.HandleBeforeInsert(Trigger.new);
    }

    if(Trigger.isInsert && Trigger.isAfter){
        System.debug('✅ Before Insert Trigger Running...');
        handler.HandleAfterInsert(Trigger.new);
    }

    if (Trigger.isUpdate && Trigger.isBefore) {
        System.debug('✅ Before Update Trigger Running...');
        handler.HandleBeforeUpdate(Trigger.new);
    }

    if (Trigger.isDelete && Trigger.isAfter) {
        System.debug('✅ Before Delete Trigger Running...');
        handler.HandleAfterDelete(Trigger.old);
    }
}
