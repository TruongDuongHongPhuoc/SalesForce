({
    fireComponentEvent: function(component, event, helper) {
        // Use the correct event name registered in the component
        var cmpEvent = component.getEvent("ViewDetailComponentEvent");
        cmpEvent.setParams({
            "message": "Hello, I am Component Event!"
        });
        console.log("FIREEE EVENT DESU");
        cmpEvent.fire();
    }
})