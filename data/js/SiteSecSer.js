self.port.on("onSuccess", function(data) {
    $('[data-toggle="tooltip"]').tooltip();

    var table = $('#tableFile').DataTable({
        "initComplete": function( settings, json ) {
            $('div.loading').remove();
        },
        "columnDefs": [{
            "targets": 3,
            "createdCell": function (td, cellData, rowData, row, col) {
                $(td).attr('title', cellData);
            },
            "render": function (data, type, full, meta) {
                var d = new Date(0);
                d.setDate(data);
                d.setDate(d.getDate() + 1)
                
                return d.toDateString();
            }
        }, {
            "targets": 4,
            "createdCell": function (td, cellData, rowData, row, col) {
                $(td).attr('title', cellData);
            },
            "render": function (data, type, full, meta) {
                var lastrow = data.split(",");
                //date expire
                var d = new Date();
                d.setTime(lastrow[0]);

                return d.toUTCString();
            }
        }, {
            "targets": 5,
            "createdCell": function (td, cellData, rowData, row, col) {
                $(td).attr('title', cellData);
            },
            "render": function (data, type, full, meta) {
                //security property set
                var property = "";
                if(data == 0){
                    property = "SecurityPropertyUnset";
                }
                else if(data == 1){
                    property = "SecurityPropertySet";
                }
                else{
                    property = "SecurityPropertyKnockout";
                }

                return property;
            }

        }]
    });

    writeTable(data);
    self.port.emit("close-tab", "close");
});

self.port.on("onRejected", function(error) {
    $('[data-toggle="tooltip"]').tooltip();
    $('#tableFile').DataTable();
    if (error['operation'] === 'open'){
        alert("SiteSecurityServiceState.txt file not found.");
    }
});

$(function(){
    var dropTable = document.getElementById("tableFile");
    dropTable.addEventListener('dragover', handleDragOver, false);
    dropTable.addEventListener('drop', handleJSONDrop, false);
});

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

 function handleJSONDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files;
    // Loop through the FileList and read
    for (var i = 0, f; f = files[i]; i++) {
        if (f.name == 'SiteSecurityServiceState.txt' && f.type == 'text/plain') {
        var reader = new FileReader();
  
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            var table = $('#tableFile').DataTable();
            table.rows().remove().draw(false);
            var list = getList(e.target.result);
            writeTable(list);
          };
        })(f);

        reader.readAsText(f);
        } else {
            alert('This isn´t file SiteSecurityServiceState.txt');
        }
    }
}

function getList(file) {
    var list = file.split("\n");
    list.pop();
    return list;
}

function writeTable(list){
    for(var i = 0; i<list.length; i++) {
        var columns = list[i].split("\t");
        for (var j = 0; j < columns.length; j++) {
            switch (j) {
                case 0:
                    var firtsrow = columns[j].split(":");
                    var domain = firtsrow[0];
                    var HSTS = firtsrow[1];
                    break;
                case 1:
                    var score = columns[j];
                    break;
                case 2:
                    var dateDate = columns[j];

                    break;
                case 3:
                    var lastrow = columns[j].split(",");
                    //date expire
                    var dateExpire = lastrow[0];
                    var property = lastrow[1];

                    //include subdomains
                    var subDomains = lastrow[2] == 1 ? "includeSubdomains" : " - ";

                    if(lastrow[3] != null){
                        var pins = lastrow[3].split("=");
                        var temp = "";
                        for(var k = 0; k < pins.length; k++){
                            if(pins[k] != ""){
                                temp = pins[k] + "=" + "<br/>" + temp
                            }
                        }
                        var fpins = temp;
                    }
                    else{
                        var fpins = " - ";
                    }
                    break;
            }
        }
        var table = $('#tableFile').DataTable();
        table.row.add([domain, HSTS, score, dateDate, dateExpire, property, subDomains, fpins]).draw(false);
    }
}