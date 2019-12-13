
data = []
$.getJSON("scores.json", function(json) {
    data = json // this will show the info it in firebug console
});


function getWeeks(){
const winids = ["win0", "win1", "win2", "win3", "win4"];
const loseids = ["lose0","lose1", "lose2", "lose3", "lose4"];

var winTeamNames = []
var loseTeamNames = []
winids.forEach(function (w, index){
    var e = document.getElementById(w);
    var val = e.options[e.selectedIndex].value;
    if (val != 'none'){
        winTeamNames.push(e.options[e.selectedIndex].value);
    }
});

loseids.forEach(function (l, index){
    var e = document.getElementById(l);
    var val = e.options[e.selectedIndex].value;
    if (val != 'none'){
        loseTeamNames.push(e.options[e.selectedIndex].value);
    }
});

if(winTeamNames.length > 0)
{
    winningWeeks = []
    winTeamNames.forEach(function(w, i){
        teamWin = []
        for(let i = 0; i<data.length; i++)
        {

            if (data[i]["winner"] == w)
            {
                teamWin.push(data[i])
            }
        }
        winningWeeks.push(teamWin)
    });
    loseWeeks = []
    loseTeamNames.forEach(function(l, i){
        teamlose = []
        for(let i = 0; i<data.length; i++)
        {

            if (data[i]["winner"] != l && (data[i]["awayTeam"] == l || data[i]["homeTeam"] == l))
            {
                teamlose.push(data[i])
            }
        }
        loseWeeks.push(teamlose)
    });

    validWeeks = []
    let foundMatch = false;

    //Loop through the first team in the list wins
    for(let i = 0; i<winningWeeks[0].length; i++)
    {

        gameWeek = winningWeeks[0][i];
        let season = gameWeek["season"]
        let week = gameWeek["week"]
        let isPlayoffs = gameWeek["isPlayoff"]

        currentWeek = [gameWeek]

        //Loop through the other games in the list
        for(let j = 1; j<winningWeeks.length; j++)
        {
        foundMatch = false;

            //Loop through the teams wins
            for(let weekidx = 0; weekidx<winningWeeks[j].length && !foundMatch; weekidx++)
            {

                if(winningWeeks[j][weekidx]["season"] == season && winningWeeks[j][weekidx]["week"] == week && winningWeeks[j][weekidx]["isPlayoff"] == isPlayoffs)
                {
                    currentWeek.push(winningWeeks[j][weekidx]);

                    foundMatch = true;
                }
            }


            if(!foundMatch)
            {
                break;
            }

        }
        for(let j = 0; j<loseWeeks.length; j++)
        {
        foundMatch = false;

            //Loop through the teams wins
            for(let weekidx = 0; weekidx<loseWeeks[j].length && !foundMatch; weekidx++)
            {

                if(loseWeeks[j][weekidx]["season"] == season && loseWeeks[j][weekidx]["week"] == week && loseWeeks[j][weekidx]["isPlayoff"] == isPlayoffs)
                {
                    currentWeek.push(loseWeeks[j][weekidx]);

                    foundMatch = true;
                }
            }


            if(!foundMatch)
            {
                break;
            }

        }
        if(currentWeek.length != winningWeeks.length + loseWeeks.length)
        {
            continue;
        }
        else
        {
            validWeeks.push(currentWeek)
        }
    }
    document.getElementById("count").innerHTML = "Number of occurrences: "+validWeeks.length;
    buildHtmlTable("#table", validWeeks);
}
}

function buildHtmlTable(selector, validWeeks) {
  for(var i=document.getElementById("table").rows.length;i>0;i--) {
document.getElementById("table").deleteRow(i-1);
}

  var columns = addAllColumnHeaders(validWeeks, selector);

  for (var i = 0; i < validWeeks.length; i++) {
    for(var subWeekIndex = 0; subWeekIndex < validWeeks[0].length; subWeekIndex++)
      {

        var row$ = $('<tr/>');
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {

            var cellValue = validWeeks[i][subWeekIndex][columns[colIndex]];
            if (cellValue == null) cellValue = "";
            row$.append($('<td/>').html(cellValue));
        }
        $(selector).append(row$);
    }

  }
  $("table tr").each(function(i){

    if ((i-1)%(validWeeks[0].length*2) < validWeeks[0].length){
        $(this).addClass("secondWeek");
    }
    else
    {
        $(this).addClass("firstWeek");
    }
});
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
function addAllColumnHeaders(validWeeks, selector) {
  var columnSet = [];
  var headerTr$ = $('<tr/>');

  for (var i = 0; i < validWeeks.length; i++) {
    var rowHash = validWeeks[0][i];
    for (var key in rowHash) {
      if ($.inArray(key, columnSet) == -1) {

        columnSet.push(key);
        headerTr$.append($('<th/>').html(changeName(key)));
      }
    }
  }
  $(selector).append(headerTr$);
  return columnSet;
}

function changeName(key) {

    const goodNames = {"date": "Game Date", "season":"Season", "week":"Week", "isPlayoff":"Playoffs!?!", "homeTeam":"Home Team", "homeScore":"Home Score", "awayScore":"Away Score", "awayTeam":"Away Team", "winner":"Winning Team"}
    return goodNames[key]
}