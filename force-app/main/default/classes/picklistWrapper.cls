public with sharing class picklistWrapper {
    @AuraEnabled
    public String picklistLabel;
    
    @AuraEnabled
    public String pickListValue;
    
    // Constructor
    public picklistWrapper(String picklistLabel, String pickListValue) {
        this.picklistLabel = picklistLabel;
        this.pickListValue = pickListValue;
    }
}
