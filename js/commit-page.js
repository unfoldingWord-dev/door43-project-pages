$(document).ready(function(){
  var parent_url = window.location.href.split('?')[0].split('/').slice(0,-2).join('/');

  var request;
  if(window.XMLHttpRequest)
    request = new XMLHttpRequest();
  else
    request = new ActiveXObject("Microsoft.XMLHTTP");

  $.getJSON( "build_log.json", function(myLog) {
    var myCommitId = myLog.commit_id.substring(0, 10);
    console.log("Building sidebar for "+myCommitId);

    $('#left-sidebar').html('<div><h1>Revisions</h1><table width="100%" id="revisions"></table></div>');

    $.getJSON("../project.json", function (project) {
      $.each(project.commits.reverse(), function (index, commit) {
	request.open('GET', parent_url+"/"+commit.id+"/01.html", false);
	request.send();
        if (request.status === 404) {
           return true;
        }

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

        statusIcon = getStatusIcon(commit.status)

        if(commit.id == myCommitId){
          $('#last-updated').html(timeSince(date));
          $('#build-status-icon i').attr("class", "fa "+statusIcon);
        }

        var html = '<tr><td>';
        if(commit.id == myCommitId){
          html += '<b>'+dateStr+'</b>';
        }
        else
          html += '<a href="../' + commit.id + '/01.html">' + dateStr + '</a>';
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

