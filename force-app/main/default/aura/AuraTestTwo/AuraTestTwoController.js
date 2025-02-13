({
    handleComponentEvent: function(cmp, event, helper) {
        var message = event.getParam("message");
        // Set the same attribute as declared in AuraTestTwo.cmp
        cmp.set("v.receivedMessage", message);
    },
    doInit: function(component, event, helper) {
        // Fetch the student data from the Apex controller
        component.gethander();
    }
})