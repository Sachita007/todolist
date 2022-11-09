




module.exports.getDate = function() {
/// Date in String
var today = new Date();
var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
}

var day = today.toLocaleDateString("en-US", options);
return day

}

module.exports.getDay = function (){
  
    /// Day in String

    var today = new Date();
    var options = {
        weekday: "long",
    }
    
    var day = today.toLocaleDateString("en-US", options);
    return day
    
    }