function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

$(document).ready(function(){
  $.getJSON( "build_log.json", function(myLog) {
    var myCommitId = myLog.commit_id.substring(0, 10);
    console.log("Building sidebar for "+myCommitId);

    $.getJSON("../project.json", function (project) {
      projectCommits = project.commits; 
      // projectCommits are key:value pairs of date:hash
      // problem: date strings are not sortable for various reasons
      // answer: convert dates to ms then sort then convert them back
      //console.log("projectCommits: " + JSON.stringify(projectCommits));
      var numericCommits = {};
      var numericDate;

      projectKeys = Object.keys(projectCommits);
      //console.log("projectKeys: " + JSON.stringify(projectKeys));
     
      for(var k of projectKeys) {
        numericDate = Date.parse( k );
        //console.log("date key: " + k + " ms: " + numericDate);
        numericCommits[numericDate] = projectCommits[k];      
      }
      
      // now we have numericdate:hash 
      // get its keys and sort them latest first
      //console.log("numericCommits: " + JSON.stringify(numericCommits));
    
      var commitKeys = Object.keys(numericCommits); // grab its keys
      //console.log("commitKeys: " + JSON.stringify(commitKeys));
      var sortedCommits = {};
      commitKeys.sort();
      //console.log("commitKeys sorted: " + JSON.stringify(commitKeys));
      commitKeys.reverse(); 
      console.log("commitKeys reversed: " + JSON.stringify(commitKeys));

      for(var k of commitKeys) { // reorder objects
        console.log("k: " + k);
        sortedCommits[k] = numericCommits[k];
      }

      console.log("sortedCommits: " + JSON.stringify(sortedCommits));

      $.each(sortedCommits, function (timestamp, commitId) {
        $.getJSON("../"+commitId+"/build_log.json", function(log) {
          date = new Date(log.request_timestamp);
          var options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZone: "UTC"
          };
          dateStr = date.toLocaleString("en-US", options);

          statusIcon = '';
          switch(log.status){
            case 'requested': statusIcon = 'fa-spinner';
                  break;
            case 'started': statusIcon = 'fa-spinner';
                  break;
            case 'success': statusIcon = 'fa-check-circle-o';
                  break;
            case 'warnings': statusIcon = 'fa-exclamation';
                  break;
            case 'critical': statusIcon = 'fa-times-circle-o';
                  break;
            case 'failed':
            default: statusIcon = 'fa-chain-broken';
                  break;
          }

          if(commitId == myCommitId){
            $('#time-since-updated').html(timeSince(date));
            $('#status-icon').attr("class", "fa "+statusIcon);
          }

          var html = '<tr><td>';
          if(commitId == myCommitId){
            html += '<b>'+dateStr+'</b>';
          }
          else
            html += '<a href="../' + commitId + '/index.html">' + dateStr + '</a>';
          html += '</td><td><i class="fa '+statusIcon+'"></i></td></tr>';
          $('#revisions').append(html);
        })
        .done(function () {
          console.log("processed "+commitId+"/build_log.json");
        })
        .fail(function () {
          console.log("error reading "+commitId+"/build_log.json");
        }); // End getJSON
      }); // End each
    })
    .done(function () {
      console.log("processed project.json");
    })
    .fail(function () {
      console.log("error reading project.json");
    }); // End getJSON
  })
  .done(function () {
    console.log("processed my own build_log.json");
  })
  .fail(function () {
    console.log("error reading my own build_log.json");
  }); // End getJSON
});

