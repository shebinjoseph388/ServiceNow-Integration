module.exports = SnowRequests;

function SnowRequests(snInstanceURL, snCoookie, options) {
    this.snInstanceURL = snInstanceURL;
    this.snCoookie = snCoookie;
    this.options = options;
}


SnowRequests.prototype.getRequests = function (callBack) {
    var request = require('request');
    request.debug = this.options.verbose;
    request({
        baseUrl: this.snInstanceURL,
        method: 'GET',
        uri: '/api/now/table/sc_request?sysparm_limit=1',
        json: true,
        headers: {
            'Cookie': this.snCoookie
        }

    }, function (err, response, body) {
        callBack(err, response, body);
    });
}

SnowRequests.prototype.getSnowRequestDetails = function(requestId, callback) {
    var request = require('request');
    request.debug = this.options.verbose;
    request({
        baseUrl: this.snInstanceURL,
        method: 'GET',
        uri: '/api/now/table/sc_request?sysparm_limit=1&number=' + requestId,
        json: true,
        headers: {
            'Cookie': this.snCoookie
        }
    }, function(err, response, body) {
        callback(err, response, body);
    }
    );
}
SnowRequests.prototype.createChange = function(body, callBack) {
    console.log(body);
    var request = require('request');
    request.debug = this.options.verbose;
    var backout_plan = "Restore to the previous version using an old version number \n messages service : "+
    + "proxy service :"+
    + "error service: " +
    + "admin service:";
    var short_description = "Ethos Integration Prod deployment - "+body.region +" region";
    var description = "Issue: <Why is this Change Needed?>" +
        + "Suggested Change: <What Changes will be made?>"+
        + "Important: This release only includes the backend support (API) and is, therefore, not yet a customer facing enhancement. A separate user interface slice will be implemented in a " +
        + "subsequent release." +
        + "Non-Production Ticket REQ:   Customer share both Test and Prod environments in a single infrastructure. It applies for both Test and Prod environments " +
        + "Configuration Item: <What Server is being Changed?(Including Host Name)>" +
        + "https://messages.integration.elluciancloud."+ body.extension +"/health" +
        + "https://proxy.integration.elluciancloud." + body.extension +"/health" +
        + "https://errors.integration.elluciancloud." + body.extension +"/health" +
        + "https://admin.integration.elluciancloud." + body.extension +"/health" +
        + "Affected Services: Admin ,Messages ,Errors ,Proxy " +
        + "No risk involved with this deployment" +
        + "Who should be notified of this change? R&D, CSM, A.L,  P.S  and Product Management";
    var implementation_plan = "";
    for(var service in body.versions) {
        implementation_plan += service + " Service update:" ;
        implementation_plan += "Deploy the messages service using the Jenkins job: ";
        implementation_plan += "https://jenkins.devops.ellucian.com/jenkins/job/iHUB/job/infra/job/service/build?delay=0sec Parameters";
        implementation_plan += "Name: " + service;
        implementation_plan += "Version:" + body.versions[service];
        implementation_plan += "operation: apply";
        implementation_plan += "environment: prod";
        implementation_plan += "AWS_DEFAULT_REGION:" + body.region;
        implementation_plan += "run_integration_tests : check mark it ";
    }
    console.log(implementation_plan);
    request({
        baseUrl: this.snInstanceURL,
        method: 'POST',
        uri: '/api/now/table/change_request',
        json: true,
        body: {
            backout_plan: backout_plan, short_description: short_description, description: description, category:"Other",
            risk:3, implementation_plan:implementation_plan,impact:3,urgency:3,scope:3,start_date:body.start_date,end_date:body.end_date,cab_required:true 
        },
        headers: {
        'Cookie': this.snCoookie
        }
    }, function (err, response, body) {
        callBack(err, response, body);
    });
}