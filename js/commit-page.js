$(document).ready(function(){
  $.getJSON( "build_log.json", function(myLog) {
    var myCommitId = myLog.commit_id.substring(0, 10);
    console.log("Building sidebar for "+myCommitId);

    sidebar = $('.sidebar');
    sidebar.html('<div><h3>Revisions</h3><table id="revisions" width="100%"></table></div>');

    $.getJSON("../project.json", function (project) {
      $.each(project.commits, function(index, commit) {
        console.log(commit)

        date = new Date(commit.created_at);
        var options = {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          timeZone: "UTC"
        };
        dateStr = date.toLocaleString("en-US", options);
        statusIcon = getStatusIcon(commit.status);

        if(commit.id == myCommitId){
            console.log(commit.id+" is mine");
            console.log(timeSince(date));
            console.log(statusIcon);
            $('#last-updated').html("Update "+timeSince(date)+" ago");
            $('#build-status-icon i').attr("class", "fa "+statusIcon);
        }

        var html = '<tr><td>';
        if(commit.id == myCommitId){
          html += '<b>'+dateStr+'</b>';
        }
        else
          html += '<a href="../' + commit.id + '/index.html">' + dateStr + '</a>';
        html += '</td><td><i class="fa '+statusIcon+'"></i></td></tr>';
        $('#revisions').append(html);
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

