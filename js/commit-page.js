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
      commits = project.commits; // break out commits as array of objects
      var numericCommits = {}
      var numericDate;

      for(ky of commits) { // convert date to ms for sorting
        numericDate = Date.parse( ky );
        numericCommits[numericDate] = commits[ky];      
      }

      var commitKeys = Object.keys(numericCommits); // grab its keys
      var sortedCommits = {};
      commitKeys.sort();
      commitKeys.reverse(); 

      for(ky of commitKeys) { // reorder objects
        sortedCommits[k] = numericCommits[k];
      }

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

