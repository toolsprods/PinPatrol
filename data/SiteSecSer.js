self.port.on("onSuccess", function(data) {
    writeTable(data);
    //loadClickTable();
});

self.port.on("onRejected", function(error) {
    if (error['operation'] == 'open'){
        alert("SiteSecurityServiceState.txt file not found.")
    }
});

function loadClickTable(){
    var table = document.getElementById("tableFile");
    var tbody = table.getElementsByTagName("tbody")[0];
    tbody.onclick = function (e) {
        e = e || window.event;
        var target = e.srcElement || e.target;

        if(target.className == "listTableTitle"){
            alert("CAMBIA LA COLUMNA: " + target.innerHTML);
            if(target.innerHTML == "Domain"){
                var table = document.getElementById("tableFile");

                for(i = 0; i<table.cells.length; i++){

                }
            }
        }
    };
}

function writeTable(list){
    var table = document.getElementById("tableFile");
    list.pop() //delete the last
    console.log(list);


    for(i = 0; i<list.length; i++){
        var columns = list[i].split("\t");
        var row = table.insertRow(i+1);
        var bgColor;
        if ((i % 2) == 0){
            bgColor = "even";
        }
        else{
            bgColor = "odd";
        }

        row.className = bgColor;
        for(j = 0; j<columns.length; j++){
            switch (j){
                case 0:
                    //first and secon column
                    var firtsrow = columns[j].split(":");
                    var cell = row.insertCell(0);
                    cell.innerHTML = firtsrow[0];
                    cell.className = "listTableCell bold";

                    var cell = row.insertCell(1);
                    cell.innerHTML = firtsrow[1];
                    cell.className = "listTableCell";
                    break;
                case 1:
                    var cell = row.insertCell(2);
                    cell.innerHTML = columns[j];
                    cell.className = "listTableCell";
                    break;
                case 2:
                    var cell = row.insertCell(3);

                    var d = new Date("1970-01-01");
                    d.setDate(d.getTime() + columns[j]);

                    cell.innerHTML = d.toDateString();
                    cell.className = "listTableCell";
                    cell.title = columns[j];
                    break;

                case 3:
                    var lastrow = columns[j].split(",");
                    //date expire
                    var cell = row.insertCell(4);
                    var d = new Date();
                    d.setTime(lastrow[0]);

                    cell.innerHTML = d.toUTCString();
                    cell.className = "listTableCell";
                    cell.title = lastrow[0];
                    //security property set
                    if(lastrow[1] == 0){
                        var cell = row.insertCell(5);
                        cell.innerHTML = "SecurityPropertyUnset";
                        cell.className = "listTableCell";
                        cell.title = lastrow[1];
                    }
                    else if(lastrow[1] == 1){
                        var cell = row.insertCell(5);
                        cell.innerHTML = "SecurityPropertySet";
                        cell.className = "listTableCell";
                        cell.title = lastrow[1];
                    }
                    else{
                        var cell = row.insertCell(5);
                        cell.innerHTML = "SecurityPropertyKnockout";
                        cell.className = "listTableCell";
                        cell.title = lastrow[1];
                    }

                    //include subdomains
                    if(lastrow[2]== 1){
                        var cell = row.insertCell(6);
                        cell.innerHTML = "includeSubdomains";
                        cell.className = "listTableCell";
                        cell.title = lastrow[2];
                    }
                    else{
                        var cell = row.insertCell(6);
                        cell.innerHTML = " - ";
                        cell.className = "listTableCell";
                        cell.title = lastrow[2];
                    }

                    if(lastrow[3] != null){
                        var cell = row.insertCell(7);
                        var pins = lastrow[3].split("=");

                        for(k = 0; k < pins.length; k++){
                            if(pins[k] != ""){
                                var para = document.createElement("p");
                                para.className = "listTablePWide";
                                var node = document.createTextNode(pins[k] + "=");
                                para.appendChild(node);
                                cell.appendChild(para);
                            }
                        }
                        cell.className = "listTableCell";
                        cell.title = lastrow[3];
                    }
                    else{
                        var cell = row.insertCell(7);
                        cell.innerHTML = " - ";
                        cell.className = "listTableCell";
                    }

                    break;
            }
        }
        list[i] = columns;
    }
}