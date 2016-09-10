$(document).ready(function(){
  $.getJSON( "build_log.json", function(myLog) {
    var myCommitId = myLog.commit_id.substring(0, 10);
    console.log(myCommitId);
    $.getJSON("../project.json", function (project) {
              $.each(project.commits, function (timestamp, commitId) {
                date = new Date(timestamp);
                var options = {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  timeZone: "UTC"
                };
                dateStr = date.toLocaleString("en-US", options);
                $.getJSON("../"+commitId+"/build_log.json", function(log) {
                  var html = '<tr><td>';
                  if(commitId == myCommitId)
                    html += '<b>'+dateStr+'</b>';
                  else
                    html += '<a href="../' + commitId + '">' + dateStr + '</a>';
                  html += '</td><td><i class="fa ';
                  switch(log.status){
                    case 'started': html += 'fa-spinner';
                          break;
                    case 'success': html += 'fa-check-circle-o';
                          break;
                    case 'warnings': html += 'fa-exclamation';
                          break;
                    case 'critical': html += 'fa-times-circle-o';
                          break;
                    case 'failed':
                    default: html += 'fa-chain-broken';
                          break;
                  }
                  html += '"></i></td></tr>';
                  $('#revisions').append(html);
                });
              });
            })
            .done(function () {
              console.log("second success");
            })
            .fail(function () {
              console.log("error");
            })
            .always(function () {
              console.log("complete");
            });
  });
});

